import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/verificar-email?error=missing_token", request.url));
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(new URL("/verificar-email?error=invalid_token", request.url));
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.redirect(new URL("/verificar-email?error=expired_token", request.url));
    }

    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/verificar-email?error=user_not_found", request.url));
    }

    // Actualizar el usuario
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
      },
    });

    // Eliminar el token usado
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.redirect(new URL("/verificar-email?success=true", request.url));
  } catch (error) {
    console.error("Error verificando email:", error);
    return NextResponse.redirect(new URL("/verificar-email?error=server_error", request.url));
  }
}
