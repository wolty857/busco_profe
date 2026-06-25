import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/shared/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            teacherProfile: true,
            studentProfile: true,
          },
        });

        if (!user) {
          throw new Error("No existe una cuenta con ese email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Contraseña incorrecta");
        }

        if (!user.emailVerified) {
          throw new Error("Debes verificar tu email para iniciar sesión. Revisa tu bandeja de entrada.");
        }

        // hasProfile depende del rol
        const hasProfile =
          user.role === "teacher"
            ? !!user.teacherProfile
            : !!user.studentProfile;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          image: user.teacherProfile?.photo || user.studentProfile?.photo || null,
          role: user.role,
          hasProfile,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).rol;
        token.hasProfile = (user as any).hasProfile;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).rol = token.role;
        (session.user as any).hasProfile = token.hasProfile;
        session.user.image = token.picture as string | null | undefined;

        // Refresh profile photo from DB to keep it current
        try {
          const userId = Number(token.id);
          if (token.role === "teacher") {
            const profile = await prisma.teacherProfile.findUnique({
              where: { user_id: userId },
              select: { photo: true },
            });
            if (profile?.photo) {
              session.user.image = profile.photo;
              token.picture = profile.photo;
            }
          } else {
            const profile = await prisma.studentProfile.findUnique({
              where: { user_id: userId },
              select: { photo: true },
            });
            if (profile?.photo) {
              session.user.image = profile.photo;
              token.picture = profile.photo;
            }
          }
        } catch {
          // Silently fail — use cached photo from token
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
