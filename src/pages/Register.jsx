import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import Spinner from '../components/Spinner';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            login(res.data.token);
            toast.success('¡Registro exitoso! Bienvenido a Kemazon.ar');
            navigate('/');
        } catch (err) {
            console.error(err.response?.data);
            toast.error(err.response?.data?.msg || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 0', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--primary-red)' }}>Registrarse</h2>
            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Usuario</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '0 10px', background: '#fff' }}>
                        <User size={18} color="#666" />
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            placeholder="Nombre de usuario"
                            style={{ border: 'none', outline: 'none', width: '100%', padding: '10px' }}
                        />
                    </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '0 10px', background: '#fff' }}>
                        <Mail size={18} color="#666" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="ejemplo@correo.com"
                            style={{ border: 'none', outline: 'none', width: '100%', padding: '10px' }}
                        />
                    </div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contraseña</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', padding: '0 10px', background: '#fff' }}>
                        <Lock size={18} color="#666" />
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="******"
                            style={{ border: 'none', outline: 'none', width: '100%', padding: '10px' }}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={loading}>
                    {loading ? <Spinner size={20} color="#fff" /> : <><UserPlus size={18} /> Registrarse</>}
                </button>
            </form>
        </div>
    );
};

export default Register;
