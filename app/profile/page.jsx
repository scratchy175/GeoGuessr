"use client"
import Image from "next/image";
import { motion } from "framer-motion";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { signOut, getSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Navbar from "@/components/Navbar";
import footer from "@/components/footer";




export default function profile() {
    const [showMenu, setShowMenu] = useState(false);


    const [session, setSession] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [id, setUserId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const fetchData = async () => {
        const session = await getSession();
        setSession(session);

        if (session) {
            setUsername(session.user.username);
            setEmail(session.user.email); // Retrieve email
            setUserId(session.user.id); // Retrieve user ID
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    return (

        <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('/planete.jpg')" }}>
            <div className="bg-white shadow-md rounded-lg p-6 w-80">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Données de l'utilisateur </h2>
                </div>
                <div>
                    <p><span className="font-bold">nom d'utilisateur:</span> {username}</p> {/* Affiche le nom d'utilisateur */}
                    <p><span className="font-bold">Email:</span> {email}</p> {/* Affiche l'email */}
                    <p><span className="font-bold">ID:</span> {id}</p> {/* Affiche l'id */}
                </div>
            </div>
        </div>
    );
}
