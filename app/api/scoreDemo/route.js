import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

export async function GET(request, context) {
    try {
        const demos = await prisma.demo.findMany(
            {
                orderBy: {
                    score: "desc"
                }
            }
        );

        return NextResponse.json({ demos }, { status: 200 });
    } catch (error) {
        console.error("Error getting result:", error);
        return NextResponse.json({ message: "Error getting demos" }, { status: 500 });
    }
}
