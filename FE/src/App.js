import logo from './logo.svg';
import './App.css';
import { useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Carousel from './components/Carousel/Carousel';
import { Outlet, } from "react-router-dom";
import Detail from './components/Detail/Detail.jsx'
import Footer from './components/Footer/Footer.jsx';
import ContactBox from './components/ContactBox/ContactBox.jsx';
function App() {
  const location = useLocation();
  const hideCarousel = location.pathname === "/";

  return (
    <div >
      {!hideCarousel && <Header />}
      <Outlet />
      {!hideCarousel && <ContactBox />}
      {!hideCarousel && <Footer />}
    </div>
  );
}

export default App;

// import React from 'react';
// import { CartProvider } from 'react-use-cart';
// import CartOffcanvas from './CartOffcanvas';
// import ProductList from './ProductList ';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';

// const App = () => {
//   return (
//     <CartProvider>
//       <div className="container">
//         <h1>Giỏ hàng của tôi</h1>
//         <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCart" aria-controls="offcanvasCart">
//           Mở giỏ hàng
//         </button>
//         <ProductList />
//         <CartOffcanvas />
//       </div>
//     </CartProvider>
//   );
// };

// export default App;

