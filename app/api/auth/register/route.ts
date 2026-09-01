import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // E-posta kullanımda mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi ile zaten bir hesap mevcut." },
        { status: 409 }
      );
    }

    // Şifreyi hashle ve kullanıcıyı oluştur
    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name ? name.trim() : null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Oturum token'ı oluştur ve cookie'ye kaydet
    const token = createToken(user.id);
    const response = NextResponse.json({
      user,
      message: "Hesap başarıyla oluşturuldu.",
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 gün
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Register Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Kayıt sırasında bir hata oluştu.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
