import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../../components/MessageBox';
import Button from 'react-bootstrap/Button';
import { Store } from '../../Store';
import { getError } from '../../uttils';
import LoadingBox from '../../components/LoadingBox';
import './EditProduct.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function EditProduct() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [selectedEuSize, setSelectedEuSize] = useState([]);
  const [selectedUsSize, setSelectedUsSize] = useState([]);
  const [selectedUkSize, setSelectedUkSize] = useState([]);

  const eusizes = [
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50"
  ];

const ussizes = [
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    "9.5",
    "10",
    "10.5",
    "11",
    "11.5",
    "12",
    "12.5",
    "13",
    "13.5",
    "14",
    "15",
    "16"
  ];

const uksizes = [
    "2",
    "2.5",
    "3",
    "3.5",
    "4",
    "4.5",
    "5",
    "5.5",
    "6",
    "6.5",
    "7",
    "7.5",
    "8",
    "8.5",
    "9",
    "9.5",
    "10",
    "10.5",
    "11",
    "11.5",
    "12",
    "13",
    "14",
    "15",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setSlug(data.slug);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images);
        setCategory(data.category);
        setDescription(data.description);
        setBrand(data.brand);
        if(data.selectedEuSize) {
          setSelectedEuSize(data.selectedEuSize);
        }
        if(data.selectedUsSize) {
          setSelectedUsSize(data.selectedUsSize);
        }
        if(data.selectedUkSize) {
          setSelectedUkSize(data.selectedUkSize);
        }
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/products/${productId}`,
        {
          _id: productId,
          name,
          slug,
          price,
          image,
          images,
          category,
          description,
          brand,
          selectedEuSize,
          selectedUsSize,
          selectedUkSize,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Product updated successfully');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const handleEuSizeSelect = (eusize) => {
    if (selectedEuSize.includes(eusize)) {
      //  if eusize is selected, it will be from the selectedEuSize array
      setSelectedEuSize(selectedEuSize.filter((selectedEuSize) => selectedEuSize !== eusize));
    } else {
      //  if eusize is not selected, it will be added to the selectedEuSize array
      setSelectedEuSize([...selectedEuSize, eusize]);
    }
  };

  const handleUsSizeSelect = (ussize) => {
    if (selectedUsSize.includes(ussize)) {
      setSelectedUsSize(selectedUsSize.filter((selectedUsSize) => selectedUsSize !== ussize));
    } else {
      setSelectedUsSize([...selectedUsSize, ussize]);
    }
  };

  const handleUkSizeSelect = (uksize) => {
    if (selectedUkSize.includes(uksize)) {
      setSelectedUkSize(selectedUkSize.filter((selectedUkSize) => selectedUkSize !== uksize));
    } else {
      setSelectedUkSize([...selectedUkSize, uksize]);
    }
  };
  
  const uploadFileHandler = async (e, forImages) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });

      if (forImages) {
        setImages([...images, data.secure_url]);
      } else {
        setImage(data.secure_url);
      }
      toast.success('Image uploaded successfully.');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
    }
  };
  const deleteFileHandler = async (fileName, f) => {
    console.log(fileName, f);
    console.log(images);
    console.log(images.filter((x) => x !== fileName));
    setImages(images.filter((x) => x !== fileName));
    toast.success('Image removed successfully.');
  };



  return (
    <div className=''>
      <Helmet>
        <title>Edit Product</title>
      </Helmet>
      <Header />
        <div className='edit-product-page md:w-[40%] w-[90%] my-12 md:my-20 mx-auto'>
        <h1 className="my-3 text-xl font-bold">Edit Product</h1>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-4 grid" controlId="name">
                  <Form.Label className="edit-label">Name</Form.Label>
                  <input
                    className='input text-sm w-full'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4 grid" controlId="slug">
                  <Form.Label className="edit-label">Slug</Form.Label>
                  <input
                    className='input text-sm w-full'
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label className="edit-label">Price</Form.Label>
                  <input
                    className='input text-sm w-full'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>
              
                <Form.Group className="mb-4 grid" controlId="image">
                  <Form.Label className="edit-label">Image File</Form.Label>
                  <Form.Control
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4 grid" controlId="imageFile">
                  <Form.Label className="edit-label">Upload Image</Form.Label>
                  <Form.Control type="file" onChange={uploadFileHandler} />
                  {loadingUpload && <LoadingBox></LoadingBox>}
                </Form.Group>

                <Form.Group className="mb-4 grid" controlId="additionalImage">
                  <Form.Label className="edit-label">Additional Images</Form.Label>
                  {images.length === 0 && <MessageBox>No image</MessageBox>}
                  <ListGroup variant="flush">
                    {images.map((x) => (
                      <ListGroup.Item key={x}>
                        {/* {x} */}
                        <Button variant="light" onClick={() => deleteFileHandler(x)}>
                          <i className="fa fa-times-circle"></i>
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Form.Group>
                <Form.Group className="mb-4 grid" controlId="additionalImageFile">
                  <Form.Label>Upload Aditional Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => uploadFileHandler(e, true)}
                  />
                  {loadingUpload && <LoadingBox></LoadingBox>}
                </Form.Group>

                <Form.Group className="mb-4 grid" controlId="category">
                  <Form.Label>Category</Form.Label>
                  <input
                    className='input text-sm w-full'
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4 grid" controlId="brand">
                  <Form.Label className="edit-label">Brand</Form.Label>
                  <input
                    className='input text-sm w-full'
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4 grid" controlId="description">
                    <Form.Label className="create-label">Description</Form.Label>
                        <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className='policy-input'
                        ></textarea>
                  </Form.Group>

                  <div className='mb-3'>
                      <h3 className='create-label mb-2'>Select EU sizes available:</h3>
                      {eusizes.map((eusize) => (
                        <label key={eusize} className='mr-3 mb-2 text-center'>
                          <input
                            className='size-check-box'
                            type="checkbox"
                            checked={selectedEuSize.includes(eusize)}
                            onChange={() => handleEuSizeSelect(eusize)}
                          />
                          {eusize}
                        </label>
                      ))}
                      {/* <h4>Selected EU sizes:</h4>
                      <ul>
                        {selectedEuSize.map((eusize) => (
                          <li key={eusize}>{eusize}</li>
                        ))}
                      </ul> */}
                  </div>

                  <div className='mb-3'>
                      <h3 className='create-label mb-2'>Select US sizes available:</h3>
                      {ussizes.map((ussize) => (
                        <label key={ussize} className='mr-3 mb-2 text-center'>
                          <input
                            className='size-check-box'
                            type="checkbox"
                            checked={selectedUsSize.includes(ussize)}
                            onChange={() => handleUsSizeSelect(ussize)}
                          />
                          {ussize}
                        </label>
                      ))}
                  </div>

                  <div className='mb-3'>
                      <h3 className='create-label mb-2'>Select UK sizes available:</h3>
                      {uksizes.map((uksize) => (
                        <label key={uksize} className='mr-3 mb-2 text-center'>
                          <input
                            className='size-check-box'
                            type="checkbox"
                            checked={selectedUkSize.includes(uksize)}
                            onChange={() => handleUkSizeSelect(uksize)}
                          />
                          {uksize}
                        </label>
                      ))}
                  </div>


                <div className="edit-button-group flex mt-2 flex-row justify-between items-center">
                  <div>
                      <Button className="edit-cancel-button border-none w-full" type="">
                        <Link to='/admin/productlist'>Cancel</Link>
                      </Button>
                  </div>
                  <div className="">
                      <Button 
                      className="edit-button border-none text-white w-full"
                      disabled={loadingUpdate} type="submit">
                        Save changes
                      </Button>
                      {loadingUpdate && <LoadingBox></LoadingBox>}
                  </div>
                </div>

              </Form>
            )}
        </div>
      <Footer />
    </div>
);
}