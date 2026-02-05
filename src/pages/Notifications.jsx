import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { Bell, MessageCircle, DollarSign, Package, CheckCircle, Info } from 'lucide-react';
import Spinner from '../components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data.notifications);
        } catch (err) {
            console.error(err);
            toast.error('Error al cargar notificaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (n) => {
        // Redirection logic
        const type = n.notificationType?.nameNotification;
        const relatedId = n.relatedId;

        if (!n.isRead) {
            // Mark as read in backend without blocking navigation
            markAsRead(n.id);
        }

        // Always redirect
        if (type === 'query' || type === 'answer') {
            if (relatedId) navigate(`/product/${relatedId}`);
        } else if (type === 'sale') {
            navigate('/my-sales');
        } else if (type === 'buy') {
            navigate('/my-purchases');
        } else if (type === 'manual_sale') {
            navigate('/my-sales');
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update UI locally
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/notifications/all/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success('Todas marcadas como leídas');
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Alta': return <Info size={20} color="#009ee3" />;
            case 'query': return <MessageCircle size={20} color="#00a650" />;
            case 'answer': return <MessageCircle size={20} color="#00a650" />;
            case 'sale': return <DollarSign size={20} color="#00a650" />;
            case 'manual_sale': return <DollarSign size={20} color="#666" />;
            case 'buy': return <Package size={20} color="#009ee3" />;
            default: return <Bell size={20} color="#666" />;
        }
    };

    if (loading) return (
        <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <Spinner />
        </div>
    );

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem' }}>Notificaciones</h1>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={markAllAsRead}
                        className="btn btn-outline"
                        style={{ fontSize: '0.9rem', padding: '5px 10px' }}
                    >
                        Marcar todas como leídas
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#999', background: 'white', borderRadius: '8px' }}>
                        <Bell size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <p>No tienes notificaciones por ahora.</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            style={{
                                background: n.isRead ? '#f3f4f6' : '#fff0f0', // Slight red tint for unread
                                padding: '1.5rem',
                                borderRadius: '8px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                display: 'flex',
                                gap: '15px',
                                alignItems: 'flex-start',
                                cursor: 'pointer',
                                borderLeft: n.isRead ? '4px solid #ccc' : '4px solid var(--primary-red)',
                                transition: 'transform 0.1s',
                                opacity: n.isRead ? 0.8 : 1
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                        >
                            <div style={{ marginTop: '2px' }}>
                                {getIcon(n.notificationType?.nameNotification)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <p style={{ fontSize: '1rem', color: '#333', fontWeight: n.isRead ? 'normal' : 'bold', margin: 0 }}>
                                        {n.message}
                                    </p>
                                    {!n.isRead && (
                                        <span style={{ fontSize: '0.7rem', background: 'var(--primary-red)', color: 'white', padding: '2px 6px', borderRadius: '4px', height: 'fit-content' }}>
                                            NUEVA
                                        </span>
                                    )}
                                </div>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                    {format(new Date(n.createdAt), 'dd/MM/yyyy HH:mm')}
                                </span>
                            </div>
                            {n.isRead && <CheckCircle size={16} color="#aaa" />}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
