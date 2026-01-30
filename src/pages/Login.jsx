import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Spinner from '../components/Spinner';
import API_URL from '../config/api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, formData);
            // Bug fix: Pass both token AND user data to login context
            login(res.data.token, res.data.user);
            toast.success(`Bienvenido de nuevo, ${res.data.user.username}!`);
            navigate('/');
        } catch (err) {
            console.error(err.response?.data);
            toast.error(err.response?.data?.msg || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-red)' }}>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '0 10px', background: '#fff' }}>
                        <Mail size={18} color="#666" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="tu@email.com"
                            style={{ border: 'none', outline: 'none', width: '100%', padding: '10px' }}
                        />
                    </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contraseña</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '0 10px', background: '#fff' }}>
                        <Lock size={18} color="#666" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="******"
                            style={{ border: 'none', outline: 'none', width: '100%', padding: '10px' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '5px' }}
                        >
                            {showPassword ? <EyeOff size={18} color="#666" /> : <Eye size={18} color="#666" />}
                        </button>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={loading}>
                    {loading ? <Spinner size={20} color="#fff" /> : <><LogIn size={18} /> Ingresar</>}
                </button>
            </form>
        </div>
    );
};

export default Login;
