import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";
import * as bcryptjs from "bcryptjs";


export async function POST(request) {
    try {
        
        const { username, email, password } = await request.json();

        // check if user exists
        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "Missing Fields Required", result: error },
                { status: 400 }
            );
        }

        const userCheckEmail = await prisma.user.findFirst({
            where: { email: email.toLowerCase() }
        });
        const userCheckUsername = await prisma.user.findFirst({
            where: { username: username.toLowerCase() }
        });

        if (userCheckEmail && userCheckUsername) {
            return NextResponse.json({ message: "Email And Username Already Taken" }, { status: 400 });
        }


        if (userCheckEmail) {
            return NextResponse.json({ message: "Email Already Taken" }, { status: 400 });
        }

        if (userCheckUsername) {
            return NextResponse.json({ message: "Username Already Taken" }, { status: 400 });
        }



        const user = await prisma.user.create({
            data: {
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: await bcryptjs.hash(password, 10),
            },
        });



        const { password: hashedPassword, ...result } = user;

        return NextResponse.json({ result }, { status: 201 });
    } catch (error) {
        console.error("Prisma validation error:", error.message);

        return NextResponse.json(
            {
                message: "Something Went Wrong While Trying To Register",
                result: error,
            },
            { status: 500 }
        );
    }
}
