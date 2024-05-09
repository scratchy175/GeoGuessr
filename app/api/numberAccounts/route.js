import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

export async function GET(request, context) {
    try {
        const result = await prisma.user.count();

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error("Error getting result:", error);
        return NextResponse.json({ message: "Error getting result" }, { status: 500 });
    }
}
