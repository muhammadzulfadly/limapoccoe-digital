export async function POST(req) {
  try {
    const token = req.headers.get("authorization");
    const formData = await req.formData();

    const evidence = formData.get("evidence");

    // Validasi ukuran file maksimal 2MB (jika file ada)
    if (evidence && evidence.size > 2 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ message: "Ukuran file melebihi batas maksimal 2MB." }),
        { status: 400 }
      );
    }

    const res = await fetch(`${process.env.API_SECRET_URL}/api/pengaduan`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Unexpected response (not JSON):", text);
      return new Response(JSON.stringify({ message: "Server error: Bukan JSON." }), {
        status: 500,
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ message: "Terjadi kesalahan server." }), {
      status: 500,
    });
  }
}
