import React, { useEffect, useState } from "react";
import "../App.css";

const UserDetail = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) return <div className="profile">Loading user details...</div>;

  return (
    <div className="profile">
      <h2>User Details</h2>
      <ul className="profile-list">
        <li><strong>User ID:</strong> {user._id || "N/A"}</li>
        <li><strong>Name:</strong> {user.name || "N/A"}</li>
        <li><strong>Email:</strong> {user.email || "N/A"}</li>
        <li><strong>Role:</strong> {user.role || "N/A"}</li>
      </ul>
    </div>
  );
};

export default UserDetail;
