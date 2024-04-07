import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";


export async function GET(request, context) {
    try {
        const {game_id} = context.params;

        if (!game_id) {
            return NextResponse.json({ message: "Game ID is required" }, { status: 400 });
        }

        const result = await prisma.round.findMany({
            where: {
                game_id
            },
        });

        const update = await prisma.game.update({
            where: {
                game_id
            },
            data: {
                state: "completed"
            }
        });

        return NextResponse.json({ result, update }, { status: 200 });
    } catch (error) {
        console.error("Error getting result:", error);
        return NextResponse.json({ message: "Error getting result" }, { status: 500 });
    }
}   
