import bcrypt from 'bcrypt';
import prisma from '@/helpers/prisma';
import { NextResponse } from 'next/server';

export async function POST(request, context) {
    try {
        const { id, currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: 'Current and new password are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Current password is incorrect' }, { status: 401 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                password: hashedNewPassword,
            },
        });

        return NextResponse.json({ user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Error updating password:', error);
        return NextResponse.json({ message: 'Error updating password' }, { status: 500 });
    }
}
