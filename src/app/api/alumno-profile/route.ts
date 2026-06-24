import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { alumnoProfileSchema } from "@/lib/validations";
import { sanitizeText } from "@/lib/sanitize";

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

    if (userRol !== "alumno") {
      return NextResponse.json(
        { error: "Solo los alumnos pueden crear este tipo de perfil" },
        { status: 403 }
      );
    }

    // Verificar si ya tiene perfil
    const existingProfile = await prisma.alumnoProfile.findUnique({
      where: { user_id: userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Ya tienes un perfil creado" },
        { status: 409 }
      );
    }

    const body = await request.json();

    // Validar datos con Zod
    const result = alumnoProfileSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);
      return NextResponse.json(
        { error: errors[0] },
        { status: 400 }
      );
    }

    const { foto, telefono, bio } = result.data;

    // Sanitizar bio si se proporcionó
    const sanitizedBio = bio ? sanitizeText(bio) : null;

    // Crear el perfil
    const profile = await prisma.alumnoProfile.create({
      data: {
        user_id: userId,
        foto: foto || null,
        telefono,
        bio: sanitizedBio,
      },
    });

    return NextResponse.json(
      {
        message: "Perfil creado exitosamente",
        profile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando perfil de alumno:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = Number((session.user as any).id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        alumnoProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error obteniendo perfil de alumno:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = Number((session.user as any).id);
    const body = await request.json();

    // Update user name if provided
    if (body.nombre) {
      await prisma.user.update({
        where: { id: userId },
        data: { nombre: body.nombre },
      });
    }

    // Update alumno profile fields
    const profileFields: any = {};
    const allowedFields = ["foto", "telefono", "bio"];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "bio") {
          profileFields[field] = body[field] ? sanitizeText(body[field]) : null;
        } else {
          profileFields[field] = body[field];
        }
      }
    }

    if (Object.keys(profileFields).length > 0) {
      await prisma.alumnoProfile.update({
        where: { user_id: userId },
        data: profileFields,
      });
    }

    return NextResponse.json({ message: "Perfil actualizado exitosamente" });
  } catch (error) {
    console.error("Error actualizando perfil de alumno:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
