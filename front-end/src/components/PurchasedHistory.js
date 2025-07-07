import React, { useEffect, useState } from 'react';

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL;

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("❌ Invalid user data in localStorage", e);
  }

  const token = localStorage.getItem("token"); // ✅ NO JSON.parse()

  useEffect(() => {
    if (!user || !token) {
      setError("🔒 Please log in to view your purchase history.");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/purchase-history/${user._id}`, {
          headers: { authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch history");

        const data = await res.json();
        setHistory(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("⚠️ Could not fetch purchase history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    const intervalId = setInterval(fetchHistory, 10000); // auto-refresh every 10s

    return () => clearInterval(intervalId);
  }, [API_BASE, user, token]);

  const getStatusDisplay = (status) => {
    const s = status.toLowerCase();
    if (s === "success") return <span className="status-success">✅ Success</span>;
    if (s === "in progress") return <span className="status-progress">⏳ In Progress</span>;
    if (s === "failed") return <span className="status-failed">❌ Failed</span>;
    return status;
  };

  return (
    <div className="purchase-history">
      <h2>Purchase History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : history.length > 0 ? (
        <div className="table-wrapper">
          <table className="purchase-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item._id}>
                  <td>{item.productName}</td>
                  <td>₹{item.price}</td>
                  <td>{getStatusDisplay(item.status)}</td>
                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No purchase history found.</p>
      )}
    </div>
  );
};

export default PurchaseHistory;
