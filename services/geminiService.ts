import { GoogleGenAI } from "@google/genai";
import { Booking, Vehicle } from "../types";

const apiKey = process.env.API_KEY || ''; 
// Note: In a real app, handle missing API key gracefully. 
// For this environment, we assume it's injected.

const ai = new GoogleGenAI({ apiKey });

export const askFleetAssistant = async (
  question: string,
  context: { bookings: Booking[]; vehicles: Vehicle[] }
): Promise<string> => {
  if (!apiKey) {
    return "API Key não configurada. Por favor, verifique a configuração.";
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const systemPrompt = `
      Você é um assistente inteligente de gestão de frota chamado "FleetAI".
      
      Dados Atuais:
      - Data de hoje: ${today}
      - Frota: ${JSON.stringify(context.vehicles.map(v => ({ id: v.id, name: v.name, plate: v.plate })))}
      - Agendamentos existentes: ${JSON.stringify(context.bookings)}
      
      Instruções:
      1. Responda perguntas sobre disponibilidade de veículos, quem está indo para onde, e conflitos de agenda.
      2. Seja conciso e útil.
      3. Se alguém perguntar sobre "carona" ou "compartilhar", identifique agendamentos para o mesmo destino.
      4. Formate a resposta em Markdown simples.
      5. Se não souber a resposta, diga que não encontrou a informação nos dados atuais.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3, // Low temperature for factual accuracy regarding the schedule
      }
    });

    return response.text || "Desculpe, não consegui processar sua solicitação.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao consultar o assistente inteligente.";
  }
};
