import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { auth } from './firebase';
import { useStateValue } from './StateProvider';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './App.css';
import Header from './Header';
import Login from './Login';
import Register from "./Register";
import Home from './Home';
import Checkout from './Checkout';
import Payment from './Payment';
import Orders from './Orders';
import OrderSuccess from "./OrderSuccess";

const promise = loadStripe('public key');

function App() {
    const [{}, dispatch] = useStateValue();

    useEffect(() => {
        auth.onAuthStateChanged((authUser) => {
            console.log(`The user is: ${authUser}`);

            if (authUser) {
                dispatch({
                    type: 'SET_USER',
                    user: authUser
                })
            } else {
                dispatch({
                    type: 'SET_USER',
                    user: null
                })
            }
        })
    }, []);

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path='/login'>
                        <Login />
                    </Route>
                    <Route path='/register'>
                        <Register />
                    </Route>
                    <Route path='/checkout'>
                        <Header />
                        <Checkout />
                    </Route>
                    <Route path='/payment'>
                        <Header />
                        <Elements stripe={promise}>
                            <Payment />
                        </Elements>
                    </Route>
                    <Route path='/orders'>
                        <Header />
                        <Orders />
                    </Route>
                    <Route path='/success'>
                        <Header />
                        <OrderSuccess />
                    </Route>
                    <Route path='/'>
                        <Header />
                        <Home/>
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
