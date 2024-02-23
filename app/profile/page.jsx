import React from 'react';


const profile = () => {


    const user = {
        username: 'john_doe',
        email: 'john@example.com',
        // Autres informations du profil
    };


    return (
        <div className="bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 h-screen flex justify-center items-center">
            <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-4">Profil de {user.username}</h1>
                <p className="text-lg">Nom d'utilisateur: {user.username}</p>
                <p className="text-lg">Email: {user.email}</p>
                {/* Autres informations du profil à afficher */}
            </div>
        </div>
    );
};


export default profile;
