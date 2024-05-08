"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getSession } from 'next-auth/react';

export default function EditProfile() {
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const session = await getSession();
        if (session) {
            try {
                // Vérification si les mots de passe ne correspondent pas
                if (newPassword !== confirmPassword) {
                    setError("Les nouveaux mots de passe ne correspondent pas");
                    return;
                }

                const response = await axios.post('/api/edit-pass', {
                    id: session.user.id,
                    currentPassword: oldPassword,
                    newPassword: newPassword,
                });

                if (response.status === 200) {
                    setSuccess(true);
                    setError('');
                } else {
                    setError('Failed to update password');
                }
            } catch (error) {
                setError(error.response?.data?.message || 'An error occurred');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative">
        <img
          src="/compte/fondcompte.png"
          alt="Fond Liege"
          className="absolute inset-0 w-full h-full object-cover z-0" />
            <form onSubmit={handleSubmit} className="w-full max-w-md z-10">
                <h1 className="text-3xl font-bold mb-4">Modifier le Mot de Passe</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">Mot de passe changé avec succès!</p>}

                <div className="mb-4">
                    <label htmlFor="oldPassword" className="block text-gray-600">
                        Ancien mot de passe
                    </label>
                    <input
                        type="password"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter old password"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-gray-600">
                        Nouveau mot de passe
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter new password"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-600">
                        Confirmer le nouveau mot de passe
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Confirm new password"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Modifier
                </button>
            </form>
        </div>
    );
}
