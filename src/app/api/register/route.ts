import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message);
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
