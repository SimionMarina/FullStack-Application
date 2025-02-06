import { Navigate } from "react-router-dom";
import { useAuth } from "../../CONTEXT/authContext";
import { useEffect, useState } from "react";
import axios from "axios";

function ProtectedRoute({ children }) {
  const { setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/verifyToken", {
          headers: { Authorization: token },
        });

        if (response.data && response.data.user) {
          setCurrentUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [setCurrentUser]);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
