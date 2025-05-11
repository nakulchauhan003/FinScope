import React, { useState } from "react";

interface Prediction {
  interestRate: number;
  duration: number;
}

interface Plan {
  name: string;
  termYears: number;
  emi: number;
  totalInterest: number;
  description: string;
}

const InterestPrediction: React.FC = () => {
  const [creditScore, setCreditScore] = useState(700);
  const [income, setIncome] = useState(50000);
  const [loanAmount, setLoanAmount] = useState(10000);
  const [preference, setPreference] = useState("Low Interest");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [plans, setPlans] = useState<Plan[] | null>(null);

  const calcEMI = (principal: number, rate: number, termYears: number) => {
    const monthlyRate = rate / 12 / 100;
    const months = termYears * 12;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  const generatePrediction = () => {
    let baseRate = 15 - (creditScore - 600) * 0.02 - income / 100000;
    baseRate = Math.max(5, Math.min(20, baseRate));
    let duration = 5;
    if (preference === "Short Term") duration = 3;
    else if (preference === "Low Interest") duration = 7;

    setPrediction({ interestRate: parseFloat(baseRate.toFixed(2)), duration });

    const basePlans = [
      { label: "Low EMI", years: 7 },
      { label: "Short Term", years: 3 },
      { label: "Balanced", years: 5 },
    ];

    const smartSortedPlans = basePlans.sort((a, b) => {
      if (preference === "Low Interest" || preference === "Short Term") return a.years - b.years;
      if (preference === "Low EMI") return b.years - a.years;
      return 0;
    });

    const opts: Plan[] = smartSortedPlans.map((p, idx) => {
      const emi = Math.round(calcEMI(loanAmount, baseRate, p.years));
      const totalInterest = Math.round(emi * p.years * 12 - loanAmount);
      return {
        name: `Option ${String.fromCharCode(65 + idx)} – ${p.label} Plan`,
        termYears: p.years,
        emi,
        totalInterest,
        description:
          p.label === "Low EMI"
            ? "Good for users wanting lowest monthly payment"
            : p.label === "Short Term"
            ? "Good for users wanting to close the loan fast"
            : "Good for users who want a balance between EMI & interest",
      };
    });

    setPlans(opts);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl">
      <section className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h1 className="text-2xl font-semibold mb-2">AI-Driven Loan Scenarios</h1>
        <p><strong>Purpose:</strong> To generate AI-driven loan scenarios that match a user's financial preferences and profile.</p>
        <p className="mt-2 italic">“Get 3 smart loan options tailored just for you — based on your profile and goals. Compare, understand, and choose confidently.”</p>
      </section>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Credit Score: {creditScore}</label>
          <input
            type="range"
            min={300}
            max={850}
            step={10}
            value={creditScore}
            onChange={(e) => setCreditScore(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Annual Income ($)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Loan Amount ($)</label>
          <input
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer Preference</label>
          <select
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option>Low Interest</option>
            <option>Short Term</option>
            <option>Low EMI</option>
            <option>Balanced</option>
          </select>
        </div>
        <button
          onClick={generatePrediction}
          className="w-full bg-blue-600 text-white py-2 rounded-2xl hover:bg-blue-700 transition"
        >
          Generate Plans
        </button>
      </div>

      {plans && (
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">AI Simulated Smart Loan Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan, i) => (
              <div key={plan.name} className="p-4 border rounded-2xl shadow-sm bg-gray-50">
                <h3 className="font-bold mb-1">{plan.name}</h3>
                <p><strong>Term:</strong> {plan.termYears} years</p>
                <p><strong>EMI:</strong> ₹{plan.emi.toLocaleString()}</p>
                <p><strong>Total Interest:</strong> ₹{plan.totalInterest.toLocaleString()}</p>
                <p className="mt-1 italic text-sm">{plan.description}</p>
                {i === 0 && (
                  <p className="text-green-700 font-medium text-sm mt-1">✅ Best match for your goal: “{preference}”</p>
                )}
                <button className="mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700 transition">
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default InterestPrediction;
