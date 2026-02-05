import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { LogOut, LayoutDashboard, User, LogIn, UserPlus, ShoppingCart, Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';
import API_URL from '../config/api';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Placeholder image service for avatar based on username, or real avatar if available
    const avatarUrl = user && user.avatar
        ? `${API_URL}${user.avatar}`
        : (user ? `https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff` : '');

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

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
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Desktop Nav */}
                <nav className="hide-mobile">
                    <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
                        <NavLinks user={user} cartCount={cartCount} avatarUrl={avatarUrl} logout={logout} />
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
                            <NavLinks user={user} cartCount={cartCount} avatarUrl={avatarUrl} logout={logout} isMobile={true} closeMenu={closeMenu} />
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

const NavLinks = ({ user, cartCount, avatarUrl, logout, isMobile = false, closeMenu = () => { } }) => {
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
            <li>
                <Link to="/cart" style={linkStyle} title="Tu Carrito" onClick={closeMenu}>
                    <ShoppingCart size={isMobile ? 24 : 22} />
                    <span>Carrito {cartCount > 0 && `(${cartCount})`}</span>
                </Link>
            </li>
            {user ? (
                <>
                    <li>
                        <Link to="/dashboard" style={linkStyle} title="Tu Panel de Control" onClick={closeMenu}>
                            <LayoutDashboard size={isMobile ? 24 : 18} />
                            <span>Dashboard</span>
                        </Link>
                    </li>
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
