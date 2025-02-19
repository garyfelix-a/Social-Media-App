import { useEffect, useState } from "react"
import { getProfile } from "../services/api";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        getProfile()
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false));
    }, []);

    if(isAuthenticated === null) return null;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;