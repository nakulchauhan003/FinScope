import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Download,
  Info,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Types
interface Customer {
  id: string;
  name: string;
  code: string;
  email: string;
}

interface LoanDetails {
  id: string;
  principalAmount: number;
  startDate: string;
  endDate: string;
  term: number; // In months
  interestRate: number;
  frequency: 'monthly' | 'quarterly' | 'weekly';
  status: 'active' | 'closed' | 'defaulted';
}

interface PaymentRecord {
  id: string;
  dueDate: string;
  paidDate: string | null;
  amount: number;
  principalPaid: number;
  interestPaid: number;
  status: 'on-time' | 'late' | 'waived' | 'pending';
  penaltyAmount: number;
  penaltyPaid: number;
}

interface PrepaymentRecord {
  id: string;
  date: string;
  amount: number;
  type: 'partial' | 'full';
}

interface RefundRecord {
  id: string;
  date: string;
  amount: number;
  reason: string;
  status: 'pending' | 'processed';
}

interface LoanLedger {
  loanDetails: LoanDetails;
  payments: PaymentRecord[];
  prepayments: PrepaymentRecord[];
  refunds: RefundRecord[];
}

interface CustomerDues {
  customer: Customer;
  loans: LoanLedger[];
}

// Helper functions
const calculateDaysRemaining = (installmentsLeft: number, frequency: 'monthly' | 'quarterly' | 'weekly'): number => {
  const daysPerFrequency = {
    weekly: 7,
    monthly: 30,
    quarterly: 90,
  };
  
  return installmentsLeft * daysPerFrequency[frequency];
};

const calculateInstallmentsLeft = (loan: LoanLedger): number => {
  const successfulPayments = loan.payments.filter(
    payment => payment.status === 'on-time' || payment.status === 'late'
  ).length;
  
  return loan.loanDetails.term - successfulPayments;
};

const calculateAccruedInterest = (loan: LoanLedger): number => {
  const { principalAmount, interestRate } = loan.loanDetails;
  const paidPrincipal = loan.payments.reduce((sum, payment) => sum + payment.principalPaid, 0);
  const outstandingPrincipal = principalAmount - paidPrincipal;
  
  // Find the date of the last payment or use start date if no payments
  const lastPaymentDate = loan.payments.length > 0 
    ? new Date(loan.payments.sort((a, b) => 
        new Date(b.paidDate || 0).getTime() - new Date(a.paidDate || 0).getTime()
      )[0].paidDate || loan.loanDetails.startDate)
    : new Date(loan.loanDetails.startDate);
  
  const today = new Date();
  const daysSinceLastPayment = differenceInDays(today, lastPaymentDate);
  
  // Daily interest rate (assuming 365 days per year)
  const dailyInterestRate = interestRate / 100 / 365;
  
  return outstandingPrincipal * dailyInterestRate * daysSinceLastPayment;
};

const calculateTotalPenalties = (loan: LoanLedger): number => {
  return loan.payments.reduce((sum, payment) => {
    // Only include penalties that haven't been paid
    return sum + (payment.penaltyAmount - payment.penaltyPaid);
  }, 0);
};

const calculatePrepaymentPenalty = (loan: LoanLedger): number => {
  const { principalAmount, interestRate } = loan.loanDetails;
  const paidPrincipal = loan.payments.reduce((sum, payment) => sum + payment.principalPaid, 0);
  const outstandingPrincipal = principalAmount - paidPrincipal;
  
  // Example: 2% of outstanding principal
  return outstandingPrincipal * 0.02;
};

