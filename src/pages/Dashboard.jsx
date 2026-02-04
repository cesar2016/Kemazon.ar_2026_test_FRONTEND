import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Package, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--primary-red)' }}>Dashboard</h2>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Hola, <strong>{user?.username || 'Usuario'}</strong></p>
                <p>Bienvenido a tu panel de control.</p>

                <div className="btn-group-mobile" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/create-product" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <PlusCircle size={20} /> Nuevo Producto
                    </Link>
                    <Link to="/my-products" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Package size={20} /> Ver Mis Productos
                    </Link>
                    <Link to="/my-purchases" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Package size={20} /> Mis Compras
                    </Link>
                    <Link to="/my-sales" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        <Package size={20} /> Mis Ventas
                    </Link>
                    <Link to="/profile" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                        Editar Perfil
                    </Link>
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageSquare size={20} /> Mensajes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
