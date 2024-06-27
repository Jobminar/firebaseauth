import React, { useEffect, useState, useCallback } from "react";
import { auth } from "../firebase"; // Adjust the path if necessary
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = useCallback(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserDetails({
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        navigate("/auth");
      }
    });
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div>
      {userDetails ? (
        <>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={userDetails.photoURL}
              width={"40%"}
              style={{ borderRadius: "50%" }}
              alt="Profile"
            />
          </div>
          <h3>Welcome {userDetails.displayName} 🙏🙏</h3>
          <div>
            <p>Email: {userDetails.email}</p>
          </div>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
