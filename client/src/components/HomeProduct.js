import { Routes, Route, Link } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from "./Rating";
import Ruler from '../components/Ruler.js';


const HomeProduct = (props) => {
    const { product } = props;

    return (
        <Card className="product pt-1" key={product.slug}>
                <Link to={`/product/${product.slug}`}>
                <small className="ml-4">{product.brand}</small>
                 <img className='image card-img-top mx-3 mx-auto my-2' src={product.image} />
                </Link>
                <Card.Body className="-mt-3 w-[100%] left">
                    <Link to={`/product/${product.slug}`}>
                            <p className="text-sm card-text">{product.name}</p>
                    </Link>
                    {/* <Rating rating={product.rating} numReviews={product.numReviews}/> */}
                    <small className="text-gray-400">{product.size}</small>
                    <p className="text-sm font-medium mt-1">&#163;{product.price}</p>
                </Card.Body>
        </Card>          
    )
}

export default HomeProduct;