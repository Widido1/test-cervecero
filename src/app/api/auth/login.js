import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    // Crear un token simple (podría ser un UUID o un string con timestamp)
    const token = crypto.randomBytes(32).toString('hex');
    // Firmar el token con HMAC para evitar modificaciones
    const hmac = crypto.createHmac('sha256', process.env.COOKIE_SECRET);
    hmac.update(token);
    const signature = hmac.digest('hex');
    const cookieValue = `${token}.${signature}`;

    // Establecer la cookie httpOnly
    res.setHeader('Set-Cookie', `admin_auth=${cookieValue}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
}