import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ 
      padding: "10px 20px", 
      backgroundColor: "#1976d2", 
      color: "white", 
      display: "flex", 
      justifyContent: "space-between" 
    }}>
      <h2>E-Commerce</h2>
      <div>
        <Link to="/" style={{ color: "white", margin: "0 10px" }}>Home</Link>
        <Link to="/cart" style={{ color: "white", margin: "0 10px" }}>Cart</Link>
        <Link to="/checkout" style={{ color: "white", margin: "0 10px" }}>Checkout</Link>
        <Link to="/orders" style={{ color: "white", margin: "0 10px" }}>My Orders</Link>
      </div>
    </nav>
  );
}

export default Navbar;
