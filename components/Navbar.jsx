import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="absolute w-full z-10">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <img className="h-8" src="/logo.png" alt="Logo" />
                    </div>
                    <ul className="flex space-x-4">
                        <li>
                            <a className="text-white hover:text-gray-300" href="#">
                                Accueil
                            </a>
                        </li>
                        <li>
                            <a className="text-white hover:text-gray-300" href="#">
                                À propos
                            </a>
                        </li>
                        <li>
                            <a className="text-white hover:text-gray-300" href="#">
                                Services
                            </a>
                        </li>
                        <li>
                            <a className="text-white hover:text-gray-300" href="#">
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;