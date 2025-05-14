/*import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface LoanLedger {
  date: string;
  amount: number;
  status: string;
  penalty?: number;
}

const DuesDashboard: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [loanSummary, setLoanSummary] = useState<any>(null);
  const [ledger, setLedger] = useState<LoanLedger[]>([]);
  const [duesDetails, setDuesDetails] = useState<any>(null);

  const fetchCustomerDues = async () => {
    try {
      const res = await axios.get(`/api/customers/${customerId}/dues`);
      setLoanSummary(res.data.summary);
      setLedger(res.data.ledger);
      setDuesDetails(res.data.details);
    } catch (err) {
      console.error("Failed to fetch dues", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">🔍 Dues Lookup</h2>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Enter Customer ID or Name"
          className="border rounded px-3 py-2 w-full"
        />
        <Button onClick={fetchCustomerDues}>Search</Button>
      </div>

      {loanSummary && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Principal:</strong> ₹{loanSummary.principal}</div>
              <div><strong>Start Date:</strong> {loanSummary.startDate}</div>
              <div><strong>Installments Left:</strong> {loanSummary.installmentsLeft}</div>
              <div><strong>Time Remaining:</strong> {loanSummary.timeRemaining}</div>
              <div>
                <strong>Total Dues:</strong> ₹{loanSummary.totalDues}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(duesDetails, null, 2)}</pre>
                  </DialogContent>
                </Dialog>
              </div>
              <div>
                <strong>Refunds:</strong> ₹{loanSummary.totalRefunds}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(duesDetails?.refunds, null, 2)}</pre>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {ledger.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">📅 Repayment History</h3>
          <div className="bg-white rounded shadow overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Penalty</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((entry, idx) => (
                  <tr key={idx} className={entry.status === "Late" ? "bg-red-100" : ""}>
                    <td className="p-2">{entry.date}</td>
                    <td className="p-2">₹{entry.amount}</td>
                    <td className="p-2">{entry.status}</td>
                    <td className="p-2">{entry.penalty ? `₹${entry.penalty}` : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuesDashboard;*/



