import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Store } from "../../Store";
import { toast } from "react-toastify";
import { getError } from "../../uttils";
import "./Signin.css";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Testimonials from "../../components/Testimonials/Testimonials";
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";


const Signin = () => {

    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);

    const handleToggle = () => {
        if (type==='password'){
           setIcon(eye);
           setType('text')
        } else {
           setIcon(eyeOff)
           setType('password')
        }
     }

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
        e.preventDefault();
        try{
            const { data } = await axios.post('/api/users/signin', {
                email,
                password,
            });
            ctxDispatch({type: 'USER_SIGNIN', payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
        } catch (err) {
            toast.error(getError(err));
            return;
        }
    };

    useEffect(() => {
        if(userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);


    return (
       <div className=''>
        <Helmet>
            <title>Sign In</title>
        </Helmet>
        <Header />
        <div className="sign-in-page mx-auto">
            <div className="flex flex-row">
                <div className="web-test hidden md:block">
                    <Testimonials />
                </div>
                <div className="sign-in md:w-[60%] mx-auto">
                    <div className="sign-in-content md:w-[50%] mx-auto py-14 w-[100%] px-3">
                        <div className="form">
                            <div className="">
                                <h1 className="mb-1 font-bold">Sign in to your account</h1>
                                <p>Welcome back! Kindly enter your details.</p>
                            </div>

                            <Form className="main-form" onSubmit={submitHandler}>
                                <Form.Group className="mb-3 grid" controlId="email">
                                    <Form.Label className="label">Email</Form.Label>
                                    <input type="email" placeholder="Enter your email" required onChange={(e) => setEmail(e.target.value)}/>
                                </Form.Group>

                                    <Form.Group className="grid mb-3" controlId="password">
                                        <Form.Label className="label" >Password</Form.Label>
                                        <div className="flex">
                                            <input 
                                                type={type}
                                                value={password} 
                                                placeholder="********" 
                                                required 
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <span class="flex justify-around items-center" onClick={handleToggle}>
                                                <Icon class="absolute mr-10" icon={icon} size={20}/>
                                            </span>
                                        </div>          
                                    </Form.Group>
                            
                                <div className="flex flex-row justify-between items-center mb-3">
                                    <div className="remember-me-group flex flex-row items-center justify-between">
                                        <input className="box w-5 h-5" type="checkbox" id="remember-me" name="remember-me" value="remember-me" />
                                        <label className="remember-me" for="remember-me"> Remember me</label>
                                    </div>
                                    <Link className="forgot-password" to={`/forget-password`}>Forgot Password? </Link>
                                </div>
                                <div className="mb-3 d-grid">
                                    <Button className="button py-2 border-none text-white" type="submit">Sign in</Button>
                                </div>
                                <div className="have-account text-center">
                                    Don't have an account?{' '}
                                    <Link className="forgot-password" to={`/signup?redirect=${redirect}`}>Sign up</Link>
                                </div>
                            </Form>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <Footer />
       </div>
    )
}

export default Signin;