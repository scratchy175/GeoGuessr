import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between flex-wrap bg-blue-500 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <Link href="/">
                    <a className="text-white font-semibold text-xl tracking-tight">Geogusser</a>
                </Link>
            </div>
        </nav>
    );
};
export default Navbar;