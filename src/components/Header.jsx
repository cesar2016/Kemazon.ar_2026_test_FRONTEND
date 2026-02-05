import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { LogOut, LayoutDashboard, User, LogIn, UserPlus, ShoppingCart, Menu, X, Bell } from 'lucide-react';
import logo from '../assets/logo.png';
import API_URL from '../config/api';
import axios from 'axios';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    // Placeholder image service for avatar based on username, or real avatar if available
    const avatarUrl = user && user.avatar
        ? `${API_URL}${user.avatar}`
        : (user ? `https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff` : '');

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    // Fetch unread notifications count
    useEffect(() => {
        if (!user) return;

        const fetchUnread = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/notifications/unread-count`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUnreadCount(res.data.count);
            } catch (err) {
                console.error('Error fetching unread notifications:', err);
            }
        };

        fetchUnread();
        const interval = setInterval(fetchUnread, 30000); // Poll every 30s

        return () => clearInterval(interval);
    }, [user]);

    return (
        <header style={{
            backgroundColor: 'var(--primary-red)',
            color: 'white',
            padding: '1rem 0',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            zIndex: 1000
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }} title="Ir a Inicio" onClick={closeMenu}>
                    <img src={logo} alt="Kemazon.ar" style={{ height: '40px' }} />
                    <span>Kemazon.ar</span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="show-mobile"
                    onClick={toggleMenu}
                    style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                    {isMenuOpen ? <X size={28} /> : <div style={{ display: 'flex', gap: '15px' }}>
                        {/* Mobile Bell */}
                        {user && (
                            <div onClick={(e) => { e.stopPropagation(); navigate('/notifications'); closeMenu(); }} style={{ position: 'relative' }}>
                                <Bell size={24} />
                                {unreadCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        background: 'white',
                                        color: 'var(--primary-red)',
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold',
                                        borderRadius: '50%',
                                        width: '16px',
                                        height: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </div>
                        )}
                        <Menu size={28} />
                    </div>}
                </button>

                <nav className="hide-mobile">
                    <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
                        <NavLinks user={user} cartCount={cartCount} avatarUrl={avatarUrl} logout={logout} unreadCount={unreadCount} />
                    </ul>
                </nav>

                {/* Mobile Nav Overlay */}
                {isMenuOpen && (
                    <div className="show-mobile" style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'var(--primary-red)',
                        padding: '1rem',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', listStyle: 'none', margin: 0, padding: 0 }}>
                            <NavLinks user={user} cartCount={cartCount} avatarUrl={avatarUrl} logout={logout} unreadCount={unreadCount} isMobile={true} closeMenu={closeMenu} />
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

const NavLinks = ({ user, cartCount, avatarUrl, logout, unreadCount, isMobile = false, closeMenu = () => { } }) => {
    const linkStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: 'white',
        textDecoration: 'none',
        fontSize: isMobile ? '1.1rem' : '1rem',
        padding: isMobile ? '10px 0' : '0'
    };

    return (
        <>
            {user ? (
                <>
                    {/* Dashboard */}
                    <li>
                        <Link to="/dashboard" style={linkStyle} title="Tu Panel de Control" onClick={closeMenu}>
                            <LayoutDashboard size={isMobile ? 24 : 18} />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    {/* Notifications (Bell) */}
                    <li style={{ marginRight: '5px' }}>
                        <Link to="/notifications" style={{ position: 'relative', color: 'white', display: 'flex', ...linkStyle }} title="Notificaciones" onClick={closeMenu}>
                            <Bell size={22} />
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'white',
                                    color: 'var(--primary-red)',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid var(--primary-red)'
                                }}>
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                            {isMobile && <span>Notificaciones</span>}
                        </Link>
                    </li>

                    {/* Cart */}
                    <li>
                        <Link to="/cart" style={linkStyle} title="Tu Carrito" onClick={closeMenu}>
                            <div style={{ position: 'relative', display: 'flex' }}>
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: 'white',
                                        color: 'var(--primary-red)',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        borderRadius: '50%',
                                        width: '18px',
                                        height: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px solid var(--primary-red)'
                                    }}>
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            {isMobile && <span>Carrito</span>}
                        </Link>
                    </li>

                    {/* Profile */}
                    <li style={isMobile ? {} : { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '20px' }}>
                        <Link to="/profile" style={linkStyle} onClick={closeMenu}>
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ fontWeight: '500' }}>{user.username}</span>
                        </Link>
                    </li>

                    {/* Logout */}
                    <li>
                        <Link to="/" onClick={() => { logout(); closeMenu(); }} style={{ ...linkStyle, background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', justifyContent: isMobile ? 'flex-start' : 'center', display: 'flex' }} title="Cerrar Sessión">
                            <LogOut size={isMobile ? 24 : 18} />
                            <span>Salir</span>
                        </Link>
                    </li>
                </>
            ) : (
                <>
                    <li>
                        <Link to="/login" style={linkStyle} title="Ingresar a tu cuenta" onClick={closeMenu}>
                            <LogIn size={isMobile ? 24 : 18} />
                            <span>Ingresar</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/register" style={linkStyle} title="Crear una cuenta nueva" onClick={closeMenu}>
                            <UserPlus size={isMobile ? 24 : 18} />
                            <span>Registro</span>
                        </Link>
                    </li>
                </>
            )}
        </>
    );
};

export default Header;
