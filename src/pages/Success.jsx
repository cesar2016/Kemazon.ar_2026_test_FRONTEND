import { useEffect, useState, useContext } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import { CartContext } from '../context/CartContext';
import { toast } from 'sonner';

const Success = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useContext(CartContext);
    const [loading, setLoading] = useState(true);

    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference'); // This is our orderId

    useEffect(() => {
        const confirmOrder = async () => {
            if (!externalReference || !status) {
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                await axios.post(`${API_URL}/api/orders/confirm`, {
                    orderId: externalReference,
                    paymentId: paymentId,
                    status: status
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (status === 'approved') {
                    clearCart();
                    toast.success('¡Compra realizada con éxito!');
                } else {
                    toast.warning('El pago no fue aprobado.');
                }
            } catch (error) {
                console.error(error);
                toast.error('Error al confirmar la orden.');
            } finally {
                setLoading(false);
            }
        };

        confirmOrder();
    }, []);

    if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}><h2>Procesando tu compra...</h2></div>;

    return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            {status === 'approved' ? (
                <>
                    <h1 style={{ color: '#00a650', marginBottom: '1rem' }}>¡Gracias por tu compra!</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>El vendedor ha sido notificado. Puedes ver los detalles en tu historial.</p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/my-purchases" className="btn btn-primary">Ver mis compras</Link>
                        <Link to="/" className="btn btn-secondary">Seguir comprando</Link>
                    </div>
                </>
            ) : (
                <>
                    <h1 style={{ color: '#ff4d4d', marginBottom: '1rem' }}>Hubo un problema con el pago</h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>El estado de tu pago es: <strong>{status}</strong></p>
                    <Link to="/cart" className="btn btn-primary">Volver al carrito</Link>
                </>
            )}
        </div>
    );
};

export default Success;
