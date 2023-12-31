import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { toast } from "react-toastify";
import { Store } from '../../Store';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import './ShippingAddress.css';



const ShippingAddress = () => {
    const navigate = useNavigate();
    const{ state, dispatch: ctxDispatch } = useContext(Store);
    const {
        userInfo,
        cart:{ shippingAddress, paymentMethod },
    } = state;

   
    const subtotal = (state.cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0)).toFixed(2);
    const shipping = (0).toFixed(2);
    const tax = ((7.5/100) * subtotal).toFixed(2);
    const total = (parseFloat(subtotal) + parseInt(shipping) + parseFloat(tax)).toFixed(2);


    const[fullName, setFullName] = useState(shippingAddress.fullName || '');
    const[address, setAddress] = useState(shippingAddress.address || '');
    const[city, setCity] = useState(shippingAddress.city || '');
    const[phonenumber, setPhoneNumber] = useState(shippingAddress.phonenumber || '');
    const[country, setCountry] = useState(shippingAddress.country || '');

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=/shipping')
        }
    }, [userInfo, navigate])

   
    const [paymentMethodName, setPaymentMethod] = useState(
        paymentMethod || 'Paystack'
    );


    const submitHandler = (e) => {
        e.preventDefault();
        if(!phonenumber) {
            toast.error('Please provide a phone number');
            return;
        }
        if( !(phonenumber.match('[0-9]{10}')) ){
            toast.error('Please provide valid phone number');
            return;
        } 
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                address,
                city,
                country,
                phonenumber
            }
        });
        ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName});
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify({
                fullName,
                address,
                city,
                country,
                phonenumber,
            })
        );

        //  navigate('/payment');

        // remove this if doesn't work
        localStorage.setItem('paymentMethod', paymentMethodName);

        navigate('/placeorder');

    }

    return (
        <div>
            <Header />
            <Helmet>
                <title>Shipping Address</title>
            </Helmet>

            <div className='w-[90%] md:w-[72%] my-10 mx-auto md:flex md:flex-row md:justify-between'>
                
                    <div className='md:w-[65%] shipping-contact mb-5'>
                    <Form className='shipping-form mt-8' onSubmit={submitHandler}>
                        <h1 className='h1'>Contact</h1>

                        <Form.Group className="full-name d-grid mb-4" controlId="fullName">
                        <Form.Label>Full name</Form.Label>
                                <input
                                className='input w-full'
                                type='text'
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                />
                        </Form.Group>


                       <div className='w-full'>
                        <Form.Group className="phone-group mb-4" controlId="phonenumber">
                            <Form.Label>Phone</Form.Label>
                                    <input
                                    className='input w-full'
                                    value={phonenumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    type='tel'
                                    required
                                    />
                            </Form.Group>
                       </div>
                        

                        <div className='md:grid md:grid-cols-2 md:gap-3'>
                            <Form.Group className="mb-4 d-grid" controlId="country">
                            <Form.Label>Country</Form.Label>
                                    <input
                                    className='input w-full'
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                    />
                            </Form.Group>


                            <Form.Group className="mb-4 d-grid" controlId="city">
                            <Form.Label>City</Form.Label>
                                    <input
                                    className='input w-full'
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                    />
                            </Form.Group>
                        </div>
                        


                        <Form.Group className="mb-3" controlId="address">
                            <Form.Label>Address</Form.Label>
                                <textarea
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className='address-input'
                                ></textarea>
                        </Form.Group>

                        <div className="billing-address flex flex-row justify-between items-center">
                                <input className="box w-5 h-5" type="checkbox" id="billing-same" name="billing-same" value="billing-same" />
                                <span className="biling-same" for="billing-same"> Billing and delivery address are the same</span>
                        </div>

                    <div className='payment'>
                                    <h2>Payment Method</h2>
                                    {/* <div className='my-3'>
                                        <Form.Check
                                        type='radio'
                                        id='PayPal'
                                        label="PayPal/Card"
                                        value="PayPal"
                                        checked={paymentMethodName === "PayPal"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                    </div> */}
                                    <div className='my-3'>
                                        <Form.Check
                                        type='radio'
                                        id='Paystack'
                                        label="Paystack"
                                        value="Paystack"
                                        checked={paymentMethodName === "Paystack"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Form.Check
                                        type='radio'
                                        id='Cash'
                                        label="Cash on Delivery"
                                        value="Cash"
                                        checked={paymentMethodName === "Cash"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                    </div>
                        </div>
                    </Form>

                    <div className='md:w-[30%] mt-4 d-grid'>
                            <Button className="button py-2.5 border-none text-white" onClick={submitHandler} type="submit">
                                Next
                            </Button>
                    </div>
                    
                    </div>

                    <div className='md:w-[32%] md:mt-8 details-image-group'>
                        <div className='order-details border mb-5'>
                        <h1 className='h1'>Order details</h1>
                        <ul>
                                <li className='flex flex-row justify-between items-center'>
                                    <p>Subtotal: </p>
                                    <span>₦{ subtotal }</span>
                                </li>
                                <li className='flex flex-row justify-between items-center'>
                                    <p>Shipping: </p>
                                    <span className='shipping-class'>₦{ shipping }</span>
                                </li>
                                <li className='flex flex-row justify-between items-center'>
                                    <p>Tax: </p>
                                    <span>+ ₦{ tax }</span>
                                </li>
                                
                        </ul>
                        <div className='order-total flex flex-row justify-between items-center'>
                                <p>Total:</p>
                                <span>₦{ total }</span>
                        </div>
                        </div>
                

                        <div className='shipping-item-images border mt-4'>
                            <h1 className='h1'>Order details</h1>
                            <div className='. space-y-4'>
                                {
                                        state.cart.cartItems.map((item) => (
                                            <div className='shipping-item flex flex-row justify-between items-center'>
                                                <div className="shipping-image-group">
                                                <img src={item.image} className='shipping-image'/>
                                                </div>
                                                
                                                <div className='shipping-item-content space-y-1'>
                                                    <p className='s-item-name-price'>{item.name}</p>
                                                    <p className='s-item-name'>{item.brand}</p>
                                                    <p className='s-item-name-price'>₦{item.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                    ))
                                }
                            </div> 
                        </div>
                    </div>
            </div>
            
            <Footer />
        </div>
    )
}

export default ShippingAddress