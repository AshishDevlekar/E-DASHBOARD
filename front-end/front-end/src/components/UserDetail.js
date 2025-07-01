import React, { useEffect, useState } from "react";
import "../App.css";

const UserDetail = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
      }
    }
  }, []);

  if (!user) {
    return <div className="profile">Loading user details...</div>;
  }

  return (
    <div className="page-center">
      <div className="profile">
        <h2>User Details</h2>
        <ul className="profile-list">
          <li><strong>User ID:</strong> {user._id || "N/A"}</li>
          <li><strong>Name:</strong> {user.name || "N/A"}</li>
          <li><strong>Email:</strong> {user.email || "N/A"}</li>
          <li><strong>Role:</strong> {user.role || "User"}</li>
        </ul>
      </div>
    </div>
  );
};

export default UserDetail;
