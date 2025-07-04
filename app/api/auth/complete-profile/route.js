export async function POST(req) {
  try {
    const body = await req.json();
    const token = req.headers.get("Authorization");

    const res = await fetch(`${process.env.API_SECRET_URL}/api/profile/lengkapi-profil`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ message: "Terjadi kesalahan server." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
