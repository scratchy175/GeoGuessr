"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo2.png";
import { signOut, getSession } from "next-auth/react";

import styles from "./styles.css";

function Nav() {
  const router = useRouter(); 
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

  useEffect(() => {
    if (session) {
      setUsername(session.user.username);
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut(); // Déconnexion avec NextAuth
    router.push('/login'); // Redirection vers la page de connexion
  };

  return (
    <nav className="bg-transparent fixed top-0 left-0 w-full z-50">
      <div className="container-fluid px-0 sm:px-6 lg:px-9">
        <div className="flex items-center justify-between h-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Image
                className="h-100 w-100"
                src={logo}
                alt="Logo"
                width={100}
                height={100}
              />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href={"/"}
                  className={`custom-btn hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 block px-3 py-2 rounded-md text-base font-medium ${styles["custom-btn"]}`}
                  >
                  <div className="relative">
                    <Image
                      src="/bouton.svg"
                      alt="Bouton"
                      width={120}
                      height={60}
                    />
                    <span className="btn-text">Accueil</span>
                  </div>
                </Link>
                <Link
                  href="/about"
                  className={`custom-btn hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 block px-3 py-2 rounded-md text-base font-medium ${styles["custom-btn"]}`}
                >
                  <div className="relative">
                    <Image
                      src="/bouton.svg"
                      alt="Bouton"
                      width={120}
                      height={70}
                    />
                    <span className="btn-text ">Àpropos</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex space-x-4">
            {isLoading ? (
              <div></div>
            ) : (
              <>
                {session ? (
                  <div className="relative">
                    <span
                      className={`custom-btn hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 block px-3 py-2 rounded-md text-base font-medium ${styles["custom-btn"]}`}
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <div className="relative">
                        <Image
                          src="/bouton.svg"
                          alt="Bouton"
                          width={120}
                          height={60}
                        />
                        <span className="btn-text">Bienvenue, {username}!</span>
                      </div>
                    </span>
                    <Transition
                      show={isOpen}
                      enter="transition ease-out duration-100 transform"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-75 transform"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      {(ref) => (
                        <div
                          className="md:absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="user-menu"
                        >
                          <div className="py-1" role="none">
                            <Link
                              href="/profil"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              Profil
                            </Link>
                            <Link
                              href="/commentjouer"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              Comment jouer
                            </Link>
                            <Link
                              href="/reglement"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              Reglement
                            </Link>
                            <Link
                              href="/statistiques"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              Statistiques
                            </Link>
                            <Link
                              href="/classement"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              Classement
                            </Link>
                            <Link
                              href="/compte"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                            >
                              Compte
                            </Link>
                            <button
                             onClick={handleSignOut}
                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                             role="menuitem"
                                                >
                             Se déconnecter
                             </button>
                            
                          </div>
                        </div>
                      )}
                    </Transition>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`custom-btn hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 block px-3 py-2 rounded-md text-base font-medium ${styles["custom-btn"]}`}
                    >
                      <div className="relative">
                        <Image
                          src="/bouton.svg"
                          alt="Bouton"
                          width={120}
                          height={60}
                        />
                        <span className="btn-text">Connexion</span>
                      </div>
                    </Link>
                    <Link
                      href="/signup"
                      className={`custom-btn hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 block px-3 py-2 rounded-md text-base font-medium ${styles["custom-btn"]}`}
                    >
                      <div className="relative">
                        <Image
                          src="/bouton.svg"
                          alt="Bouton"
                          width={120}
                          height={60}
                        />
                        <span className="btn-text">S&apos;inscrire</span>
                      </div>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {(ref) => (
          <div className="md:hidden flex justify-center" id="mobile-menu">
            <div
              ref={(el) => (mobileMenuRef.current = el)}
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
            >
              <Link
                href={"/"}
                className={`custom-btn hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 block px-3 py-2 rounded-md text-base font-medium ${styles["custom-btn"]}`}
              >
                <div className="relative flex items-center justify-center"> 
                  <Image
                    src="/bouton.svg"
                    alt="Bouton"
                    width={120}
                    height={60}
                  />
                  <span className="btn-text">Accueil</span>
                </div>
              </Link>
              <Link
                href="/about"
                className={`custom-btn hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 block px-3 py-2 rounded-md text-base font-medium ${styles["custom-btn"]}`}
              >
                <div className="relative flex items-center justify-center"> 
                  <Image
                    src="/bouton.svg"
                    alt="Bouton"
                    width={120}
                    height={60}
                  />
                  <span className="btn-text">Àpropos</span>
                </div>
              </Link>
              {isLoading ? (
                <div></div>
              ) : (
                <>
                  {session ? (
                    <div>
                      <span
                        className={`custom-btn hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 block px-3 py-2 rounded-md text-base font-medium ${styles["custom-btn"]}`}
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <div className="relative flex items-center justify-center">
                          <Image
                            src="/bouton.svg"
                            alt="Bouton"
                            width={120}
                            height={60}
                          />
                          <span className="btn-text">
                            {username}
                          </span>
                        </div>
                      </span>
                      <Transition
                        show={isOpen}
                        enter="transition ease-out duration-100 transform"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75 transform"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        {(ref) => (
                          <div
                            className="md:absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 "
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="user-menu"
                          >
                            <div className="py-1" role="none">
                              <Link
                                href="/profil"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Profil
                              </Link>
                              <Link
                                href="/commentjouer"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Comment jouer
                              </Link>
                              <Link
                                href="/reglement"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Reglement
                              </Link>
                              <Link
                                href="/statistiques"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Statistiques
                              </Link>
                              <Link
                                href="/classement"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Classement
                              </Link>
                              <Link
                                href="/compte"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                Compte
                              </Link>
                              <button
                             onClick={handleSignOut}
                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                             role="menuitem"
                                                >
                             Se déconnecter
                             </button>
                            </div>
                          </div>
                        )}
                      </Transition>
                    </div>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className={`custom-btn hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 block px-3 py-2 rounded-md text-base font-medium ${styles["custom-btn"]}`}
                      >
                <div className="relative flex items-center justify-center">
                          <Image
                            src="/bouton.svg"
                            alt="Bouton"
                            width={120}
                            height={60}
                          />
                          <span className="btn-text">Se connecter</span>
                        </div>
                      </Link>
                      <Link
                        href="/signup"
                        className={`custom-btn hover:shadow-indigo-500/100 hover:shadow-lg text-gray-300 hover:bg-indigo-500/40 block px-3 py-2 rounded-md text-base font-medium ${styles["custom-btn"]}`}
                      >
                <div className="relative flex items-center justify-center">
                          <Image
                            src="/bouton.svg"
                            alt="Bouton"
                            width={120}
                            height={60}
                          />
                          <span className="btn-text">S&apos;inscrire</span>
                        </div>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </Transition>
    </nav>
  );
}

export default Nav;
