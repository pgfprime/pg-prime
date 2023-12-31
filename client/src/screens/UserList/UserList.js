import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { CSVLink } from "react-csv";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import { Store } from '../../Store';
import { getError } from '../../uttils';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import './UserList.css';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function UserList() {
  const navigate = useNavigate();
  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const deleteHandler = async (user) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('user deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };


  return (
    <div className=''>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <Header />
      <div className='userlist-page md:w-[80%] w-[90%] my-10 mx-auto'>
        <div className='flex flex-row justify-between items-center'>
          <h1 className='my-3 text-xl font-bold'>Users</h1>
          <div className='csv-button'>
                  { users  &&
                  <CSVLink data={users}>Export</CSVLink>
                  
                  }
            </div>
        </div>
        
        {loadingDelete && <LoadingBox></LoadingBox>}
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div>
            { users.length === 0 ? (
                  <p className='no-users'>There are no users yet.</p>
                  ) : (
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>IS ADMIN</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td><span className='md:hidden mobile-header block font-semibold'>ID:&nbsp;</span>{user._id}</td>
                      <td><span className='md:hidden mobile-header block font-semibold'>NAME:&nbsp;</span>{user.name}</td>
                      <td><span className='md:hidden mobile-header block font-semibold'>EMAIL:&nbsp;</span>{user.email}</td>
                      <td><span className='md:hidden mobile-header block font-semibold'>ADMIN:&nbsp;</span>{user.isAdmin ? 'YES' : 'NO'}</td>
                      <td>
                        <Button
                        className='text-blue-800 border-blue-800'
                          type="button"
                          
                          onClick={() => navigate(`/admin/user/${user._id}`)}
                        >
                          Edit
                        </Button>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <Button
                        className='bg-red-600 text-gray-100 border-none'
                          type="button"
                          
                          onClick={() => deleteHandler(user)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
               ) 
              }
          </div>
        )}
      </div>
      <Footer />
 </div>
);
}