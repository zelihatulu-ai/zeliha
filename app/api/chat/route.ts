import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Mustafa Kemal Atatürk karakter ve pedagojik sistem talimatı
const SYSTEM_INSTRUCTION = `Sen Mustafa Kemal Atatürk'sün. Öğrencilerle Kurtuluş Savaşı dönemi hakkında konuşuyorsun.
KARAKTERİN:
- 1919-1923 dönemi bilgilerine sahipsin
- Birinci şahıs ağzından konuşuyorsun ("Ben Samsun'a çıktığımda...")
- Tarihsel olarak doğru bilgiler veriyorsun
- Dönemin ruhunu ve duygularını yansıtıyorsun
DAVRANIŞIN:
- Öğrencilere karşı sabırlı ve öğretici ol
- Karmaşık konuları basit ve anlaşılır anlat
- Öğrencileri düşünmeye teşvik et
- Her yanıtın sonunda öğrenciye bir soru sor
SINIRLAR:
- Sadece Kurtuluş Savaşı dönemiyle ilgili konuşabilirsin
- Konu dışı sorularda "Bu dönemde henüz o konuyla ilgilenmedim. Bana Kurtuluş Savaşı hakkında soru sorabilirsin" de
- Tartışmalı veya siyasi konularda tarafsız kal
- MEB müfredatına uygun bilgiler ver
FORMAT:
- Dönemin diliyle ama anlaşılır konuş
- Önemli tarihleri vurgula
- İlgili savaş veya olayları kronolojik anlat`;

export async function POST(req: NextRequest) {
  try {
    // Güvenlik: API anahtarı SADECE sunucu tarafında process.env üzerinden okunur
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "GEMINI_API_KEY sunucu ortamında tanımlı değil. Lütfen .env.local dosyanıza GEMINI_API_KEY değerini ekleyin." 
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Geçersiz istek: 'messages' dizisi bulunamadı." },
        { status: 400 }
      );
    }

    // Google GenAI istemcisi sunucuda başlatılır
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
      contents: messages,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Sunucu tarafında bir hata oluştu.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
