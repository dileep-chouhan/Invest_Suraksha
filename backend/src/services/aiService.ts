import { Configuration, OpenAIApi } from 'openai';
import { config } from '../config';

const configuration = new Configuration({
  apiKey: config.apis.openai,
});

const openai = new OpenAIApi(configuration);

export interface RiskProfile {
  riskTolerance: 'low' | 'medium' | 'high';
  investmentHorizon: string;
  financialGoals: string[];
  recommendedAssetAllocation: {
    equity: number;
    debt: number;
    gold: number;
    others: number;
  };
}

export interface InvestmentRecommendation {
  recommendations: {
    symbol: string;
    reason: string;
    targetPrice: number;
    riskLevel: string;
  }[];
  portfolioAdvice: string;
  riskWarning: string;
}

export class AIService {
  async assessRiskProfile(userResponses: {
    age: number;
    income: string;
    investmentExperience: string;
    riskComfortLevel: number;
    investmentGoals: string[];
    timeHorizon: string;
  }): Promise<RiskProfile> {
    const prompt = `
      Based on the following user information, provide a risk assessment and asset allocation recommendation:
      
      Age: ${userResponses.age}
      Income: ${userResponses.income}
      Investment Experience: ${userResponses.investmentExperience}
      Risk Comfort Level (1-10): ${userResponses.riskComfortLevel}
      Investment Goals: ${userResponses.investmentGoals.join(', ')}
      Time Horizon: ${userResponses.timeHorizon}
      
      Provide a JSON response with:
      - riskTolerance (low/medium/high)
      - investmentHorizon
      - financialGoals array
      - recommendedAssetAllocation with equity, debt, gold, others percentages (should sum to 100)
    `;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 500,
        temperature: 0.3,
      });

      const aiResponse = response.data.choices[0]?.text?.trim();
      if (aiResponse) {
        return JSON.parse(aiResponse);
      }
    } catch (error) {
      console.error('AI risk assessment error:', error);
    }

    // Fallback logic
    let riskTolerance: 'low' | 'medium' | 'high' = 'medium';
    if (userResponses.age > 50 || userResponses.riskComfortLevel < 4) {
      riskTolerance = 'low';
    } else if (userResponses.riskComfortLevel > 7 && userResponses.age < 35) {
      riskTolerance = 'high';
    }

    return {
      riskTolerance,
      investmentHorizon: userResponses.timeHorizon,
      financialGoals: userResponses.investmentGoals,
      recommendedAssetAllocation: {
        equity: riskTolerance === 'high' ? 70 : riskTolerance === 'medium' ? 60 : 40,
        debt: riskTolerance === 'high' ? 20 : riskTolerance === 'medium' ? 30 : 50,
        gold: 5,
        others: riskTolerance === 'high' ? 5 : riskTolerance === 'medium' ? 5 : 5
      }
    };
  }

  async generateInvestmentRecommendations(
    riskProfile: RiskProfile,
    currentMarketData: any[]
  ): Promise<InvestmentRecommendation> {
    const prompt = `
      Based on the user's risk profile and current market data, provide investment recommendations:
      
      Risk Tolerance: ${riskProfile.riskTolerance}
      Investment Horizon: ${riskProfile.investmentHorizon}
      Goals: ${riskProfile.financialGoals.join(', ')}
      
      Current Market Data: ${JSON.stringify(currentMarketData.slice(0, 5))}
      
      Provide specific stock recommendations with reasons, considering SEBI guidelines for retail investors.
      Focus on fundamentally strong companies and include appropriate risk warnings.
      
      Return JSON with:
      - recommendations array (symbol, reason, targetPrice, riskLevel)
      - portfolioAdvice string
      - riskWarning string
    `;

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 800,
        temperature: 0.4,
      });

      const aiResponse = response.data.choices[0]?.text?.trim();
      if (aiResponse) {
        return JSON.parse(aiResponse);
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
    }

    // Fallback recommendations
    return {
      recommendations: [
        {
          symbol: 'RELIANCE',
          reason: 'Strong fundamentals and diversified business model',
          targetPrice: 2500,
          riskLevel: 'medium'
        },
        {
          symbol: 'TCS',
          reason: 'Leading IT services company with consistent growth',
          targetPrice: 3800,
          riskLevel: 'low'
        }
      ],
      portfolioAdvice: `Based on your ${riskProfile.riskTolerance} risk tolerance, focus on diversified blue-chip stocks and maintain a balanced portfolio.`,
      riskWarning: 'All investments are subject to market risks. Please read all scheme-related documents carefully before investing.'
    };
  }
}
