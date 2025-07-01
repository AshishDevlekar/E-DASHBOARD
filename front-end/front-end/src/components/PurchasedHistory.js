import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL;

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    if (!user || !token) return;

    const fetchHistory = () => {
      fetch(`${API_BASE}/purchase-history/${user._id}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(err => console.error("Error fetching history:", err));
    };

    fetchHistory();
    const intervalId = setInterval(fetchHistory, 10000); // Refresh every 10s

    return () => clearInterval(intervalId);
  }, [user?._id, token]);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "success": return "status-success";
      case "in progress": return "status-progress";
      case "failed": return "status-failed";
      default: return "";
    }
  };

  return (
    <div className="purchase-history">
      <h2>Purchase History</h2>
      {history.length > 0 ? (
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
                <td className={getStatusClass(item.status)}>
                  {item.status}
                </td>
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
      ) : (
        <p>No purchase history found.</p>
      )}
    </div>
  );
};

export default PurchaseHistory;
