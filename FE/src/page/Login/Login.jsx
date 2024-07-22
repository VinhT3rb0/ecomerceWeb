import React, { useState } from "react";
import * as Components from './LoginStyles';
import { GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import Cookies from "universal-cookie";
import axios from 'axios';

function Login() {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [signIn, toggle] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [inputEmail, setInputEmail] = useState("");
    const [inputUserName, setInputUserName] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [inputNumberPhone, setInputNumberPhone] = useState("");
    const [error, setError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (inputPassword !== confirmPassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp");
            return;
        }
        const formData = {
            username: inputUserName,
            email: inputEmail,
            password: inputPassword,
            retype_password: inputPassword,
            telephone: inputNumberPhone
        }

        console.log(2222, formData);
        try {
            const response = await axios.post('https://api.trandai03.online/api/auth/signup', formData);
            const username = email.split('@')[0];
            localStorage.setItem('user', username);
            localStorage.setItem('role', "user");
            console.log(22222, response.data);
            window.location.reload();
        } catch (error) {
            if (error.response) {
                // Lỗi nhận từ phía máy chủ
                setError(error.response.data);
                console.error('Có lỗi xảy ra:', error.response.data);
            } else {
                // Lỗi không liên quan đến máy chủ (VD: không thể kết nối)
                setError('Không thể kết nối tới máy chủ');
                console.error('Có lỗi xảy ra:', error.message);
            }
        }
    }

    const handleSignIn = async () => {
        const loginData = {
            username_email: email,
            password: password
        };

        try {
            const response = await axios.post('https://api.trandai03.online/api/auth/signin', loginData);
            const username = email.split('@')[0];
            localStorage.setItem('user', username);
            localStorage.setItem('role', response.data.data.roles);
            localStorage.setItem('userId', response.data.data.id);
            navigate("/");
        } catch (error) {
            if (error) {
                // Lỗi nhận từ phía máy chủ
                setError("Lỗi tài khoản");
                console.error('Có lỗi xảy ra:');
            } else {
                setError('Không thể kết nối tới máy chủ');
                console.error('Có lỗi xảy ra:');
            }
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleButtonClick = (event) => {
        event.preventDefault();
        handleSignIn();

        // if (validateEmail(email)) {
        //     setError('');
        //     // handleSignIn();
        // } else {
        //     setError('Email không hợp lệ');
        // }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            cookies.set("auth-token-nghiep", result.user.refreshToken);
            console.log(result.user.displayName);
            localStorage.setItem('user', result.user.displayName);
            localStorage.setItem('role', "user");
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Components.Container>
                <Components.SignUpContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Create Account</Components.Title>
                        <Components.Input
                            type='text'
                            value={inputUserName}
                            onChange={(e) => setInputUserName(e.target.value)}
                            placeholder='Username'
                        />
                        <Components.Input
                            type='email'
                            value={inputEmail}
                            onChange={(e) => setInputEmail(e.target.value)}
                            placeholder='Email'
                        />
                        <Components.Input
                            type='text'
                            value={inputNumberPhone}
                            onChange={(e) => setInputNumberPhone(e.target.value)}
                            placeholder='Số điện thoại'
                        />
                        <Components.Input
                            type='password'
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                            placeholder='Mật khẩu'
                        />
                        <Components.Input
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Nhập lại mật khẩu'
                        />
                        <Components.Button onClick={handleSignUp}>Sign Up</Components.Button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </Components.Form>
                </Components.SignUpContainer>

                <Components.SignInContainer signinIn={signIn}>
                    <Components.Form>
                        <Components.Title>Sign in</Components.Title>
                        <Components.Input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Components.Input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                        <Components.Button onClick={handleButtonClick}>Sign In</Components.Button>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
                            <div style={{ height: 30, width: 30 }} onClick={signInWithGoogle}>
                                <img style={{ width: '100%', cursor: 'pointer' }} src="https://i.pinimg.com/originals/74/65/f3/7465f30319191e2729668875e7a557f2.png" />
                            </div>
                            <div style={{ height: 30, width: 30, margin: '0 20px' }}>
                                <img style={{ width: '100%', cursor: 'pointer' }} src="https://mewxu.net/wp-content/uploads/2017/03/fb_icon.png" />
                            </div>
                            <div style={{ height: 30, width: 30 }}>
                                <img style={{ width: '100%', cursor: 'pointer' }} src="https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg" />
                            </div>
                        </div>

                    </Components.Form>
                </Components.SignInContainer>

                <Components.OverlayContainer signinIn={signIn}>
                    <Components.Overlay signinIn={signIn}>

                        <Components.LeftOverlayPanel signinIn={signIn}>
                            <Components.Title>Welcome Back!</Components.Title>
                            <Components.Paragraph>
                                To keep connected with us please login with your personal info
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => toggle(true)}>
                                Sign In
                            </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        <Components.RightOverlayPanel signinIn={signIn}>
                            <Components.Title>Hello, Friend!</Components.Title>
                            <Components.Paragraph>
                                Enter Your personal details and start journey with us
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => toggle(false)}>
                                Sign Up
                            </Components.GhostButton>
                        </Components.RightOverlayPanel>

                    </Components.Overlay>
                </Components.OverlayContainer>

            </Components.Container>
        </div>
    );
}

export default Login;
