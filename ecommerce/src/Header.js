import React from 'react';
import { Link } from 'react-router-dom';
import { useStateValue } from "./StateProvider";
import { auth } from './firebase';
import './Header.css';
import logo from './assets/zooch_shop_logo.png';
import storeTitle from './assets/zoochkeebs.png';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function Header() {
    const [{ basket, user }, dispatch] = useStateValue();

    const handleAuth = () => {
        if (user) {
            auth.signOut();
        }
    };

    return (
        <div className='header'>
            <Link to='/'>
                <img
                    className='header_logo'
                    src={logo}
                    alt=''
                />
            </Link>

            <div className='header_title'>
                <img
                    className='header_titleImg'
                    src={storeTitle}
                    alt=''
                />
            </div>

            <div className='header_nav'>
                <Link to={!user && '/login'}>
                    <div className='header_option' onClick={handleAuth}>
                        <span className='header_optionLineOne'>Hello {!user ? 'Guest' : user?.displayName}</span>
                        <span className='header_optionLineTwo'>{user ? 'Sign Out' : 'Sign In'}</span>
                    </div>
                </Link>

                <Link to='/orders'>
                    <div className='header_option'>
                        <span className='header_optionLineOne'>Return</span>
                        <span className='header_optionLineTwo'>& Orders</span>
                    </div>
                </Link>

                <Link to='/checkout'>
                    <div className='header_optionBasket'>
                        <ShoppingCartIcon />
                        <span className='header_optionLineTwo header_basketCount'>{basket?.length}</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Header;
