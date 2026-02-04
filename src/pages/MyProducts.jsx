import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Trash2, Edit, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Spinner from '../components/Spinner';
import API_URL from '../config/api';
import ConfirmationModal from '../components/ConfirmationModal';

const MyProducts = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProducts = async () => {
            if (user) {
                try {
                    const res = await axios.get(`${API_URL}/api/products/user/${user.id}`);
                    setProducts(res.data);
                } catch (err) {
                    console.error('Error fetching user products:', err);
                    toast.error('Error al cargar tus productos');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserProducts();
    }, [user]);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false
    });

    const openDeleteModal = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'Eliminar Producto',
            message: '¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.',
            isDestructive: true,
            onConfirm: () => handleDelete(id)
        });
    };

    const openSoldModal = (id) => {
        setModalConfig({
            isOpen: true,
            title: 'Marcar como Vendido',
            message: '¿Confirmas que vendiste este producto por fuera del sistema? Se marcará como vendido en tu historial y se eliminará del listado público.',
            isDestructive: false,
            onConfirm: () => handleMarkAsSold(id)
        });
    };

    const [processingId, setProcessingId] = useState(null);

    const handleDelete = async (id) => {
        setProcessingId(id);
        try {
            await axios.delete(`${API_URL}/api/products/${id}`);
            setProducts(products.filter(product => product.id !== id));
            toast.success('Producto eliminado correctamente');
        } catch (err) {
            console.error('Error deleting product:', err);
            toast.error('No se pudo eliminar el producto');
        } finally {
            setProcessingId(null);
        }
    };

    const handleMarkAsSold = async (id) => {
        setProcessingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/products/${id}/mark-sold`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.filter(product => product.id !== id));
            toast.success('¡Producto marcado como vendido! Revisa tu historial de ventas.');
        } catch (err) {
            console.error('Error marking as sold:', err);
            // If it was mostly a race condition and it's already sold, we can update UI
            if (err.response && err.response.status === 400) {
                 toast.error(err.response.data.msg);
                 // Refresh list to sync state
                 const token = localStorage.getItem('token'); // Should use token for consistency if needed, but fetchUserProducts uses logic from context usually or just id
            } else {
                 toast.error('Error al marcar como vendido');
            }
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return (
        <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <Spinner size={40} />
        </div>
    );

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <ConfirmationModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                message={modalConfig.message}
                onConfirm={modalConfig.onConfirm}
                isDestructive={modalConfig.isDestructive}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--primary-red)' }}>Mis Productos</h2>
                <Link to="/create-product" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <PlusCircle size={18} /> Nuevo Producto
                </Link>
            </div>

            {products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                    <AlertCircle size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1.2rem', color: '#666' }}>Aún no has publicado ningún producto.</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', background: '#f9f9f9' }}>
                                <th style={{ padding: '1rem' }}>Imagen</th>
                                <th style={{ padding: '1rem' }}>Nombre</th>
                                <th style={{ padding: '1rem' }}>Precio</th>
                                <th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <img
                                            src={product.images && product.images.length > 0 ? `${API_URL}${product.images[0]}` : 'https://via.placeholder.com/50'}
                                            alt={product.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{product.name}</td>
                                    <td style={{ padding: '1rem' }}>$ {parseFloat(product.price).toLocaleString('es-AR')}</td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                            <button 
                                                onClick={() => openSoldModal(product.id)}
                                                className="btn"
                                                title="Marcar como vendido"
                                                disabled={processingId === product.id}
                                                style={{ 
                                                    padding: '8px', 
                                                    background: '#e8f5e9', 
                                                    color: 'green', 
                                                    border: 'none', 
                                                    borderRadius: '4px',
                                                    opacity: processingId === product.id ? 0.5 : 1
                                                }}
                                            >
                                                <CheckCircle size={16} />
                                            </button>
                                            <Link to={`/edit-product/${product.id}`} className="btn" style={{ padding: '8px', background: '#eee', color: '#333', border: 'none', borderRadius: '4px', pointerEvents: processingId === product.id ? 'none' : 'auto', opacity: processingId === product.id ? 0.5 : 1 }}>
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => openDeleteModal(product.id)}
                                                className="btn"
                                                disabled={processingId === product.id}
                                                style={{ 
                                                    padding: '8px', 
                                                    background: '#ffebee', 
                                                    color: 'red', 
                                                    border: 'none', 
                                                    borderRadius: '4px',
                                                    opacity: processingId === product.id ? 0.5 : 1 
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyProducts;
