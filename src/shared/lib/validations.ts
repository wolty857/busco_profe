import { z } from "zod";

export const registerSchema = z.object({
  name: z
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
  role: z.enum(["student", "teacher"], "Selecciona un rol válido"),
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
  subject: z
    .string()
    .min(2, "La subject debe tener al menos 2 caracteres")
    .max(100, "La subject no puede superar los 100 caracteres"),
  bio: z
    .string()
    .min(20, "La biografía debe tener al menos 20 caracteres")
    .max(2000, "La biografía no puede superar los 2000 caracteres"),
  hourlyRate: z
    .number()
    .int("El precio debe ser un número entero (sin decimales)")
    .min(1, "El precio debe ser mayor a 0")
    .max(100000, "El precio no puede superar los 100.000"),
  modality: z.enum(["presencial", "virtual", "ambas"], "Selecciona una modality válida"),
  photo: z
    .string()
    .url("Debes subir una photo de perfil válida"),
  video_url: z.string().optional(),
  phone: z
    .string()
    .regex(/^\d{7,15}$/, "Ingresa un número de WhatsApp válido (solo dígitos, entre 7 y 15 caracteres)"),
  titles: z.any().optional(),
});

export const studentProfileSchema = z.object({
  photo: z
    .string()
    .url("La URL de la photo no es válida")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^\d{7,15}$/, "Ingresa un número de WhatsApp válido (solo dígitos, entre 7 y 15 caracteres)"),
  bio: z
    .string()
    .max(500, "La biografía no puede superar los 500 caracteres")
    .optional()
    .or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TeacherProfileInput = z.infer<typeof teacherProfileSchema>;
export type AlumnoProfileInput = z.infer<typeof studentProfileSchema>;
