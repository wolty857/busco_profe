import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { teacherProfileSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const userId = Number((session.user as any).id);
    const userRol = (session.user as any).rol;

    if (userRol !== "profesor") {
      return NextResponse.json(
        { error: "Solo los profesores pueden crear un perfil profesional" },
        { status: 403 }
      );
    }

    // Verificar si ya tiene perfil
    const existingProfile = await prisma.teacherProfile.findUnique({
      where: { user_id: userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Ya tienes un perfil profesional creado" },
        { status: 409 }
      );
    }

    const body = await request.json();

    // Validar datos con Zod
    const result = teacherProfileSchema.safeParse({
      ...body,
      precio_hora: Number(body.precio_hora),
    });

    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message);
      return NextResponse.json(
        { error: errors[0] },
        { status: 400 }
      );
    }

    const { materia, bio, precio_hora, modalidad, foto, video_url, telefono, titulos } = result.data;

    // Crear el perfil
    const profile = await prisma.teacherProfile.create({
      data: {
        user_id: userId,
        materia,
        bio,
        precio_hora,
        modalidad,
        foto,
        video_url,
        telefono,
        titulos: titulos ? JSON.stringify(titulos) : null,
      },
    });

    return NextResponse.json(
      {
        message: "Perfil profesional creado exitosamente",
        profile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
