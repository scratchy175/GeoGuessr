import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

// add a new game
export async function POST(request) {
    try {
        const { userId, game_id, map_type, state } = await request.json();

        // Quick check to see if the user exists
        const userExists = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!userExists) {
          return res.status(404).json({ error: "User not found" });
        }
        else
        {
          console.log("User exists");
        }

        if (!userId || !game_id || !map_type || !state) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const game = await prisma.game.create({
            data: {
                game_id: "aaa",
                userId: parseInt(userId, 10),
                map_type: "World",
                state: "active",
            }
        });

        return NextResponse.json({ game }, { status: 200 });
    } catch (error) {
        console.error("Error adding game:", error);
        return NextResponse.json({ message: "Error adding game" }, { status: 500 });
    }
}