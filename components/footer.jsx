// Footer.js

import Link from 'next/link';

const footer = () => {
    return (
        <footer>
            <div>
                <Link href="/help">
                    <a>Aide</a>
                </Link>
                <Link href="/about">
                    <a>Àpropos</a>
                </Link>
            </div>
        </footer>
    );
};

export default footer;
