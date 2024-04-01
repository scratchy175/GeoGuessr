import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { addGame } from "@/services/addGame";


function generateRandomID(length = 16) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

export const useGameActions = () => {
  const router = useRouter();

  const handlePlayClick = async () => {
    const session = await getSession();
    if (session) {
      const randomID = generateRandomID(); // Ensure generateRandomID is accessible
      const gameData = await addGame(session.user.id, randomID, "World", "active");
      console.log("Game added successfully!", gameData);
      router.push(`/game/${randomID}`);
    } else {
      console.log("No session found, redirecting to login.");
      // Handle no session
    }
  };

  return { handlePlayClick };
};
