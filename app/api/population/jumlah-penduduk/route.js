export async function GET(request) {
  const token = request.headers.get("authorization");

  try {
    const apiUrl = `${process.env.API_SECRET_URL}/api/statistik/jumlah-penduduk`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: token || "",
        Accept: "application/json",
      },
      next: { revalidate: 0 }, // optional, jika ingin selalu fresh di nextjs cache
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("❌ Error response:", errorBody);
      return new Response(
        JSON.stringify({
          error: "Gagal mengambil detail dari server.",
          detail: errorBody,
        }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("💥 Fetch error:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}