import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
// Note: In a production app, the API key should be handled securely via a backend.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeVisit = async (name: string, purpose: string) => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Seorang tamu bernama "${name}" berkunjung ke SD Negeri 3 Karau Kuala dengan tujuan: "${purpose}".
      
      Tugasmu:
      1. Tentukan kategori kunjungan (contoh: Dinas, Wali Murid, Umum, Paket/Kurir, Alumni, Rapat).
      2. Buat pesan ucapan terima kasih yang sopan dan relevan dalam Bahasa Indonesia.
      
      Output dalam format JSON.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            message: { type: Type.STRING }
          },
          required: ["category", "message"]
        }
      }
    });

    const text = response.text;
    if (!text) return { category: 'Umum', message: 'Terima kasih atas kunjungan Anda.' };
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Error analyzing visit with Gemini:", error);
    return {
      category: 'Umum',
      message: `Terima kasih Bapak/Ibu ${name} sudah berkunjung ke SD Negeri 3 Karau Kuala.`
    };
  }
};