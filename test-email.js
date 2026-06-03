const nodemailer = require("nodemailer");
require("dotenv").config();

async function testConnection() {
  console.log("Testeando conexión con SMTP...");
  console.log("Usuario configurado:", process.env.EMAIL_SERVER_USER);
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  try {
    const success = await transporter.verify();
    if (success) {
      console.log("✅ Conexión exitosa. Las credenciales son válidas.");
    }
  } catch (error) {
    console.error("❌ Error de conexión:", error.message);
  }
}

testConnection();
