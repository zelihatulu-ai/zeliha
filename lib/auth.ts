import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const AUTH_SECRET = process.env.AUTH_SECRET || "ataturk-tarih-projesi-guvenli-anahtar-2026";
const COOKIE_NAME = "auth_session_token";

/**
 * Şifreyi tuz (salt) ekleyerek güvenli bir şekilde hashler (PBKDF2).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Girilen şifrenin saklanan hash ile eşleşip eşleşmediğini doğrular.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === key;
}

/**
 * Kullanıcı ID'si ve e-posta için imzalı bir oturum token'ı oluşturur.
 */
export function createToken(userId: string): string {
  const payload = JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }); // 7 gün
  const base64Payload = Buffer.from(payload).toString("base64url");
  const signature = crypto.createHmac("sha256", AUTH_SECRET).update(base64Payload).digest("base64url");
  return `${base64Payload}.${signature}`;
}

/**
 * Oturum token'ını doğrular ve userId döner.
 */
export function verifyToken(token: string): string | null {
  try {
    const [base64Payload, signature] = token.split(".");
    if (!base64Payload || !signature) return null;

    const expectedSignature = crypto.createHmac("sha256", AUTH_SECRET).update(base64Payload).digest("base64url");
    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(base64Payload, "base64url").toString("utf-8"));
    if (payload.exp < Date.now()) return null; // Süresi dolmuş

    return payload.userId;
  } catch {
    return null;
  }
}

/**
 * Sunucu tarafında mevcut oturum açmış kullanıcıyı getirir.
 */
export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const userId = verifyToken(token);
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
