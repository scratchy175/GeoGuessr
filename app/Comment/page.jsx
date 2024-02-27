import React from "react";
import { motion } from "framer-motion";

const Comment = () => {
    return (
        <div className="bg-cover bg-center h-screen flex justify-center items-center" style={{ backgroundImage: "url('/planete.jpg')" }}>
            <div className="flex justify-center">
                {/* Carte 1 */}
                <div className="bg-gray-200 w-64 mx-2 rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-bold mb-2">Lancez une partie </h2>
                    <p>Pour commencer, cliquez sur le bouton
                        "Jouer" pour lancer une partie. Vous serez place aleatoirement quelque part dans le monde sur Google street view . </p>
                </div>

                {/* Carte 2 */}
                <div className="bg-gray-200 w-64 mx-2 rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-bold mb-2">Devinez l'emplacement</h2>
                    <p>Explorez votre environnement virtuel en faisant glisser l'image pour decouvrir des
                        indices tels que des panneaux de signalisation, des bâtiments emblématiques, des paysages et d'autres
                        elements geograpniques. Utilisez ces indices pour deviner votre emplacement aussi précisément que possible </p>
                </div>

                {/* Carte 3 */}
                <div className="bg-gray-200 w-64 mx-2 rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-bold mb-2">Gagnez des points </h2>
                    <p>Plus vous vous rapprochez de l'emplacement réel sur la carte ,plus vous
                        accumulez de points. Utilisez votre intuition, vos connaissances géographiques et votre sens de l'observation pour obtenir le meilleur
                        score possible et rivaliser avec d'autres joueurs du monde entier </p>
                </div>
            </div>
        </div>
    );

};

export default Comment;
