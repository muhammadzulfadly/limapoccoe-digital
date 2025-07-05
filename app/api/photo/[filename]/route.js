import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { filename } = params;

  try {
    const res = await fetch(`${process.env.API_SECRET_URL}/storage/${filename}`);

    if (!res.ok) {
      return new NextResponse("Gambar tidak ditemukan", { status: 404 });
    }

    const contentType = res.headers.get("content-type");
    const imageBuffer = await res.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Gagal proxy gambar:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
