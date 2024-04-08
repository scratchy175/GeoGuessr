// pages/api/edit-profile.js

import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

export async function POST (request, context) {
    try {
        const { id, username} = await request.json();

        if (!username || !id) {
            return NextResponse.json({ message: "Username, email, and password are required" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                username,
            }
        });

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ message: "Error updating profile" }, { status: 500 });
    }
}