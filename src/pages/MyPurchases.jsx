import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { format } from 'date-fns';

const MyPurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/orders/purchases`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPurchases(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Cargando compras...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>Mis Compras</h1>
            {purchases.length === 0 ? (
                <p>Aún no has realizado ninguna compra.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {purchases.map(order => (
                        <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', background: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                <span>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</span>
                                <span style={{
                                    fontWeight: 'bold',
                                    color: order.status === 'APPROVED' ? 'green' : (order.status === 'PENDING' ? 'orange' : 'red')
                                }}>
                                    {order.status === 'APPROVED' ? 'Aprobado' : (order.status === 'PENDING' ? 'Pendiente' : 'Rechazado')}
                                </span>
                            </div>
                            {order.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <img
                                        src={item.product?.images && item.product.images.length > 0 ? `${API_URL}${item.product.images[0]}` : 'https://via.placeholder.com/60'}
                                        alt={item.title}
                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                    <div>
                                        <p style={{ fontWeight: 'bold', margin: 0 }}>{item.title}</p>
                                        <p style={{ margin: 0 }}>x{item.quantity} - $ {parseFloat(item.price).toLocaleString('es-AR')}</p>
                                    </div>
                                </div>
                            ))}
                            <div style={{ marginTop: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
                                Total: $ {parseFloat(order.total).toLocaleString('es-AR')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPurchases;
