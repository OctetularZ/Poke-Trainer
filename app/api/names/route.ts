import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pokemon = await prisma.pokemon.findMany({
      select: {
        name: true,
        slug: true,
      },
    });

    return NextResponse.json(pokemon);
  } catch (error) {
    console.error("Error fetching pokemon names:", error);
    return NextResponse.json(
      { error: "Failed to fetch pokemon names" },
      { status: 500 }
    );
  }
}
