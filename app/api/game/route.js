import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

// add a new game
export async function POST(request) {
    try {
        const { user_id, game_id, map_type, state } = await request.json();

        if (!user_id || !game_id || !map_type || !state) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const game = await prisma.game.create({
            data: {
                game_id,
                user_id,
                map_type,
                state,
            }
        });

        return NextResponse.json({ game }, { status: 200 });
    } catch (error) {
        console.error("Error adding game:", error);
        return NextResponse.json({ message: "Error adding game" }, { status: 500 });
    }
}