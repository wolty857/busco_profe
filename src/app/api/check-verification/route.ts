import { NextResponse } from "next/server";
import prisma from "@/shared/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    if (!user || !user.emailVerified) {
      return NextResponse.json({ verified: false }, { status: 200 });
    }

    return NextResponse.json({ verified: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}
