import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/lib/auth";
import prisma from "@/shared/lib/prisma";
import { teacherProfileSchema } from "@/shared/lib/validations";
import { sanitizeText } from "@/shared/lib/sanitize";

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

    if (userRol !== "teacher") {
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
      hourlyRate: Number(body.hourlyRate),
    });

    if (!result.success) {
      const errors = result.error.issues.map((e) => e.message);
      return NextResponse.json(
        { error: errors[0] },
        { status: 400 }
      );
    }

    const { subject, bio, hourlyRate, modality, photo, video_url, phone, titles } = result.data;

    // Sanitizar bio contra XSS
    const sanitizedBio = sanitizeText(bio);

    // Crear el perfil
    const profile = await prisma.teacherProfile.create({
      data: {
        user_id: userId,
        subject,
        bio: sanitizedBio,
        hourlyRate,
        modality,
        photo,
        video_url,
        phone,
        titles: titles || undefined,
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
        name: true,
        email: true,
        role: true,
        teacherProfile: true,
        reviewsReceived: {
          select: {
            id: true,
            stars: true,
            comment: true,
            createdAt: true,
            student: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ user }, {
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
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
    if (body.name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: body.name },
      });
    }

    // Update teacher profile if fields are provided
    const profileFields: any = {};
    const allowedFields = ["materia", "bio", "precio_hora", "modalidad", "foto", "video_url", "telefono", "titulos"];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "precio_hora") {
          profileFields[field] = Number(body[field]);
        } else if (field === "titulos") {
          profileFields[field] = JSON.stringify(body[field]);
        } else if (field === "bio") {
          profileFields[field] = sanitizeText(body[field]);
        } else {
          profileFields[field] = body[field];
        }
      }
    }

    if (Object.keys(profileFields).length > 0) {
      await prisma.teacherProfile.update({
        where: { user_id: userId },
        data: profileFields,
      });
    }

    return NextResponse.json({ message: "Perfil actualizado exitosamente" });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