const calculateNetDues = (loan: LoanLedger): number => {
  const { principalAmount } = loan.loanDetails;
  const paidPrincipal = loan.payments.reduce((sum, payment) => sum + payment.principalPaid, 0);
  const outstandingPrincipal = principalAmount - paidPrincipal;
  
  const accruedInterest = calculateAccruedInterest(loan);
  const totalPenalties = calculateTotalPenalties(loan);
  
  const totalRefunds = loan.refunds.reduce((sum, refund) => {
    if (refund.status === 'processed') {
      return sum + refund.amount;
    }
    return sum;
  }, 0);
  
  return outstandingPrincipal + accruedInterest + totalPenalties - totalRefunds;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

const generateFutureEMIs = (loan: LoanLedger): { dueDate: string; amount: number }[] => {
  const installmentsLeft = calculateInstallmentsLeft(loan);
  const { principalAmount, interestRate, frequency } = loan.loanDetails;
  const paidPrincipal = loan.payments.reduce((sum, payment) => sum + payment.principalPaid, 0);
  const outstandingPrincipal = principalAmount - paidPrincipal;
  
  // Simple EMI calculation formula: P * r * (1+r)^n / ((1+r)^n - 1)
  // where P = principal, r = interest rate per period, n = number of periods
  const r = (interestRate / 100) / 12; // Monthly interest rate
  const n = installmentsLeft;
  
  const emi = outstandingPrincipal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  
  // Find the latest due date or use today
  const latestDueDate = loan.payments.length > 0
    ? new Date(loan.payments.sort((a, b) => 
        new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
      )[0].dueDate)
    : new Date();
  
  const interval = frequency === 'monthly' ? 30 : frequency === 'quarterly' ? 90 : 7;
  
  return Array.from({ length: installmentsLeft }, (_, i) => {
    const dueDate = addDays(latestDueDate, (i + 1) * interval);
    return {
      dueDate: format(dueDate, 'yyyy-MM-dd'),
      amount: emi,
    };
  });
};

// Main component
const DuesModule: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customerDues, setCustomerDues] = useState<CustomerDues | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<Record<string, boolean>>({});
  const [prepaymentSimulation, setPrepaymentSimulation] = useState<{ amount: number; date: string } | null>(null);
  const [auditTrail, setAuditTrail] = useState<{ action: string; timestamp: string }[]>([]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a customer name or ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Log the search attempt for audit trail
      setAuditTrail(prev => [
        ...prev,
        { action: `Searched for customer: ${searchQuery}`, timestamp: new Date().toISOString() }
      ]);
      
      const response = await axios.get(`/api/customers/${encodeURIComponent(searchQuery)}/dues`);
      setCustomerDues(response.data);
      
      // Log successful fetch for audit trail
      setAuditTrail(prev => [
        ...prev,
        { action: `Successfully fetched dues for: ${response.data.customer.name}`, timestamp: new Date().toISOString() }
      ]);
    } catch (err) {
      console.error('Error fetching customer dues:', err);
      setError('Failed to fetch customer data. Please check the ID/name and try again.');
      
      // Log error for audit trail
      setAuditTrail(prev => [
        ...prev,
        { action: `Error searching: ${err.message}`, timestamp: new Date().toISOString() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle expanded loan details
  const toggleLoanDetails = (loanId: string) => {
    setExpandedLoanId(expandedLoanId === loanId ? null : loanId);
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate prepayment simulation
  const handlePrepaymentSimulation = (loanId: string, amount: number) => {
    const loan = customerDues?.loans.find(loan => loan.loanDetails.id === loanId);
    if (!loan) return;
    
    setPrepaymentSimulation({
      amount,
      date: new Date().toISOString().split('T')[0]
    });
    
    // Log simulation for audit trail
    setAuditTrail(prev => [
      ...prev,
      { action: `Simulated prepayment of ${formatCurrency(amount)} on loan ${loanId}`, timestamp: new Date().toISOString() }
    ]);
  };

  // Download repayment history
  const downloadRepaymentHistory = (loanId: string) => {
    const loan = customerDues?.loans.find(loan => loan.loanDetails.id === loanId);
    if (!loan) return;
    
    // This would typically generate a CSV or PDF
    alert("Downloading repayment history... (functionality to be implemented)");
    
    // Log download for audit trail
    setAuditTrail(prev => [
      ...prev,
      { action: `Downloaded repayment history for loan ${loanId}`, timestamp: new Date().toISOString() }
    ]);
  };

  // Reset the form
  const handleReset = () => {
    setSearchQuery('');
    setCustomerDues(null);
    setError(null);
    setExpandedLoanId(null);
    setExpandedSection({});
    setPrepaymentSimulation(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dues Management Module</h1>
      
      {/* Customer Lookup Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Customer Lookup</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter customer name or ID..."
            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200 flex items-center"
          >
            {isLoading ? 'Searching...' : 'Search'} {!isLoading && <Search className="ml-2 h-4 w-4" />}
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
      </div>

      {/* Customer Dues Display */}
      {customerDues && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{customerDues.customer.name}</h2>
              <p className="text-gray-600">Customer ID: {customerDues.customer.code}</p>
              <p className="text-gray-600">Email: {customerDues.customer.email}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-md">
              <p className="text-blue-800 font-semibold">Total Active Loans: {customerDues.loans.filter(loan => loan.loanDetails.status === 'active').length}</p>
            </div>
          </div>

          {/* Loans List */}
          {customerDues.loans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No loan records found for this customer.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {customerDues.loans.map((loan) => {
                const isExpanded = expandedLoanId === loan.loanDetails.id;
                const installmentsLeft = calculateInstallmentsLeft(loan);
                const daysRemaining = calculateDaysRemaining(installmentsLeft, loan.loanDetails.frequency);
                const maturityDate = addDays(new Date(), daysRemaining);
                const netDues = calculateNetDues(loan);
                const totalPenalties = calculateTotalPenalties(loan);
                const accruedInterest = calculateAccruedInterest(loan);
                const { principalAmount } = loan.loanDetails;
                const paidPrincipal = loan.payments.reduce((sum, payment) => sum + payment.principalPaid, 0);
                const outstandingPrincipal = principalAmount - paidPrincipal;

                return (
                  <div key={loan.loanDetails.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Loan Summary Header */}
                    <div 
                      className={`p-4 flex justify-between items-center cursor-pointer ${isExpanded ? 'bg-blue-50' : 'bg-white'}`}
                      onClick={() => toggleLoanDetails(loan.loanDetails.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Loan #{loan.loanDetails.id.substring(0, 8)}
                          </h3>
                          <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                            loan.loanDetails.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : loan.loanDetails.status === 'closed'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {loan.loanDetails.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">
                          {formatCurrency(loan.loanDetails.principalAmount)} at {loan.loanDetails.interestRate}% ({loan.loanDetails.frequency})
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-4">
                          <p className="text-gray-800 font-medium">Net Dues</p>
                          <p className="text-lg font-bold text-blue-600">{formatCurrency(netDues)}</p>
                        </div>
                        <div className="bg-gray-200 rounded-full p-1">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Loan Details */}
                    {isExpanded && (
                      <div className="p-4 border-t border-gray-200">
                        {/* Loan Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-gray-500 font-medium mb-2">Principal & Interest</h4>
                            <p className="flex justify-between">
                              <span>Original Principal:</span>
                              <span className="font-medium">{formatCurrency(loan.loanDetails.principalAmount)}</span>
                            </p>
                            <p className="flex justify-between mt-1">
                              <span>Outstanding Principal:</span>
                              <span className="font-medium">{formatCurrency(outstandingPrincipal)}</span>
                            </p>
                            <p className="flex justify-between mt-1">
                              <span>Accrued Interest:</span>
                              <span className="font-medium">{formatCurrency(accruedInterest)}</span>
                            </p>
                            <p className="flex justify-between mt-1">
                              <span>Interest Rate:</span>
                              <span className="font-medium">{loan.loanDetails.interestRate}%</span>
                            </p>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-gray-500 font-medium mb-2">Time Remaining</h4>
                            <div className="flex items-center mb-2">
                              <Clock className="h-5 w-5 text-gray-400 mr-2" />
                              <p className="font-medium">
                                {installmentsLeft} installments left
                              </p>
                            </div>
                            <div className="flex items-center mb-2">
                              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                              <p className="font-medium">
                                Approx. {Math.round(daysRemaining / 30)} months remaining
                              </p>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                              <p className="font-medium">
                                Est. Maturity: {format(maturityDate, 'dd MMM, yyyy')}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-md">
                            <h4 className="text-gray-500 font-medium mb-2">Penalties & Dues</h4>
                            <p className="flex justify-between">
                              <span>Late Penalties:</span>
                              <span className="font-medium text-red-600">{formatCurrency(totalPenalties)}</span>
                            </p>
                            <p className="flex justify-between mt-1">
                              <span>Prepayment Penalty:</span>
                              <span className="font-medium">{formatCurrency(calculatePrepaymentPenalty(loan))}</span>
                            </p>
                            <p className="flex justify-between mt-1 font-semibold text-lg">
                              <span>Total Due:</span>
                              <span className="text-blue-600">{formatCurrency(netDues)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Repayment History Timeline */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-gray-700 font-semibold text-lg flex items-center">
                              <Clock className="h-5 w-5 mr-2" /> 
                              Repayment History
                            </h4>
                            <button 
                              onClick={() => downloadRepaymentHistory(loan.loanDetails.id)}
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <Download size={16} className="mr-1" /> Download History
                            </button>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penalty</th>
                                </tr>
                              </thead>
                              <tbody>
                                {loan.payments.length === 0 ? (
                                  <tr>
                                    <td colSpan={7} className="px-4 py-3 text-center text-gray-500">No payment records found</td>
                                  </tr>
                                ) : (
                                  loan.payments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map((payment) => (
                                    <tr 
                                      key={payment.id} 
                                      className={`border-t border-gray-200 ${
                                        payment.status === 'late' ? 'bg-red-50' : 
                                        payment.status === 'waived' ? 'bg-yellow-50' : 
                                        payment.status === 'pending' ? 'bg-gray-50' : 'bg-white'
                                      }`}
                                    >
                                      <td className="px-4 py-3">{format(new Date(payment.dueDate), 'dd MMM, yyyy')}</td>
                                      <td className="px-4 py-3">
                                        {payment.paidDate 
                                          ? format(new Date(payment.paidDate), 'dd MMM, yyyy')
                                          : '-'}
                                      </td>
                                      <td className="px-4 py-3 font-medium">{formatCurrency(payment.amount)}</td>
                                      <td className="px-4 py-3">{formatCurrency(payment.principalPaid)}</td>
                                      <td className="px-4 py-3">{formatCurrency(payment.interestPaid)}</td>
                                      <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                          payment.status === 'on-time' ? 'bg-green-100 text-green-800' : 
                                          payment.status === 'late' ? 'bg-red-100 text-red-800' : 
                                          payment.status === 'waived' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {payment.status === 'on-time' && <CheckCircle size={12} className="mr-1" />}
                                          {payment.status === 'late' && <XCircle size={12} className="mr-1" />}
                                          {payment.status === 'waived' && <Info size={12} className="mr-1" />}
                                          {payment.status === 'pending' && <Clock size={12} className="mr-1" />}
                                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        {payment.penaltyAmount > 0 ? formatCurrency(payment.penaltyAmount) : '-'}
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Payment Visualization */}
                        <div className="mb-6">
                          <h4 className="text-gray-700 font-semibold text-lg mb-4">Payment Trend</h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={loan.payments.map(payment => ({
                                  date: format(new Date(payment.dueDate), 'MMM yyyy'),
                                  amount: payment.amount,
                                  principal: payment.principalPaid,
                                  interest: payment.interestPaid,
                                  penalty: payment.penaltyAmount
                                }))}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Total Amount" />
                                <Line type="monotone" dataKey="principal" stroke="#10b981" name="Principal" />
                                <Line type="monotone" dataKey="interest" stroke="#f59e0b" name="Interest" />
                                <Line type="monotone" dataKey="penalty" stroke="#ef4444" name="Penalty" />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Prepayments & Refunds */}
                        {(loan.prepayments.length > 0 || loan.refunds.length > 0) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Prepayments */}
                            {loan.prepayments.length > 0 && (
                              <div>
                                <h4 className="text-gray-700 font-semibold text-lg mb-3">Prepayments</h4>
                                <div className="bg-gray-50 rounded-md p-4">
                                  {loan.prepayments.map((prepayment) => (
                                    <div key={prepayment.id} className="mb-3 last:mb-0 pb-3 last:pb-0 border-b last:border-b-0 border-dashed border-gray-200">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">{format(new Date(prepayment.date), 'dd MMM, yyyy')}</span>
                                        <span className="font-medium">{formatCurrency(prepayment.amount)}</span>
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {prepayment.type === 'full' ? 'Full Prepayment' : 'Partial Prepayment'}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Refunds */}
                            {loan.refunds.length > 0 && (
                              <div>
                                <h4 className="text-gray-700 font-semibold text-lg mb-3">Refunds & Adjustments</h4>
                                <div className="bg-gray-50 rounded-md p-4">
                                  {loan.refunds.map((refund) => (
                                    <div key={refund.id} className="mb-3 last:mb-0 pb-3 last:pb-0 border-b last:border-b-0 border-dashed border-gray-200">
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">{format(new Date(refund.date), 'dd MMM, yyyy')}</span>
                                                                                <span className="font-medium">{formatCurrency(refund.amount)}</span>
                                      </div>
                                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>{refund.reason}</span>
                                        <span className={`${
                                          refund.status === 'processed' ? 'text-green-600' : 'text-amber-600'
                                        }`}>
                                          {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Future EMIs Section */}
                        <div className="mb-6">
                          <button 
                            onClick={() => toggleSection('futureEmis')}
                            className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-3"
                          >
                            {expandedSection['futureEmis'] ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                            Future EMI Schedule
                          </button>
                          
                          {expandedSection['futureEmis'] && (
                            <div className="bg-gray-50 rounded-md p-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {generateFutureEMIs(loan).slice(0, 6).map((emi, index) => (
                                  <div key={index} className="bg-white rounded-md p-3 shadow-sm">
                                    <div className="text-gray-500 text-sm">{format(new Date(emi.dueDate), 'dd MMM, yyyy')}</div>
                                    <div className="font-medium text-lg">{formatCurrency(emi.amount)}</div>
                                    <div className="text-xs text-gray-400">EMI #{index + 1}</div>
                                  </div>
                                ))}
                              </div>
                              {generateFutureEMIs(loan).length > 6 && (
                                <div className="text-center mt-4">
                                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                                    View All {generateFutureEMIs(loan).length} EMIs <ArrowRight size={14} className="inline" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Prepayment Simulation */}
                        <div className="mb-6">
                          <button 
                            onClick={() => toggleSection('prepaymentSimulation')}
                            className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-3"
                          >
                            {expandedSection['prepaymentSimulation'] ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                            Prepayment Simulation
                          </button>
                          
                          {expandedSection['prepaymentSimulation'] && (
                            <div className="bg-gray-50 rounded-md p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prepayment Amount
                                  </label>
                                  <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                      type="number"
                                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md p-3 border"
                                      placeholder="0.00"
                                      onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value)) {
                                          handlePrepaymentSimulation(loan.loanDetails.id, value);
                                        }
                                      }}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                      <select
                                        className="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                                        disabled
                                      >
                                        <option>INR</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="mt-4">
                                    <button
                                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                                    >
                                      Calculate Impact
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <h5 className="text-gray-700 font-medium mb-3">Simulation Results</h5>
                                  
                                  {prepaymentSimulation ? (
                                    <div className="space-y-3">
                                      <p className="flex justify-between text-sm">
                                        <span className="text-gray-600">Current Outstanding:</span>
                                        <span className="font-medium">{formatCurrency(outstandingPrincipal)}</span>
                                      </p>
                                      <p className="flex justify-between text-sm">
                                        <span className="text-gray-600">Prepayment Amount:</span>
                                        <span className="font-medium">{formatCurrency(prepaymentSimulation.amount)}</span>
                                      </p>
                                      <p className="flex justify-between text-sm">
                                        <span className="text-gray-600">Prepayment Fee:</span>
                                        <span className="font-medium">{formatCurrency(prepaymentSimulation.amount * 0.02)}</span>
                                      </p>
                                      <p className="flex justify-between text-sm font-semibold">
                                        <span>New Outstanding Balance:</span>
                                        <span>{formatCurrency(outstandingPrincipal - prepaymentSimulation.amount)}</span>
                                      </p>
                                      <hr className="my-3" />
                                      <p className="flex justify-between text-sm">
                                        <span className="text-gray-600">Current EMI:</span>
                                        <span className="font-medium">{formatCurrency(loan.payments[0]?.amount || 0)}</span>
                                      </p>
                                      <p className="flex justify-between text-sm">
                                        <span className="text-gray-600">New Estimated EMI:</span>
                                        <span className="font-medium">{formatCurrency((loan.payments[0]?.amount || 0) * 0.85)}</span>
                                      </p>
                                      <p className="flex justify-between text-sm">
                                        <span className="text-gray-600">Interest Savings:</span>
                                        <span className="font-medium text-green-600">{formatCurrency(prepaymentSimulation.amount * loan.loanDetails.interestRate / 100)}</span>
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="text-center py-4 text-gray-500">
                                      Enter a prepayment amount to see simulation results
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Loan Actions */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                            Generate Statement
                          </button>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200">
                            Process Payment
                          </button>
                          <button className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition duration-200">
                            Request Prepayment
                          </button>
                          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200">
                            View Document
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Audit Trail Section */}
      {auditTrail.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <button 
            onClick={() => toggleSection('auditTrail')}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-3"
          >
            {expandedSection['auditTrail'] ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
            Audit Trail
          </button>
          
          {expandedSection['auditTrail'] && (
            <div className="max-h-64 overflow-y-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {auditTrail.map((entry, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {format(new Date(entry.timestamp), 'dd MMM, yyyy HH:mm:ss')}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {entry.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          Need help with dues management? <a href="#" className="text-blue-600 hover:underline">View Documentation</a> or <a href="#" className="text-blue-600 hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default DuesModule; 
*/
