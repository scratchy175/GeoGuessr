"use client";
import React from 'react';

const App = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex justify-center items-center">
      {/* Fond */}
      <img
        src="/classement/liege2.png"
        alt="Fond Liege"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Image par-dessus */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 md:w-3/4 lg:w-1/2 xl:w-1/3"
        style={{
          width: '90%', // Ajuster la largeur de la div
          height: '90%', // Ajuster la hauteur de la div
        }}
      >
        <img src="/classement/classement.png" alt="Globe" style={{ width: '100%', height: '100%' }} /> {/* Ajuster la largeur et la hauteur de l'image à 100% */}
      </div>

      {/* Première Image par-dessus */}
      <div
        className="absolute right-0"
        style={{
          right: '5%', // Ajustement pour une position plus à droite sur de plus petits écrans
          top: '45%', // Centrage vertical
          transform: 'translateY(-45%)', // Centrage vertical
          width: '90%', // Ajustement de la largeur pour la rendre responsive
        }}
      >
        <img src="/classement/classement1.png" alt="Globe" style={{ width: '100%' }} />
        <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-4xl text-center"
          style={{
            position: 'absolute',
            bottom: '10%', // Ajustement pour positionner le texte en bas de l'image
            left: '7%', // Ajustement pour positionner le texte à gauche
            width: '25%', // Ajustement de la largeur pour la rendre responsive
          }}>
          {/* Texte du classement */}
          <p className="or-color font-bold">1 - Premier</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="argent-color font-bold">2 - Deuxième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="bronze-color font-bold">3 - Troisième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">4 - Quatrième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">5 - Cinquième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">6 - Sixième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">7 - Septième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">8 - Huitième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">9 - Neuvième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">10 - Dixième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color font-bold">Vous - Seizième</p>
        </div>
      </div>

      {/* Deuxième Image par-dessus */}
      <div
        className="absolute right-0"
        style={{
          right: '5%', // Ajustement pour une position plus à droite sur de plus petits écrans
          top: '45%', // Centrage vertical
          transform: 'translateY(-45%)', // Centrage vertical
          width: '90%', // Ajustement de la largeur pour la rendre responsive
        }}
      >
        <img src="/classement/classement2.png" alt="Globe" style={{ width: '100%' }} />
        <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-4xl text-center"
          style={{
            position: 'absolute',
            bottom: '40%', // Ajustement pour positionner le texte au-dessus de l'image
            left: '37%', // Ajustement pour positionner le texte au centre
            width: '25%', // Ajustement de la largeur pour la rendre responsive
          }}>
          {/* Texte du classement */}
          <p className="or-color font-bold">1 - Premier</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="argent-color font-bold">2 - Deuxième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="bronze-color font-bold">3 - Troisième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">4 - Quatrième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">5 - Cinquième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">6 - Sixième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">7 - Septième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">8 - Huitième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">9 - Neuvième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">10 - Dixième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color font-bold">Vous - Seizième</p>
        </div>
      </div>

      {/* Troisième Image par-dessus */}
      <div
        className="absolute right-0"
        style={{
          right: '5%', // Ajustement pour une position plus à droite sur de plus petits écrans
          top: '45%', // Centrage vertical
          transform: 'translateY(-45%)', // Centrage vertical
          width: '90%', // Ajustement de la largeur pour la rendre responsive
        }}
      >
        <img src="/classement/classement3.png" alt="Globe" style={{ width: '100%' }} />
        <div className="absolute top-1/2 transform -translate-y-1/4 text-white text-4xl text-center"
          style={{
            position: 'absolute',
            bottom: '0%', // Ajustement pour positionner le texte au-dessus de l'image
            left: '69%', // Ajustement pour positionner le texte au centre
            width: '25%', // Ajustement de la largeur pour la rendre responsive
          }}>
          {/* Texte du classement */}
          <p className="or-color font-bold">1 - Premier</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="argent-color font-bold">2 - Deuxième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="bronze-color font-bold">3 - Troisième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">4 - Quatrième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">5 - Cinquième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">6 - Sixième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">7 - Septième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">8 - Huitième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">9 - Neuvième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color">10 - Dixième</p>
          <p className="argent-color font-bold" style={{ marginBottom: '5px' }}></p>
          <p className="text-custom-color font-bold">Vous - Seizième</p>
        </div>
      </div>
    </div>
  );
}

export default App;
