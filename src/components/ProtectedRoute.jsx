import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
                <Spinner />
            </div>
        );
    }

    // Redirect to Home if not authenticated, as requested
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
