import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import { getBasketTotal } from "./reducer";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { db } from './firebase';
import CheckoutProduct from "./CheckoutProduct";
import CurrencyFormat from "react-currency-format";
import axios from "./axios";
import './Payment.css';

function Payment() {
    const history = useHistory();
    const [{ basket, user, latestOrder }, dispatch] = useStateValue();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [addressState, setAddressState] = useState('');
    const [country, setCountry] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [addressEntered, setAddressEntered] = useState(false);
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [processing, setProcessing] = useState('');
    const [succeeded, setSucceeded] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });

            setClientSecret(response.data.clientSecret);
        }

        getClientSecret();
    }, [basket]);

    console.log(`Client secret is ${clientSecret}`)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then((response) => {
            console.log('Full response:', response);
            const {paymentIntent} = response;

            if (!paymentIntent) {
                throw new Error('Payment unsuccessful, ensure you\'ve entered the correct information');
            }

            db
                .collection('users')
                .doc(user?.uid)
                .collection('orders')
                .doc(paymentIntent.id)
                .set({
                    basket: basket,
                    amount: paymentIntent.amount,
                    address: `${address} ${city}, ${addressState}, ${country}, ${zipcode}`,
                    created: paymentIntent.created
                });

            setSucceeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'SET_PREV_ORDER',
                order: basket
            })

            dispatch({
                type: 'EMPTY_BASKET'
            })

            history.replace('/success');
        }).catch((error) => {
            console.error('Error in payment process:', error);
            setProcessing(false);
        });
    }

    const handleInput = (e) => {
        setDisabled(e.empty)
        setError(e.error ? e.error.message : '');
    };

    return (
        <div className='payment'>
            <div className='payment_container'>
                <h1>
                    Checkout (<Link to='/checkout'>{basket?.length} items</Link>)
                </h1>

                <div className='payment_section'>
                    <div className='payment_title'>
                        <h3>Delivery Address</h3>
                    </div>

                    {addressEntered ?
                        <div className='payment_address'>
                            <p>{user ? user?.displayName : 'Guest'}</p>
                            <p>{address}</p>
                            <p>{city}, {addressState}</p>
                            <p>{country}, {zipcode}</p>
                        </div>
                        :
                        <div className='addressEntryContainer'>
                            <form>
                                <h5>Address</h5>
                                <input
                                    type='text'
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />

                                <h5>City</h5>
                                <input
                                    type='text'
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />

                                <h5>State</h5>
                                <input
                                    type='text'
                                    value={addressState}
                                    onChange={(e) => setAddressState(e.target.value)}
                                />

                                <h5>Country</h5>
                                <input
                                    type='text'
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />

                                <h5>Zip Code</h5>
                                <input
                                    type='text'
                                    value={zipcode}
                                    onChange={(e) => setZipcode(e.target.value)}
                                />

                                <button
                                    type='submit'
                                    disabled={!address || !city || !addressState || !country || !zipcode}
                                    onClick={() => {
                                        setAddressEntered(true)
                                    }}
                                    className='address_button'
                                >
                                    Set Address
                                </button>
                            </form>
                        </div>
                    }

                    {!addressEntered ? '' :
                        <button
                            type='click'
                            onClick={() => {
                                setAddressEntered(false)
                            }}
                            className='address_button'
                        >
                            Edit Address
                        </button>
                    }
                </div>

                <div className='payment_section'>
                    <div className='payment_title'>
                        <h3>Review items and delivery</h3>
                    </div>

                    <div className='payment_items'>
                        {basket.map(item => (
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
                </div>

                <div className='payment_section'>
                    <div className='payment_title'>
                        <h3>Payment Method</h3>
                    </div>

                    <div className='payment_details'>
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleInput}/>

                            <div className='payment_priceContainer'>
                                <CurrencyFormat
                                    renderText={(value) => (
                                        <h3>Order Total: {value}</h3>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                />

                                <button
                                    className='payment_button'
                                    disabled={processing || disabled || succeeded || !addressEntered}
                                >
                                    <span>{processing ? <p>Processing</p> : 'Buy Now'}</span>
                                </button>
                            </div>

                            {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;