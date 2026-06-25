import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/shared/lib/prisma";
import { sendVerificationEmail } from "@/shared/lib/mail";
import { z } from "zod";

const resendSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = resendSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { email } = result.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Para evitar enumeración de usuarios, siempre decimos que se envió
      return NextResponse.json({ message: "Si el correo existe, se ha enviado un enlace." }, { status: 200 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Este correo ya está verificado." }, { status: 400 });
    }

    // Buscar si ya existe un token, lo actualizamos, o creamos uno nuevo
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

    const existingToken = await prisma.verificationToken.findFirst({
      where: { identifier: email },
    });

    if (existingToken) {
      await prisma.verificationToken.update({
        where: { token: existingToken.token },
        data: { token, expires },
      });
    } else {
      await prisma.verificationToken.create({
        data: { identifier: email, token, expires },
      });
    }

    await sendVerificationEmail({ email, token, name: user.name });

    return NextResponse.json({ message: "Correo de verificación reenviado exitosamente." }, { status: 200 });
  } catch (error) {
    console.error("Error reenviando verificación:", error);
    const errorMessage = error instanceof Error ? error.message : "Desconocido";
    return NextResponse.json({ error: `Error interno del servidor: ${errorMessage}` }, { status: 500 });
  }
}
