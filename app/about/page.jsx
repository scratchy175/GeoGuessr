import React from "react";
import { motion } from "framer-motion";


const about = () => {
    return (
        <div
            className="bg-cover bg-center flex justify-center items-center"
            style={{
                backgroundImage: "url('/planete.jpg')",
                minHeight: "100vh", // Pour s'assurer que l'image de fond couvre toute la hauteur de la fenêtre
            }}
        >

            <div className="bg-gray-200 w-full rounded-lg shadow-md p-4 mb-4">
                <h2 className="text-xl font-bold mb-2">A propos</h2>
                <p>Bienvenue sur notre site de jeu de géographie, un projet développé par une équipe d'étudiants universitaires avides de découvrir le monde qui nous entoure. Notre objectif est
                    de vous offrir une experience immersive et educative qui vous permettra d'explorer divers
                    endroits a travers le globe. tout en testant vos connaissances en géographie.
                    Que vous sovez un vovageur chevronne ou un amateur curieux. notre site vous propose une aventure virtuelle captivante. Plongez dans des paysages variés, des métropoles animées aux recoins les plus reculés, et mettez vos compétences géographiques à l'epreuve en devinant votre position sur la carte.
                    Nous croyons en l'importance de la découverte et de l'apprentissage. et c'est pourquoi nous
                    nous efforçons de rendre la géographie accessible er amusante pour tous. Notre site est constamment mis a jour avec de nouveaux défis. des fonctionnalites innovantes et des
                    contenus educatits pour ennchir votre expérience de jeu.
                    Nous sommes ravis de vous accompagner dans cette aventure géographique virtuelle, et nous espérons que notre site vous inspirera à explorer davantage notre planète fascinante
                    Merci de nous rejoindre dans cette exploration passionnante ! </p>
            </div>
        </div>
    );




};

export default about;