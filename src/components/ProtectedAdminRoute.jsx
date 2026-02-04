import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedAdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    // Check if user is logged in AND has roleId 1 (Admin)
    if (user && user.roleId === 1) {
        return <Outlet />;
    }

    // Redirect to home if not admin
    return <Navigate to="/" replace />;
};

export default ProtectedAdminRoute;
