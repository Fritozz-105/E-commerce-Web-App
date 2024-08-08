import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link, useHistory } from "react-router-dom";
import { auth, db } from './firebase';
import logo from './assets/zooch_shop_logo.png';

function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldsFilled, setFieldsFilled] = useState(false);

    useEffect(() => {
        if (email && password) {
            setFieldsFilled(true)
        } else {
            setFieldsFilled(false);
        }
    }, [email, password]);

    const signIn = (e) => {
        e.preventDefault();

        auth
            .signInWithEmailAndPassword(email, password)
            .then((auth) => {
                console.log(auth);

                if (auth) {
                    history.push('/');
                }
            })
            .catch((error) => alert(error.message));
    }

    return (
        <div className='login_wrapper'>
            <div className='login'>
                <Link to='./'>
                    <img
                        className='login_logo'
                        src={logo}
                        alt=''
                    />
                </Link>

                <div className='login_container'>
                    <h1>Sign In</h1>

                    <form>
                        <h5>Email</h5>
                        <input
                            type='text'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <h5>Password</h5>
                        <input
                            type='text'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type='submit'
                            onClick={signIn}
                            className='login_signInButton'
                            disabled={!fieldsFilled}
                        >
                            Sign In
                        </button>
                    </form>

                    <p>
                        By signing-in you agree to Zooch Shop's Condition of Use & Sale. Please see our Privacy Notice,
                        our Cookies Notice, and our Interest-Based Ads Notice.
                    </p>

                    <p>New here? Create an account.</p>
                    <Link to='/register'>
                        <button className='login_registerButton'>Create Your Account</button>
                    </Link>
                </div>
            </div>
        </div>

    );
}

export default Login;