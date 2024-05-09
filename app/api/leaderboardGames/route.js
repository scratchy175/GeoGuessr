import prisma from "@/helpers/prisma";
import { NextResponse } from "next/server";

export async function GET(request, context) {
    try {
        const bestScore = await prisma.$queryRaw`
        SELECT u.id, u.username, MAX(r.score) as highest_score
        FROM "User" u
        JOIN "Game" g ON u.id = g.user_id
        JOIN "Round" r ON g.game_id = r.game_id
        WHERE g.state = 'completed'
        GROUP BY u.id, u.username
        ORDER BY highest_score DESC
        LIMIT 10;
    `;

    let games = await prisma.$queryRaw`
        SELECT u.id, u.username, COUNT(g.game_id) AS games_played
        FROM "User" as u
        LEFT JOIN "Game" as g ON u.id = g.user_id
        WHERE g.state = 'completed'
        GROUP BY u.id
        ORDER BY games_played DESC
        LIMIT 10;
    `;
    games = games.map(user => ({
        ...user,
        games_played: user.games_played.toString()
    }));

    const avgScore = await prisma.$queryRaw`
        SELECT u.id, u.username, AVG(r.score) AS average_score
        FROM "User" u
        JOIN "Game" g ON u.id = g.user_id
        JOIN "Round" r ON g.game_id = r.game_id
        WHERE g.state = 'completed'  -- Optional: consider only completed games
        GROUP BY u.id
        ORDER BY average_score DESC
        LIMIT 10;
    `;
    
        return NextResponse.json({ games, bestScore, avgScore }, { status: 200 });
    } catch (error) {
        console.error("Error getting top users:", error);
        return NextResponse.json({ message: "Error getting top users" }, { status: 500 });
    }
}
