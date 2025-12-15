import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Home() {
  // Dummy products
  const { addToCart } = useContext(CartContext);
  const products = [
    { id: 1, name: "Product A", price: 100 },
    { id: 2, name: "Product B", price: 200 },
    { id: 3, name: "Product C", price: 300 },
  ];

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Welcome to Our E-Commerce Store</h1>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        {products.map(product => (
          <div key={product.id} style={{
            border: "1px solid #ccc", 
            padding: "10px", 
            width: "150px",
            borderRadius: "5px"
          }}>
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
