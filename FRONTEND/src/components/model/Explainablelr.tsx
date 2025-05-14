import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface Features {
  creditScore: number;
  income: number;
  age: number;
  existingLoans: number;
}

interface ShapValue {
  feature: string;
  value: number;
}

const ExplainableLoanModule: React.FC = () => {
  const baseline: Features = { creditScore: 650, income: 50000, age: 35, existingLoans: 1 };
  const weights: Record<keyof Features, number> = {
    creditScore: 0.005,
    income: 0.00001,
    age: -0.01,
    existingLoans: -0.3,
  };
  const intercept = -1;

  const [features, setFeatures] = useState<Features>({ ...baseline });
  const [probability, setProbability] = useState<number>(0);
  const [classification, setClassification] = useState<string>("");
  const [shapValues, setShapValues] = useState<ShapValue[]>([]);

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

  const computePrediction = (f: Features) => {
    const logit = intercept +
      weights.creditScore * f.creditScore +
      weights.income * f.income +
      weights.age * f.age +
      weights.existingLoans * f.existingLoans;
    return sigmoid(logit);
  };

  const computeShap = (f: Features) =>
    (Object.keys(weights) as (keyof Features)[]).map((key) => ({
      feature: key,
      value: parseFloat((weights[key] * (f[key] - baseline[key])).toFixed(4)),
    }));

  useEffect(() => {
    const prob = computePrediction(features);
    setProbability(parseFloat(prob.toFixed(3)));
    setClassification(prob >= 0.5 ? "Approved" : "Rejected");
    setShapValues(computeShap(features));
  }, [features]);

  const handleChange = (key: keyof Features, value: number) => {
    setFeatures((prev) => ({ ...prev, [key]: value }));
  };

  // Text summary of top contributors
  const topContributors = [...shapValues]
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-2xl font-bold mb-4">Explainable Loan Approval</h1>
      <p className="mb-6 text-gray-600">“Our platform shows not just the result but why. Adjust features to see live predictions and explanations.”</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(['creditScore', 'income', 'age', 'existingLoans'] as (keyof Features)[]).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">
              {key === 'existingLoans' ? 'Existing Loans' : key.charAt(0).toUpperCase() + key.slice(1)}: {features[key]}
            </label>
            <input
              type="range"
              min={key === 'creditScore' ? 300 : key === 'age' ? 18 : 0}
              max={key === 'creditScore' ? 850 : key === 'age' ? 80 : key === 'existingLoans' ? 10 : 200000}
              step={key === 'income' ? 1000 : 1}
              value={features[key]}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              className="w-full"
            />
            {key === 'income' && <p className="text-xs text-gray-500 mt-1">(increments of 1000)</p>}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Prediction</h2>
        <p><strong>Probability of Approval:</strong> {(probability * 100).toFixed(1)}%</p>
        <p><strong>Status:</strong> {classification}</p>
        <div className="mt-4">
          <h3 className="font-medium">Top Contributors:</h3>
          <ul className="list-disc list-inside">
            {topContributors.map((c) => (
              <li key={c.feature}>
                {c.feature.charAt(0).toUpperCase() + c.feature.slice(1)}: {c.value >= 0 ? '+' : ''}{c.value}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Feature Contributions (SHAP Values)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={shapValues} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="feature" type="category" width={100} />
            <Tooltip formatter={(val: number) => val.toFixed(4)} />
            <Bar dataKey="value" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExplainableLoanModule;
