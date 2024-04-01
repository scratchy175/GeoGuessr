import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

// add a new round
export async function POST(request) {
    try {
        const {game_id, round_nb, score, distance, time, user_point, map_point } = await request.json();
        if (!game_id || round_nb === undefined || score === undefined || distance === undefined || time === undefined || !user_point || !map_point) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const round = await prisma.round.create({
            data: {
                game_id,
                round_nb,
                score,
                distance,
                time,
                user_point,
                map_point,
            }
        });

        return NextResponse.json({ round }, { status: 200 });
    } catch (error) {
        console.error("Error adding round:", error);
        return NextResponse.json({ message: "Error adding round" }, { status: 500 });
    }
}