import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import API_URL from '../config/api';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext); // Added updateQuantity

    const total = cart.reduce((acc, item) => acc + (parseFloat(item.price) * (item.quantity || 1)), 0); // Updated total calculation

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to login or show toast
                return;
            }

            // Group items by seller to check for multiple sellers
            const sellers = [...new Set(cart.map(item => item.userId))];
            if (sellers.length > 1) {
                toast.error('Por limitaciones de MercadoPago, solo puedes pagar productos de un único vendedor por transacción. Por favor, deja solo productos de un vendedor.');
                return;
            }

            const res = await axios.post(`${API_URL}/api/payment/create_preference`, {
                items: cart.map(item => ({
                    title: item.name,
                    price: item.price,
                    quantity: item.quantity || 1,
                    picture_url: item.images && item.images.length > 0 ? `${API_URL}${item.images[0]}` : '',
                    productId: item.id
                }))
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.href = res.data.init_point;
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.msg || 'Error al iniciar el pago. Intenta nuevamente.';
            // Use toast for better UI, with a longer duration for reading
            toast.error(msg, { duration: 5000 });
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Tu carrito está vacío</h2>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                    Ir a comprar
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem' }}>Carrito de Compras</h1>
            <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                    {cart.map((item, index) => (
                        <div key={`${item.id}-${index}`} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            <img
                                src={item.images && item.images.length > 0 ? `${API_URL}${item.images[0]}` : 'https://via.placeholder.com/100'}
                                alt={item.name}
                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                            />
                            <div style={{ flex: 1 }}>
                                <Link to={`/product/${item.id}`} style={{ fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
                                    {item.name}
                                </Link>
                                <p style={{ fontSize: '1.2rem', fontWeight: '300', marginTop: '0.5rem' }}>
                                    $ {parseFloat(item.price).toLocaleString('es-AR')}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                    <button onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)} disabled={(item.quantity || 1) <= 1} style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>-</button>
                                    <span style={{ fontWeight: 'bold' }}>{item.quantity || 1}</span>
                                    <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} style={{ width: '30px', height: '30px', borderRadius: '4px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>+</button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}
                                    title="Eliminar"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <p style={{ fontWeight: 'bold' }}>
                                    $ {(parseFloat(item.price) * (item.quantity || 1)).toLocaleString('es-AR')}
                                </p>
                            </div>
                        </div>
                    ))}
                    <button onClick={clearCart} style={{ color: '#666', border: 'none', background: 'transparent', cursor: 'pointer', textDecoration: 'underline' }}>
                        Vaciar carrito
                    </button>
                </div>
                <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Resumen</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                        <span>Total</span>
                        <span style={{ fontWeight: 'bold' }}>$ {total.toLocaleString('es-AR')}</span>
                    </div>
                    <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', padding: '1rem', backgroundColor: '#009ee3', borderColor: '#009ee3', fontSize: '1.1rem' }}>
                        Pagar con MercadoPago
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
