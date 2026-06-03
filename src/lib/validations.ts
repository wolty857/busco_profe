import { z } from "zod";

export const registerSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  email: z
    .string()
    .email("Ingresa un email válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, "La contraseña debe contener al menos una mayúscula, una minúscula y un número")
    .max(100, "La contraseña no puede superar los 100 caracteres"),
  confirmPassword: z
    .string(),
  rol: z.enum(["alumno", "profesor"], {
    errorMap: () => ({ message: "Selecciona un rol válido" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Ingresa un email válido"),
  password: z
    .string()
    .min(1, "Ingresa tu contraseña"),
});

export const teacherProfileSchema = z.object({
  materia: z
    .string()
    .min(2, "La materia debe tener al menos 2 caracteres")
    .max(100, "La materia no puede superar los 100 caracteres"),
  bio: z
    .string()
    .min(20, "La biografía debe tener al menos 20 caracteres")
    .max(2000, "La biografía no puede superar los 2000 caracteres"),
  precio_hora: z
    .number()
    .min(1, "El precio debe ser mayor a 0")
    .max(100000, "El precio no puede superar los 100.000"),
  modalidad: z.enum(["presencial", "virtual", "ambas"], {
    errorMap: () => ({ message: "Selecciona una modalidad válida" }),
  }),
  foto: z.string().optional(),
  video_url: z.string().optional(),
  telefono: z.string().optional(),
  titulos: z.any().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TeacherProfileInput = z.infer<typeof teacherProfileSchema>;
