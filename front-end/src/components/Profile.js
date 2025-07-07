import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const API_BASE = process.env.REACT_APP_API_URL;

  useEffect(() => {
    let intervalId;

    const fetchHistory = async () => {
      let user = null;
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          user = JSON.parse(storedUser);
        }
      } catch (err) {
        console.error("❌ Invalid user data:", err);
        return;
      }

      const token = localStorage.getItem("token");

      if (!user || !token) {
        console.warn("User or token not found");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/purchase-history/${user._id}`, {
          headers: { authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error("❌ Failed to fetch purchase history:", error);
      }
    };

    fetchHistory();
    intervalId = setInterval(fetchHistory, 10000); // auto-refresh every 10 seconds

    return () => clearInterval(intervalId); // cleanup on unmount
  }, [API_BASE]);

  const filtered = filter === 'all'
    ? history
    : history.filter(p => p.status === filter);

  return (
    <div className="profile">
      <h2>My Purchase History</h2>

      <div className="filter-buttons" style={{ marginBottom: '15px' }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("success")}>Success</button>
        <button onClick={() => setFilter("in progress")}>In Progress</button>
        <button onClick={() => setFilter("failed")}>Failed</button>
      </div>

      <ul>
        {filtered.length > 0 ? (
          filtered.map((item, i) => (
            <li key={i}>
              <strong>{item.productName}</strong> – ₹{item.price} –{" "}
              <span style={{
                color:
                  item.status === "success" ? "green" :
                  item.status === "failed" ? "red" :
                  "orange"
              }}>
                {item.status}
              </span>
            </li>
          ))
        ) : (
          <p>No purchases found</p>
        )}
      </ul>
    </div>
  );
};

export default Profile;
