import React, { useEffect, useRef } from 'react';
import { useStateValue } from "./StateProvider";
import './Home.css';
import Product from './Product';
import AddProduct from "./AddProduct";
import banner from './assets/3_keyboards.webp';
import Zoom75 from './assets/zoom75.webp';
import Rainy75 from './assets/rainy75.webp';
import Halo75 from './assets/nuphy75.webp';
import M1 from './assets/monsgeekm1.webp';
import Azoth75 from './assets/asusazoth.jpg';
import AulaF75 from './assets/aula75.webp';
import KeychronQ1 from './assets/keychronq1.webp';


function Home() {
    const [{ notification }, dispatch] = useStateValue();
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (notification) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                dispatch({ type: 'CLEAR_NOTIFICATION' });
            }, 5000);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [notification, dispatch]);

    return (
        <div className='home'>
            {notification && <AddProduct message={notification.text} image={notification.image} />}

            <div className='home_container'>
                <img
                    className='home_image'
                    src={banner}
                    alt=''
                />

                <div className='home_row'>
                    <Product
                        id='1'
                        title='Zoom 75 Keyboard Mechanical Keyboard, Gasket Mounted with Aluminum Frame'
                        price={219.99}
                        image={Zoom75}
                        rating={4}
                    />
                    <Product
                        id='2'
                        title='Wobkey Rainy 75 Keyboard Mechanical Keyboard with Aluminum Frame'
                        price={119.99}
                        image={Rainy75}
                        rating={3}
                    />
                </div>

                <div className='home_row'>
                    <Product
                        id='3'
                        title='Nuphy Halo 75 V2 Mechanical Gaming Keyboard'
                        price={139.99}
                        image={Halo75}
                        rating={4}
                    />
                    <Product
                        id='4'
                        title='75% Wireless Monsgeek M1 Mechanical Keyboard'
                        price={159.99}
                        image={M1}
                        rating={5}
                    />
                    <Product
                        id='5'
                        title='EPOMAKER x AULA F75 Gasket Mechanical Keyboard'
                        price={69.99}
                        image={AulaF75}
                        rating={3}
                    />
                </div>

                <div className='home_row'>
                    <Product
                        id='6'
                        title='ROG Azoth Extreme 75 Custom Gaming Keyboard, Aluminum Chassis, Carbon Fiber Positioning
                        Plate, Adjustable Gasket Mount'
                        price={499.99}
                        image={Azoth75}
                        rating={4}
                    />

                    <Product
                        id='7'
                        title='Keychron Q1 Pro Wireless Custom Mechanical Keyboard'
                        price={189.99}
                        image={KeychronQ1}
                        rating={3}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;