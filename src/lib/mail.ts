import nodemailer from "nodemailer";

interface SendVerificationEmailParams {
  email: string;
  token: string;
  nombre: string;
}

export async function sendVerificationEmail({ email, token, nombre }: SendVerificationEmailParams) {
  // Configuración del transporter usando SMTP (ej. Gmail)
  // En desarrollo se pueden dejar vacíos y nodemailer usará Ethereal o fallará suavemente si no hay credenciales
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SERVER_USER || "test@gmail.com",
      pass: process.env.EMAIL_SERVER_PASSWORD || "testpassword",
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`;

  const mailOptions = {
    from: '"Busco Profe" <noreply@buscoprofe.com>',
    to: email,
    subject: "Verifica tu cuenta en Busco Profe",
    html: `
      <div style="font-family: Arial, sans-serif; max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 style="color: #F472B6; font-size: 24px; font-weight: bold; margin-bottom: 16px;">¡Hola, ${nombre}!</h2>
        <p style="color: #4B5563; font-size: 16px; margin-bottom: 24px;">
          Gracias por registrarte en Busco Profe. Para activar tu cuenta y comenzar a utilizar la plataforma, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:
        </p>
        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${verificationUrl}" style="background-color: #F472B6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Verificar mi cuenta
          </a>
        </div>
        <p style="color: #9CA3AF; font-size: 14px;">
          Si no creaste esta cuenta, puedes ignorar este correo de forma segura.
        </p>
        <hr style="border: 0; border-top: 1px solid #F3F4F6; margin: 24px 0;" />
        <p style="color: #D1D5DB; font-size: 12px; text-align: center;">
          El equipo de Busco Profe
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de verificación enviado a:", email);
  } catch (error) {
    console.error("Error al enviar el correo de verificación:", error);
    throw new Error("No se pudo enviar el correo de verificación");
  }
}
