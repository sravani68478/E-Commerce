import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

// Empty pages for now
function Cart() { return <h1>Cart Page</h1>; }
function Checkout() { return <h1>Checkout Page</h1>; }
function MyOrders() { return <h1>My Orders</h1>; }

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
