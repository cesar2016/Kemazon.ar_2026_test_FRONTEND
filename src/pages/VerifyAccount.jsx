
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import { CheckCircle, XCircle } from 'lucide-react';
import Spinner from '../components/Spinner';

const VerifyAccount = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.post(`${API_URL}/api/auth/verify`, { token });
                setStatus('success');
                setMessage(res.data.msg);
            } catch (err) {
                console.error(err);
                setStatus('error');
                setMessage(err.response?.data?.msg || 'Error verifying account');
            }
        };

        if (token) {
            verify();
        } else {
            setStatus('error');
            setMessage('No token provided');
        }
    }, [token]);

    return (
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                {status === 'verifying' && (
                    <>
                        <Spinner size={40} color="var(--primary-red)" />
                        <p style={{ marginTop: '1rem' }}>Verificando tu cuenta...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle size={64} color="#28a745" style={{ marginBottom: '1rem' }} />
                        <h2 style={{ marginBottom: '1rem', color: '#28a745' }}>¡Cuenta Verificada!</h2>
                        <p style={{ marginBottom: '2rem' }}>{message}</p>
                        <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <XCircle size={64} color="#dc3545" style={{ marginBottom: '1rem' }} />
                        <h2 style={{ marginBottom: '1rem', color: '#dc3545' }}>Error de Verificación</h2>
                        <p style={{ marginBottom: '2rem' }}>{message}</p>
                        <Link to="/" className="btn btn-secondary">Volver al Inicio</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyAccount;
