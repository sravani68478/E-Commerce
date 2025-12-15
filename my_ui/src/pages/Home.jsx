import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchCartCount = async () => {
    try {
      const res = await api.get("/getcart");
      const count = res.data.items?.reduce((total, item) => total + item.quantity, 0) || 0;
      setCartCount(count);
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/getallproduct");
        setProducts(res.data);
        setFilteredProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    
    // Fetch cart count if logged in
    const token = localStorage.getItem("token");
    if (token) {
      fetchCartCount();
    }
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.discription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    try {
      await api.post("/addcart", { productid: productId });
      alert("Product added to cart!");
      fetchCartCount(); // Update cart count
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart");
    }
  };

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="home">
      <header className="home-header">
        <h1>Welcome to E-Commerce Store</h1>
        <div className="header-links">
          {token ? (
            <>
              <Link to="/cart" className="cart-link">
                🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/orders">My Orders</Link>
              {role === "admin" && <Link to="/admin">Admin Panel</Link>}
              <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search products by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="clear-search">✕</button>
        )}
      </div>

      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-products">
            {searchQuery ? `No products found for "${searchQuery}"` : "No products available"}
          </p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img 
                  src={product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="200"%3E%3Crect fill="%23ddd" width="280" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="280" height="200"%3E%3Crect fill="%23ddd" width="280" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                <h3>{product.name}</h3>
                <p>{product.discription}</p>
                <p className="price">₹{product.price}</p>
              </Link>
              <button onClick={() => addToCart(product._id)}>Add to Cart</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
