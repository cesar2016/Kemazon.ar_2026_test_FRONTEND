import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { toast } from 'sonner';
import { CreditCard, Save } from 'lucide-react';

const PaymentSettings = () => {
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        const fetchMethods = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_URL}/api/payment-methods`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Find MP method
                const mp = res.data.find(m => m.provider === 'MERCADOPAGO');
                if (mp) {
                    setAccessToken(mp.accessToken); // Will be masked from backend, but usable to show "it's set"
                }
            } catch (err) {
                console.error(err);
                // toast.error('Error loading payment settings');
            } finally {
                setFetched(true);
            }
        };
        fetchMethods();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/payment-methods`,
                {
                    provider: 'MERCADOPAGO',
                    accessToken: accessToken
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('MercadoPago configurado correctamente');
        } catch (err) {
            console.error(err);
            toast.error('Error al guardar configuración');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', marginBottom: '1rem' }}>
                <CreditCard size={20} /> Configuración de Cobros
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                Para vender productos y cobrar con MercadoPago, necesitas ingresar tu <strong>Access Token</strong> (Producción) de MercadoPago.
                Si no lo configuras, tus ventas aparecerán como "Acordar con el vendedor".
            </p>

            <form onSubmit={handleSave}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>MercadoPago Access Token</label>
                    <input
                        type="password" // Password type to hide it slightly, though it might be masked
                        placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                    <small style={{ display: 'block', marginTop: '5px', color: '#888' }}>
                        Puedes obtenerlo en <a href="https://www.mercadopago.com.ar/developers/panel" target="_blank" rel="noopener noreferrer">Tu Panel de Desarrollador</a>.
                    </small>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#009ee3', borderColor: '#009ee3' }}
                >
                    <Save size={18} />
                    {loading ? 'Guardando...' : 'Guardar Configuración'}
                </button>
            </form>
        </div>
    );
};

export default PaymentSettings;
