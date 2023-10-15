// import axios from 'axios';
// import apiClient from '../api';
import React, { useEffect, useReducer, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getError } from '../uttils';
// import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Rating from '../components/Rating';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';
import HomeProduct from '../components/HomeProduct';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
            case 'FETCH_SUCCESS':
                return {
                    ...state,
                    products: action.payload.products,
                    page: action.payload.page,
                    pages: action.payload.pages,
                    countProducts: action.payload.countProducts,
                    loading: false
                };
                case 'FETCH_FAIL':
                    return { ...state, loading: false, error: action.action.payload };

            default:
                return state;
    }
}

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

export const ratings = [
    {
        name: '4stars & up',
        rating: 4,
    },
    {
        name: '3stars & up',
        rating: 3,
    },
    {
        name: '2stars & up',
        rating: 2,
    },
    {
        name: '1star & up',
        rating: 1,
    },
];

const Search = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);

    // specify all filters
    const category = sp.get('category') || 'all';
    const brand = sp.get('brand') || 'all';
    const query = sp.get('query') || 'all';
    const price = sp.get('price') || 'all';
    const rating = sp.get('rating') || 'all';
    const order = sp.get('order') || 'newest';
    const page = sp.get('page') || 1; // for pagination

    //define a reducer
    const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    })


    useEffect(() => {
        const fetchData = async () => {
            try{
                const { data } = await axios.get(
                    `/api/products/search?page=${page}&query=${query}&category=${category}&brand=${brand}&price=${price}&rating=${rating}&order=${order}`
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (error){
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(error),
                });
            }
        }
        fetchData();
    }, [brand, category, error, order, page, price, query, rating])


    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try{
                const { data } = await axios.get(`/api/products/categories`);
                setCategories(data)
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchCategories();
    }, [dispatch])

    const [brands, setBrands] = useState([]);
    useEffect(() => {
        const fetchBrands = async () => {
            try{
                const { data } = await axios.get(`/api/products/brands`);
                setBrands(data)
            } catch (err) {
                toast.error(getError(err));
            }
        };
        fetchBrands();
    }, [dispatch])

    const getFilterUrl = (filter, skipPathname) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.category || category;
        const filterBrand = filter.brand || brand;
        const filterQuery = filter.query || query;
        const filterRating = filter.rating || rating;
        const filterPrice = filter.price || price;
        const sortOrder = filter.order || order;
        return `${
            skipPathname ? '' : '/search'
        }categorycategory=${filterCategory}$brand=${filterBrand}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}$page=${filterPage}`;
    };

    return (
        <div>
            <Helmet>
                <title>Search Products</title>
            </Helmet>
            <Row>
                <Col md={3}>
                    <h3>Category</h3>
                    <div>
                        <ul>
                            <li>
                                <Link className={'all' === category ? 'text-bold' : ''}
                                to={getFilterUrl({ category: 'all' })}
                                >Any</Link>
                            </li>
                        {categories.map((c) => (
                            <li key={c}>
                                <Link 
                                className={c === category ? 'text-bold' : ''}
                                to={getFilterUrl({ category: c })}
                                >{c}</Link>
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Brand</h3>
                        <ul>
                            <li>
                                <Link className={'all' === brand ? 'text-bold' : ''}
                                to={getFilterUrl({ brand: 'all' })}
                                >Any</Link>
                            </li>
                             {brands.map((b) => (
                            <li key={b}>
                                <Link 
                                className={b === brand ? 'text-bold' : ''}
                                to={getFilterUrl({ brand: b })}
                                >{b}</Link>
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div>
                    <h3>Price</h3>
                        <ul>
                            <li>
                                <Link className={'all' === price ? 'text-bold' : ''}
                                to={getFilterUrl({ price: 'all' })}
                                >Any</Link>
                            </li>
                             {prices.map((p) => (
                            <li key={p.value}>
                                <Link 
                                className={p.value === price ? 'text-bold' : ''}
                                to={getFilterUrl({ price: p.value })}
                                >{p.name}</Link>
                            </li>
                        ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Avg. Customer Review</h3>
                        <ul>
                            {ratings.map((r) => (
                                <li key={r.name}>
                                    <Link
                                        to={getFilterUrl({ rating: r.rating })}
                                        className={`${r.rating}` === `${rating}` ? 'text-bold' : ''}
                                    >
                                        <Rating caption={' & up'} rating={r.rating}></Rating>
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                to={getFilterUrl({ rating: 'all' })}
                                className={rating === 'all' ? 'text-bold' : ''}
                                >
                                    <Rating caption={' & up'} rating={0}></Rating>
                                </Link>                                
                           </li>
                        </ul>
                    </div>
                </Col>
                <Col md={9}>
                    {loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : (
                        <>
                        <Row className='justify-content-between mb-3'>
                            <Col md={6}>
                                <div>
                                    {countProducts === 0 ? 'No' : countProducts} Results
                                    {query !== 'all' && ' : ' + query}
                                    {category !== 'all' && ' : ' + category}
                                    {brand !== 'all' && ' : ' + brand}
                                    {price !== 'all' && ' : ' + price}
                                    {rating !== 'all' && ' : ' + rating}
                                    {query !== 'all' ||
                                    category !== 'all' ||
                                    brand !== 'all' ||
                                    rating !== 'all' ||
                                    price !== 'all' ? (
                                        <Button
                                        variant="light"
                                        onClick={() => navigate('/search')}
                                        >
                                            <i className='fas fa-times-circle'></i>
                                        </Button>
                                    ) : null }
                                </div>
                            </Col>
                            <Col className='text-end'>
                                Sort by {' '}
                                    <select
                                    value={order}
                                    onChange={(e) => {
                                    navigate(getFilterUrl({ order: e.target.value }));
                                }}
                            >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="lowest">Price: Low to High</option>
                                    <option value="highest">Price: High to Low</option>
                                    <option value="toprated">Avg. Customer Reviews</option>
                                </select>
                            </Col>
                        </Row>
                        {products.length === 0 && (
                            <MessageBox>No Product Found</MessageBox>
                        )}
                        <Row>
                            {products.map((product) => (
                                <Col sm={6} lg={4} className='mb-3' key={product._id}>
                                <HomeProduct product={product}></HomeProduct>
                                </Col>
                            ))}
                        </Row>

                        <div>
                            {[...Array(pages).keys()].map((x) => (
                                <LinkContainer
                                key={x + 1}
                                className='mx-1'
                                to={getFilterUrl({ page: x + 1 })}
                                >
                                    <Button
                                    className={Number(pages) === x + 1 ? 'text-bold' : ''}
                                    variant='light'
                                    >
                                        {x + 1}
                                    </Button>
                                </LinkContainer>
                            ))}
                        </div>
                    </>
                    )}
                </Col>
            </Row>
        </div>
    );
}

export default Search;