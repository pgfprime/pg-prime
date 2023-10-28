import React, { useState, useEffect } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { TestimonialData } from './TestimonialData';
import "./Testimonials.css";
import Rating from '../Rating';

const Testimonials = (props) => {
    const [ currentSlide, setCurrentSlide ] = useState(0);
    const slideLength = TestimonialData.length;

    const nextSlide = () => {
        setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
    }

    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
    }
   
    useEffect(() => {
        // puts the current slide to slide 0 on page refresh
        setCurrentSlide(0)
    }, [])

    return (
        <div className='slider'>
            <img className="" src='../images/sign-in-logo.png'/>
            <AiOutlineArrowLeft className="arrow prev" onClick={prevSlide}/>
            <AiOutlineArrowRight className="arrow next" onClick={nextSlide}/>
            {
                TestimonialData.map((slide, index) => (
                    <div className={index === currentSlide ? "slide current" : "slide"} key={index}>
                        {index === currentSlide && (
                            <div>
                                    <Rating className="rating" rating={slide.rating} caption=" "></Rating>
                                    <p className='text'>{slide.text}</p>
                                    <img src={slide.image} alt='slide'/>
                                    <p>{slide.name}</p>
                                    <small>{slide.location}</small>
                            </div>
                        )}
                    </div>
                ))
            }
                </div>
    )
}

export default Testimonials;