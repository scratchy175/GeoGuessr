import RootLayout from "@/app/layout";
import GameComponent from "@/components/GameComponent";


export default function GamePage({ params }) {

    return (
        <>
            <div>
                <RootLayout hideNavbar={true}></RootLayout>
                <GameComponent />
            </div>
        </>
    );
}
