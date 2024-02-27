// Footer.js

import Link from 'next/link';

const footer = () => {
    return (
        <footer>
            <div>
                <Link href="/help">
                    <a>Help</a>
                </Link>
                <Link href="/about">
                    <a>About</a>
                </Link>
            </div>
        </footer>
    );
};

export default footer;
