import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

export async function GET(request, context) {
    try {
        const {user_id} = context.params;
        const userIdInt = parseInt(user_id, 10);

        if (!user_id) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const maxScore = await prisma.game.findFirst({
            where: {
                user_id: userIdInt,
                state: "completed" // Filter completed games
            },
            orderBy: {
                score: "desc" // Order by score in descending order
            },
            select: {
                score: true // Select only the score field
            }
        });

        if (!maxScore) {
            return NextResponse.json({ message: "No completed games found for the user" }, { status: 404 });
        }

        return NextResponse.json({ maxScore: maxScore.score }, { status: 200 });
    } catch (error) {
        console.error("Error getting max score:", error);
        return NextResponse.json({ message: "Error getting max score" }, { status: 500 });
    }
}
