import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await api.get("/getorder");
      // Backend now returns an array of orders
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.put(`/cancelorder/${orderId}`);
      alert("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      console.error("Cancel order error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Failed to cancel order";
      alert(errorMsg);
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div>
      <div className="home-header">
        <h1>My Orders</h1>
        <div className="header-links">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem" }}>
            <h2>No orders yet</h2>
            <Link to="/">
              <button>Start Shopping</button>
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <span className={`status ${order.orderstatus}`}>
                    {order.orderstatus}
                  </span>
                </div>
                <div className="order-details">
                  <p><strong>Total Amount:</strong> ₹{order.totalamount}</p>
                  <p><strong>Payment Status:</strong> {order.paymentstatus}</p>
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-items">
                  <h4>Items:</h4>
                  {order.items?.map((item, idx) => (
                    <p key={idx}>
                      {item.product?.name} - Qty: {item.quantity} - ₹{item.product?.price}
                    </p>
                  ))}
                </div>
                {order.orderstatus === "pending" && (
                  <button 
                    className="cancel-btn" 
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
