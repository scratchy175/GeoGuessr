import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

export async function GET(request, context) {
    try {
        const { user_id } = context.params;

        if (!user_id) {
            return NextResponse.json("User ID is required", { status: 400 });
        }

        const userIdInt = parseInt(user_id, 10);

        const averageScore = await prisma.round.aggregate({
            _avg: {
                score: true
            },
            where: {
                game: {
                    user_id: userIdInt, // Ensure the rounds are linked to games played by the user
                    state: "completed" // Optionally, consider only completed games
                }
            }
        });

        if (!averageScore) {
            return NextResponse.json("No completed games found for the user", { status: 404 });
        }

        return NextResponse.json(averageScore);
    } catch (error) {
        console.error("Error getting average score:", error);
        return NextResponse.json("Error getting average score", { status: 500 });
    }
}
