import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

export async function GET(request, context) {
    try {
        const topUsers = await prisma.game.groupBy({
            by: ['user_id'],
            _count: {
                state: true
            },
            where: {
                state: 'completed'
            },
            orderBy: {
                _count: {
                    state: 'desc'
                }
            },
            take: 10
        });

        return NextResponse.json({ topUsers }, { status: 200 });
    } catch (error) {
        console.error("Error getting top users:", error);
        return NextResponse.json({ message: "Error getting top users" }, { status: 500 });
    }
}
