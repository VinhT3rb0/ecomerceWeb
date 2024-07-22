import React, { useEffect } from 'react'
import Cart from '../../components/Card/Card'
import { Link } from 'react-router-dom';
export default function Bestsell() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div>
            Bestsell
            <Link to='/details'>
                <Cart></Cart>
            </Link>
        </div>

    )
}
