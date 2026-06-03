import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);
      return NextResponse.json(
        { error: errors[0] },
        { status: 400 }
      );
    }

    const { nombre, email, password, rol } = result.data;

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ya existe una cuenta con ese email" },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol,
      },
    });

    // Generar token de verificación
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24); // 24 horas

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Enviar correo de verificación
    try {
      await sendVerificationEmail({ email, token, nombre });
    } catch (emailError) {
      console.error("Error enviando correo de verificación:", emailError);
      // No devolvemos error de registro si el correo falla, pero podríamos. 
      // Por ahora continuamos y el usuario podrá pedir reenvío.
    }

    return NextResponse.json(
      {
        message: "Cuenta creada exitosamente",
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
