import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    const { messages } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: messages,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu." },
      { status: 500 }
    );
  }
}
