import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

// add a new demo game
export async function POST(request) {
    try {
        const { pseudo, score } = await request.json();

        if (!pseudo || !score) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const demo = await prisma.demo.create({
            data: {
                pseudo,
                score,
            }
        });

        return NextResponse.json({ demo }, { status: 200 });
    } catch (error) {
        console.error("Error adding game:", error);
        return NextResponse.json({ message: "Error adding demo" }, { status: 500 });
    }
}