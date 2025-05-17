// controllers/loanController.ts
import { Request, Response } from 'express';
import { predictLoanApproval } from '../Services/loanServices';

export async function loanPredictionController(req: Request, res: Response) {
  try {
    const customerData = req.body; // e.g. { income, creditScore, debts, ... }
    // Call the service that uses LangChain + data APIs
    const predictionResult = await predictLoanApproval(customerData);
    res.json(predictionResult);
  } catch (error) {
    console.error('Loan prediction error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
