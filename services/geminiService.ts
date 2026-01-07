import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisData, GeminiModel } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema strictly
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    appearanceScore: {
      type: Type.NUMBER,
      description: "A score between 70 and 100 for the person's appearance.",
    },
    compliment: {
      type: Type.STRING,
      description: "A positive, complimentary evaluation of the person's temperament and image in Chinese.",
    },
    poem: {
      type: Type.STRING,
      description: "A summary of the evaluation in the form of a Chinese poem: two lines, seven characters each (七言二句).",
    },
    fortuneScore: {
      type: Type.NUMBER,
      description: "A fortune score between 70 and 100 for the current day.",
    },
    fortuneAdvice: {
      type: Type.STRING,
      description: "Fortune prediction and advice for the day in Chinese.",
    },
  },
  required: ["appearanceScore", "compliment", "poem", "fortuneScore", "fortuneAdvice"],
};

export const analyzeImage = async (base64Data: string, mimeType: string): Promise<AnalysisData> => {
  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: `你是一位精通面相学、审美高雅且富有文采的国学大师。请分析这张照片中的人物。
            
            请严格按照以下要求生成 JSON 格式的回复：
            1. **打分 (appearanceScore)**：对颜值进行打分。虽然需要真实，但为了照顾用户情绪，请确保分数在 70 到 100 分之间。
            2. **评价 (compliment)**：用优美的中文对人物形象进行点评。多用正面肯定的语言，从五官、气质、神态等方面进行具体的表扬。
            3. **结语 (poem)**：结合评价和打分，创作一首“七言二句”的古诗（共14字，分两句）作为总结。
            4. **运势 (fortuneScore)**：给出今日的运势指数，分数在 70 到 100 分之间。
            5. **运势点评 (fortuneAdvice)**：给出一段关于今日运势的解析和建议，语言要充满玄机但积极向上。
            
            请直接返回 JSON 数据。`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7, // Slightly creative but stable
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const parsedData = JSON.parse(text) as AnalysisData;
    return parsedData;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};