import { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { format } from 'date-fns';

const MySales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/orders/sales`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSales(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Cargando ventas...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>Mis Ventas</h1>
            {sales.length === 0 ? (
                <p>Aún no tienes ventas registradas.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {sales.map(order => (
                        <div key={order.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', background: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                                <span>{format(new Date(order.createdAt), 'dd/MM/yyyy')}</span>
                                <span style={{ fontWeight: 'bold', color: 'green' }}>Venta #{order.id}</span>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Comprador:</strong> {order.buyer ? `${order.buyer.fullName || order.buyer.username} (${order.buyer.email})` : 'Venta Manual / Externo'}
                                {order.buyer?.whatsapp && <div style={{ marginTop: '5px' }}>WhatsApp: {order.buyer.whatsapp}</div>}
                            </div>
                            {order.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', background: '#f9f9f9', padding: '0.5rem', borderRadius: '4px' }}>
                                    <img
                                        src={item.product?.images && item.product.images.length > 0 ? `${API_URL}${item.product.images[0]}` : 'https://via.placeholder.com/50'}
                                        alt={item.title}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{item.title} (x{item.quantity})</span>
                                            <span>$ {parseFloat(item.price).toLocaleString('es-AR')}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div style={{ marginTop: '1rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                Total: $ {parseFloat(order.total).toLocaleString('es-AR')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MySales;
