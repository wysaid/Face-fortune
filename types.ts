export interface AnalysisData {
  appearanceScore: number;
  compliment: string;
  poem: string;
  fortuneScore: number;
  fortuneAdvice: string;
}

export enum GeminiModel {
  FLASH = 'gemini-flash-latest', // Alias for 2.5 Flash as per guidelines
}