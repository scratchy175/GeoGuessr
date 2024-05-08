import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

export async function GET(request, context) {
    try {
        const { user_id } = context.params;
        const userIdInt = parseInt(user_id, 10);

        if (!user_id) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }
        const maxScore = await prisma.round.aggregate({
            _max: {
                score: true
            },
            where: {
                game: {
                    user_id: userIdInt, // Ensure the round is associated with a game played by the user
                    state: "completed" // Optionally filter only completed games if that applies
                }
            }
        });
        console.log("maxScore", maxScore);


        if (!maxScore) {
            return NextResponse.json("No completed games found for the user", { status: 404 });
        }

        return NextResponse.json(maxScore);
    } catch (error) {
        console.error("Error getting average score:", error);
        return NextResponse.json("Error getting average score", { status: 500 });
    }
}
