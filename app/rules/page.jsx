import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const rules = () => {
    return (

        <div className="bg-cover bg-center h-screen flex flex-col justify-center items-center" style={{ backgroundImage: "url('/planete.jpg')" }}>

            {/* Titre de la page */}
            <h1 className="text-3xl font-bold mb-8">Règlement</h1>

            {/* Section des cartes */}
            <div className="flex flex-col justify-center items-center">
                {/* Carte "Présentation" */}
                <div className="bg-gray-200 w-64 mx-2 rounded-lg shadow-md p-4 mb-4">
                    <h2 className="text-xl font-bold mb-2">Présentation</h2>
                    <p>Notre objectit est de faire de GeoGuesr un espace sur, equitable et amusant pour vous permettre de jouer ou de passer du temps avec vos amis. Nos Regles Communautaires sappliquent à tous les utilisateurs de GeoGuesr.</p>
                </div>

                {/* Carte "Tricherie" */}
                <div className="bg-gray-200 w-64 mx-2 rounded-lg shadow-md p-4 mb-4">
                    <h2 className="text-xl font-bold mb-2">Tricherie</h2>
                    <p>les tableaux de classement. les trophées et la competition sont reservés aux joueurs qui agissent et jouent de manière loyale et ne trichent pas.
                        Voici une liste non-exhaustive de ce que nous considérons être de la triche </p>
                </div>
            </div>
        </div>


    );

};

export default rules;
