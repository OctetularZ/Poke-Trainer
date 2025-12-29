import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const abilities = await prisma.pokemonAbility.findMany({
      select: {
        name: true,
      },
    });

    return NextResponse.json(abilities);
  } catch (error) {
    console.error("Error fetching abilities:", error);
    return NextResponse.json(
      { error: "Failed to fetch abilities" },
      { status: 500 }
    );
  }
}
