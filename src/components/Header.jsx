import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User, LogIn, UserPlus } from 'lucide-react';
import logo from '../assets/logo.png';
import API_URL from '../config/api';

const Header = () => {
    const { user, logout } = useContext(AuthContext);

    // Placeholder image service for avatar based on username, or real avatar if available
    const avatarUrl = user && user.avatar
        ? `${API_URL}${user.avatar}`
        : (user ? `https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff` : '');

    return (
        <header style={{
            backgroundColor: 'var(--primary-red)',
            color: 'white',
            padding: '1rem 0',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }} title="Ir a Inicio">
                    <img src={logo} alt="Kemazon.ar" style={{ height: '40px' }} />
                    <span>Kemazon.ar</span>
                </Link>
                <nav>
                    <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
                        {user ? (
                            <>
                                <li>
                                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '5px' }} title="Tu Panel de Control">
                                        <LayoutDashboard size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '20px' }}>
                                    <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                                            title={`Perfil de ${user.username}`}
                                        />
                                        <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{user.username}</span>
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={logout} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} title="Cerrar Sessión">
                                        <LogOut size={18} />
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '5px' }} title="Ingresar a tu cuenta">
                                        <LogIn size={18} />
                                        <span>Ingresar</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" style={{ display: 'flex', alignItems: 'center', gap: '5px' }} title="Crear una cuenta nueva">
                                        <UserPlus size={18} />
                                        <span>Registro</span>
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
