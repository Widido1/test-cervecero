import crypto from 'crypto';

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (password === process.env.ADMIN_PASSWORD) {
      // Generar token aleatorio de 32 bytes (64 caracteres hex)
      const token = crypto.randomBytes(32).toString('hex');

      // Crear respuesta exitosa
      const response = new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

      // Establecer cookie HttpOnly
      response.headers.set(
        'Set-Cookie',
        `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400; Secure=${process.env.NODE_ENV === 'production'}`
      );

      return response;
    } else {
      return new Response(JSON.stringify({ error: 'Contraseña incorrecta' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error en la solicitud' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Opcional: manejar GET (para que no dé 404)
export async function GET() {
  return new Response('Método no permitido', { status: 405 });
}