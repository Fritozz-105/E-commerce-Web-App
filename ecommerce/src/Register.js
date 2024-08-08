import React, { useState, useEffect } from 'react';
import { auth, db } from "./firebase";
import { Link, useHistory } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import logo from "./assets/zooch_shop_logo.png";
import './Register.css';

function Register() {
    const history = useHistory();
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(null);

    useEffect(() => {
        if (email) {
            setEmailError(validateEmail(email) ? '' : 'Please enter a valid email address.');
        } else {
            setEmailError('');
        }

        if (password) {
            const error = validatePassword(password);
            setPasswordError(error);
        } else {
            setPasswordError('');
        }

        if (password && confirmPassword) {
            setPasswordMatch(password === confirmPassword);
        } else {
            setPasswordMatch(null);
        }
    }, [email, password, confirmPassword]);

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return "Password must be at least 8 characters long.";
        } else if (!hasUpperCase) {
            return "Password must contain at least one uppercase letter.";
        } else if (!hasSymbol) {
            return "Password must contain at least one symbol.";
        }
        return "";
    };

    const register = (e) => {
        e.preventDefault();

        if (emailError) {
            alert(emailError);
            return;
        }

        if (passwordError) {
            alert(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords don\'t match');
            return;
        }

        auth
            .createUserWithEmailAndPassword(email, password)
            .then((auth) => {
                console.log(auth);

                if (auth) {
                    let user = auth?.user;
                    user.updateProfile({ displayName: fullname });

                    db
                        .collection('users')
                        .doc(user?.uid)
                        .collection('login')
                        .add({
                            username: fullname,
                            email: email,
                            password: password
                        });

                    history.push('/');
                }
            })
            .catch((error) => alert(error.message));
    }

    return (
        <div className='register_wrapper'>
            <div className='register'>
                <Link to='./'>
                    <img
                        className='register_logo'
                        src={logo}
                        alt=''
                    />
                </Link>

                <div className='register_container'>
                    <h1>Create an Account</h1>

                    <form>
                        <h5>Full Name</h5>
                        <input
                            type='text'
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />

                        <h5>Email</h5>
                        <div className="email-input-container">
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {emailError && <p className="error-message">{emailError}</p>}
                        </div>

                        <h5>Password</h5>
                        <div className='register_verifyPassword'>
                            <input
                                type='text'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {passwordError && <p className="error-message">{passwordError}</p>}
                        </div>

                        <h5>Confirm Password</h5>
                        <div className='register_verifyPassword'>
                            <input
                                type='text'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            {passwordMatch !== null && (
                                passwordMatch ?
                                    <CheckIcon className='password_icon check'/> :
                                    <CloseIcon className='password_icon close'/>
                            )}
                        </div>

                        <button
                            type='submit'
                            onClick={register}
                            className='register_button'
                            disabled={!passwordMatch || !fullname || !email || !password || passwordError || emailError}
                        >
                            Create Account
                        </button>

                    </form>
                    <p>
                        By creating an account you agree to Zooch Shop's Condition of Use & Sale. Please see our
                        Privacy Notice, our Cookies Notice, and our Interest-Based Ads Notice.
                    </p>
                </div>
            </div>
        </div>

    );
}

export default Register;