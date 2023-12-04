import React, { useEffect } from 'react';
import './GalleryBg.css'
import { Link } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';


const GalleryBg = () => {

    useEffect(() => {
        AOS.init({duration: 1200});
      }, []);

      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);


    return (
        <div className='gallery-comp mb-4'>
            <div className='title w-[90%] mx-auto'>
                <h2 className='' data-aos="slide-up">Our Gallery</h2>
                <p className='' data-aos="slide-up">Explore the world of PGF Prime through our captivating media contents.</p>
            </div>
            <div className='mobile-gallery'>
                <div className='mobile-gallery-image md:hidden block w-[88%] mx-auto' data-aos="zoom-in">
                </div>
            </div>
            
            <div className='web-gallery'>
                <div className='web-gallery-image md:block hidden w-[95%] mx-auto' data-aos="zoom-in">
                </div>
            </div>

            <div className='gallery-buttons flex flex-row justify-between md:w-[30%] w-[89%] mx-auto mt-5 space-x-3' data-aos="slide-up">
                <button className='shop-now-button'>
                    <Link onClick={() => window.scrollTo(0, 0)} to={{ pathname: '/search', search: `allProducts`}}>
                        Shop now
                    </Link>
                </button>
                  <button className='explore-button flex flex-row justify-between items-center px-4'>
                     <Link onClick={() => window.scrollTo(0, 0)} className='' to="/gallery">Explore Gallery </Link>
                    <img className='h-3 w-3' src="../images/more.png" />
                  </button>
            </div>
        </div>
    )
}

export default GalleryBg;