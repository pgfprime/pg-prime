import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import React, { useEffect, useReducer, useState } from "react";
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import HomeProduct from "../components/HomeProduct";
import { Helmet } from 'react-helmet-async';
import Container from "react-bootstrap/Container";
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from "react-router-bootstrap";
import { getError } from "../uttils";
import { toast } from "react-toastify";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Ruler from '../components/Ruler.js';


const reducer = (state, action) => {
    switch(action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
            case 'FETCH_SUCCESS':
                return {...state, products: action.payload, loading: false};
                case 'FETCH_FAIL':
                    return {...state, loading: false, error: action.payload};
                    default:
                        return state;
    }
};

const Home = () => {
    const [isCatToggled, setIsCatToggled] = useState(true);
    const [isPriceToggled, setIsPriceToggled] = useState(true);
    const [isBrandToggled, setIsBrandToggled] = useState(true);
    
    const [{ loading, error, products}, dispatch] = useReducer(logger(reducer), {
        products: [],
        loading: true, error: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_REQUEST' });
            try{
                const result = await axios.get('/api/products');
                dispatch({type: 'FETCH_SUCCESS', payload: result.data})
            } catch(err) {
                dispatch({ type: 'FETCH_FAIL', payload: err.message })
            }
            
        };
        fetchData();
    }, [])

    function randomizeDataset(products) {
        const randomizedDataset = products.slice();
      
        for (let i = randomizedDataset.length - 1; i > 0; i--) {
          const randomIndex = Math.floor(Math.random() * (i + 1));
          [randomizedDataset[i], randomizedDataset[randomIndex]] = [randomizedDataset[randomIndex], randomizedDataset[i]];
        }
      
        return randomizedDataset;
      }

    const randProducts = randomizeDataset(products);
    const randProductsTwo = randomizeDataset(randProducts);

    const prices = [
        {
            name: '1 to 50',
            value: '1-50'
        },
        {
            name: '51 to 200',
            value: '51-200'
        },
        {
            name: '201 to 1000',
            value: '201-1000'
        },
    ];
      
      const [categories, setCategories] = useState([]);
      const [brands, setBrands] = useState([]);
    
      useEffect(() => {
          const fetchCategories = async () => {
            try{
              const { data } = await axios.get('/api/products/categories');
              setCategories(data);
            } catch(err) {
              toast.error(getError(err));
            }
          }
          fetchCategories();
    
          const fetchBrands = async () => {
            try{
              const { data } = await axios.get('/api/products/brands');
              setBrands(data);
            } catch(err) {
              toast.error(getError(err));
            }
          }
          fetchBrands();
      }, []);


      const handleCatClick = () => {
          setIsCatToggled(!isCatToggled);
        }

        const handleBrandClick = () => {
            setIsBrandToggled(!isBrandToggled);
          }

          const handlePriceClick = () => {
            setIsPriceToggled(!isPriceToggled);  
          }
      

    


      const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };


    return (
            <div className="md:w-[100%] mx-auto bg-gray-100">
                <img src=""></img>
                <Helmet>
                    <title>PGF PRIME</title>
                </Helmet>   
                <div className="w-[80%] mx-auto mt-5">
                        <h1 className='text-black font-bold trending mb-3'>Trending</h1>

                        <Carousel responsive={responsive} className="">
                            {randProducts.map((product, i) => (
                                <div key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                                    <HomeProduct product={product}></HomeProduct>
                                </div>
                            
                        ))}
                        </Carousel>

                        <Carousel responsive={responsive} className="mt-2">
                            {randProductsTwo.map((product, i) => (
                                <div key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                                    <HomeProduct product={product}></HomeProduct>
                                </div>
                            
                        ))}
                        </Carousel>
                </div>


                <Row className="mx-auto w-[80%]">
                    
                    <Col md={3} className=" bg-white pt-2 mt-2">
                    
                        <div className='filter-container flex flex-column p-3 rounded mt-2 mb-3'>
                            <span className="italic text-sm">Filter by</span>
                            <Link className="font-bold mt-2 underline " onClick={handleCatClick}>Categories</Link>
                            <ul className={isCatToggled ? 'category-hidden' : 'category-show"'}>
                            {categories.map((category) => (
                                    <li className="my-2 text-base text-black" key={category}>
                                        <Link className="hover:text-blue-600"
                                            to={{ pathname: '/search', search: `category=${category}`}}
                                        >
                                        {category}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            
                            <Link className="font-bold mt-2 underline " onClick={handleBrandClick}>Available Brands</Link>
                            <ul className={isBrandToggled ? 'brand-hidden' : 'brand-show"'}>
                                {brands.map((brand) => (
                                        <li className="my-2 text-base text-black" key={brand}>
                                            <Link className="hover:text-blue-600"
                                                to={{ pathname: '/search', search: `brand=${brand}`}}
                                            >
                                            {brand}
                                            </Link>
                                        </li>                             
                                    ))}
                                </ul>

                                <Link className="font-bold mt-2 underline " onClick={handlePriceClick}>Price</Link>
                                <ul className={isPriceToggled ? 'price-hidden' : 'price-show"'}>                               
                                            {prices.map((p) => (
                                            <li className="my-2 text-base text-black" key={p.value}>
                                                <Link className="hover:text-blue-600"
                                                    to={{ pathname: '/search', search: `price=${p.value}`}}
                                                >&#163;{p.name}
                                            </Link>
                                        </li>                               
                                    ))}
                            </ul>
                        </div>               
                    </Col> 
                    <Col md={9}>
                    <h1 className='text-black font-bold trending md:mt-3 mt-4'>Newest Arrivals</h1>
                        <Carousel responsive={responsive} className="mt-5">
                                {products.map((product, i) => (
                                    <div key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                                        <HomeProduct product={product}></HomeProduct>
                                    </div>
                                
                                ))}
                        </Carousel>                   
                    </Col>
               </Row>


                
                
                <Row className=" mx-auto w-[90%]">
                  <Col md={6}>
                  </Col>
                  <Col md={6} className="mt-5">

                    <h2 className='text-black font-bold trending mb-3'>Brands</h2>
                    <div fluid className=" grid grid-cols-2 gap-3 text-center">
                        <span className="bg-white my-auto py-20 rounded">Nike</span>
                        <span className="bg-white my-auto py-20 rounded">Puma</span>
                        <span className="bg-white my-auto py-20 rounded">New Balance</span>
                        <span className="bg-white my-auto py-20 rounded">Yeezy</span>    
                        <span className="bg-white my-auto py-20 rounded">Yeezy</span>    
                    </div>
                  </Col>   
                </Row>  

                <div className="store text-center mt-5 pt-56">
                      <Link to="https://maps.google.com?q=33a%20Adebayo%20Doherty%20Rd,%20Eti-Osa%20101233,%20Lekki,%20Lagos&ftid=0x0:0xa188c9c24bd3a6f0&hl=en-NG&gl=ng&entry=gps&lucs=,47071704&g_st=iw">
                        <h2 className="bg-black text-gray-200 rounded text-lg w-44 mx-auto py-4">Locate our store</h2>
                      </Link> 
                </div>                
            </div>
    )
}

export default Home;
