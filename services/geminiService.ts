import { GoogleGenAI, Type } from "@google/genai";

// Helper untuk mendapatkan API Key dengan aman (mendukung Vite dan environment biasa)
const getApiKey = (): string => {
  try {
    // Cek Vite env
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
      // @ts-ignore
      return import.meta.env.VITE_API_KEY;
    }
    // Cek Process env
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Gagal membaca env var");
  }
  return "";
};

export const analyzeVisit = async (name: string, purpose: string) => {
  const apiKey = getApiKey();

  // JIKA API KEY KOSONG: Jangan crash, tapi kembalikan pesan default
  if (!apiKey) {
    console.warn("API Key Gemini tidak ditemukan. Menggunakan pesan default.");
    return {
      category: 'Umum',
      message: `Terima kasih Bapak/Ibu ${name} sudah berkunjung. Data Anda telah kami catat.`
    };
  }

  try {
    // Inisialisasi hanya saat fungsi dipanggil (Lazy Load)
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Seorang tamu bernama "${name}" berkunjung ke SD Negeri 3 Karau Kuala dengan tujuan: "${purpose}".
      
      Tugasmu:
      1. Buat pesan ucapan terima kasih yang sopan dan relevan dalam Bahasa Indonesia.
      
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
            // category disimpan untuk kompatibilitas tipe data, meski tidak ditampilkan
            category: { type: Type.STRING }, 
            message: { type: Type.STRING }
          },
          required: ["message"]
        }
      }
    });

    const text = response.text;
    if (!text) return { category: 'Umum', message: 'Terima kasih atas kunjungan Anda.' };
    
    const result = JSON.parse(text);
    return {
        category: result.category || 'Umum',
        message: result.message
    };

  } catch (error) {
    console.error("Error analyzing visit with Gemini:", error);
    // Fallback jika kuota habis atau error lain
    return {
      category: 'Umum',
      message: `Terima kasih Bapak/Ibu ${name} sudah berkunjung ke SD Negeri 3 Karau Kuala.`
    };
  }
};