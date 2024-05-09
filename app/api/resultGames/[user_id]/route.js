import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

export async function GET(request, context) {
    try {
        const {user_id} = context.params;
        const userIdInt = parseInt(user_id, 10);


        if (!user_id) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const result = await prisma.game.count({
            where: {
                user_id:userIdInt,
                state: "completed" // 'and' condition is implied between 'user_id' and 'state'
            }
        });

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error("Error getting result:", error);
        return NextResponse.json({ message: "Error getting result" }, { status: 500 });
    }
}