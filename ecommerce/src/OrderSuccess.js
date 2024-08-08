import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { db } from "./firebase";
import { useStateValue } from "./StateProvider";
import { getBasketTotal } from './reducer';
import Order from './Order';
import './OrderSuccess.css';
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";

function OrderSuccess() {
    const [{ user, latestOrder }, dispatch] = useStateValue();

    useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    return (
        <div className="ordersuccess">
            <h1>Thank you for your order {user?.displayName}!</h1>
            <p>Your order is being processed.</p>

            <div className='ordersuccess_list'>
                {latestOrder.map(item => (
                    <CheckoutProduct
                        id={item.id}
                        title={item.title}
                        image={item.image}
                        price={item.price}
                        rating={item.rating}
                        hideButton={true}
                    />
                ))}
            </div>

            <CurrencyFormat
                renderText={(value) => (
                    <h3 className='order_total'>Order Total: {value}</h3>
                )}
                decimalScale={2}
                value={getBasketTotal(latestOrder)}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
            />
        </div>
    );
}

export default OrderSuccess;