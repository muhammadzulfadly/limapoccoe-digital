export async function POST(req) {
  const body = await req.json();

  try {
    const res = await fetch(`${process.env.API_SECRET_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Gagal menghubungi server." }), {
      status: 500,
    });
  }
}
