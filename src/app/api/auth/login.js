// pages/api/auth/login.js
import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    // Generar token aleatorio de 32 bytes (64 caracteres hexadecimales)
    const token = crypto.randomBytes(32).toString('hex');

    // Establecer cookie HttpOnly
    res.setHeader(
      'Set-Cookie',
      `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400; Secure=${process.env.NODE_ENV === 'production'}`
    );
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
}