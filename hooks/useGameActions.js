import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
import { addGame } from "@/services/addGame";


export function generateRandomID(length = 16) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  export const useGameActions = () => {
    const router = useRouter();
  
    const handlePlayClick = async (gameTime) => { // Accept gameTime as a parameter
      const session = await getSession();
      if (session) {
        const randomID = generateRandomID();
        const gameData = await addGame(session.user.id, randomID, "World", "active", gameTime); // Pass gameTime to addGame (if necessary)
        console.log("Game added successfully!", gameData);
        sessionStorage.setItem('gameTime', gameTime);
        sessionStorage.setItem('demo', false);
        console.log(gameTime);
        router.push(`/game/${randomID}`);
      } else {
        // Handle no session
        alert("Vous devez être connecté pour jouer.");
      }
    };
  
    return { handlePlayClick };
  };
