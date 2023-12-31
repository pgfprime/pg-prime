import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './screens/Home/Home';
import Product from './screens/Product/Product';
import ErrorPage from './screens/NoPage/NoPage';
import Cart from './screens/Cart/Cart';
import Signin from './screens/Signin/Signin.js';
import ShippingAddress from './screens/ShippingAddress/ShippingAddress';
import DashboardScreen from './screens/Dashboard/Dashboard';
import Signup from './screens/Signup/Signup';
import Payment from './screens/Payment/Payment';
import PlaceOrder from './screens/PlaceOrder/PlaceOrder';
import Order from './screens/Order/Order';
import OrderHistory from './screens/OrderHistory/OrderHistory';
import Profile from './screens/Profile/Profile';
import Search from './screens/Search/Search';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './screens/Dashboard/Dashboard';
import AdminRoute from './components/AdminRoute';
import OrderList from './screens/OrderList/OrderList';
import ProductList from './screens/ProductList/ProductList';
import UserList from './screens/UserList/UserList';
import EditProduct from './screens/EditProduct/EditProduct';
import UserEdit from './screens/UserEdit/UserEdit';
import CreateProduct from './screens/CreateProduct/CreateProduct';
import ForgotPassword from './screens/ForgotPassword/ForgotPassword';
import ResetPassword from './screens/ResetPassword/ResetPassword';
import CheckEmail from './screens/CheckEmail/CheckEmail';
import RefundPolicy from './screens/RefundPolicy/RefundPolicy';
import Gallery from './screens/Gallery/Gallery';


function App() {
  // const { state, dispatch: ctxDispatch } = useContext(Store);
  // const { cart, userInfo } = state;

  // const signoutHandler = () => {
  //   ctxDispatch({ type: 'USER_SIGNOUT', });
  //   localStorage.removeItem('userInfo');
  //   localStorage.removeItem('shippingAddress');
  //   localStorage.removeItem('paymentMethod');
  //   window.location.href='/signin';
  // }


  return (
    <BrowserRouter className="relative">
      <ToastContainer position='bottom-center' limit={1} />
      <main className="main">
        <Routes className="">
                <Route>
                  <Route index element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/forget-password" element={<ForgotPassword />}/>
                  <Route path="/reset-password/:token" element={<ResetPassword />}/>
                  <Route path="/check-email" element={<CheckEmail />}/>
                  <Route path="/refundpolicy" element={<RefundPolicy />}/>
                  <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute> }/>
                  <Route path="/shipping" element={<ShippingAddress />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/placeorder" element={<PlaceOrder />} />
                  <Route path="/search" element={<Search />} />
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                  <Route path="/admin/orderlist" element={<AdminRoute><OrderList /></AdminRoute>}></Route>
                  <Route path="/admin/productlist" element={<AdminRoute><ProductList /></AdminRoute>}></Route>
                  <Route path="/admin/product/:id" element={<AdminRoute><EditProduct /></AdminRoute>}></Route>
                  <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen /></AdminRoute>}></Route>
                  <Route path="/admin/createproduct" element={<AdminRoute><CreateProduct /></AdminRoute>}></Route>
                  <Route path="/admin/user/:id"element={<AdminRoute><UserEdit /></AdminRoute>}></Route>
                  <Route path="/admin/userlist" element={<AdminRoute><UserList /></AdminRoute>}></Route>
                  <Route path="/order/:id" element={<ProtectedRoute><Order /></ProtectedRoute>} />
                  <Route path="/orderhistory" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                  <Route path='/product/:slug' element={<Product />} />
                </Route>
                <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
