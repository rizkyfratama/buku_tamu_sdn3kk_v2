import { GoogleGenAI, Type } from "@google/genai";

export const analyzeVisit = async (name: string, purpose: string) => {
  const apiKey = process.env.API_KEY;

  // JIKA API KEY KOSONG: Jangan crash, tapi kembalikan pesan default
  if (!apiKey) {
    console.warn("API Key Gemini tidak ditemukan. Menggunakan pesan default.");
    return {
      message: `Terima kasih Bapak/Ibu ${name} sudah berkunjung. Data Anda telah kami catat.`,
      category: 'Umum'
    };
  }

  try {
    // Inisialisasi hanya saat fungsi dipanggil (Lazy Load)
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Seorang tamu bernama "${name}" berkunjung ke SD Negeri 3 Bangkuang dengan tujuan: "${purpose}".
      
      Tugasmu:
      1. Klasifikasikan tujuan kunjungan ini menjadi salah satu kategori berikut: 'Dinas', 'Wali Murid', 'Paket/Kurir', 'Tamu Sekolah', atau 'Umum'.
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
            message: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["message", "category"]
        }
      }
    });

    const text = response.text;
    if (!text) return { message: 'Terima kasih atas kunjungan Anda.', category: 'Umum' };
    
    const result = JSON.parse(text);
    return {
        message: result.message,
        category: result.category || 'Umum'
    };

  } catch (error) {
    console.error("Error analyzing visit with Gemini:", error);
    // Fallback jika kuota habis atau error lain
    return {
      message: `Terima kasih Bapak/Ibu ${name} sudah berkunjung ke SD Negeri 3 Bangkuang.`,
      category: 'Umum'
    };
  }
};