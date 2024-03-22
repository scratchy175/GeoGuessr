"use client";
import { useEffect, useState, useRef } from "react";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png";
import { signOut, getSession } from "next-auth/react";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const session = await getSession();
    setSession(session);

    if (session) {
      setUsername(session.user.username);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <nav className="bg-transparent">

    </nav>
  );
}

export default Nav;