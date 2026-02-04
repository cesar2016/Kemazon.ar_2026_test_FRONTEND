import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { User, MapPin, Mail, Phone, Camera, Save } from 'lucide-react';
import { toast } from 'sonner';
import Spinner from '../components/Spinner';
import API_URL from '../config/api';

const EditProfile = () => {
    const { user, login } = useContext(AuthContext); // Re-login to update context if needed
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        country: '',
        province: '',
        city: '',
        whatsapp: '',
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`${API_URL}/api/users/${user.id}`);
                const u = res.data;
                setFormData({
                    username: u.username,
                    email: u.email,
                    fullName: u.fullName || '',
                    country: u.country || '',
                    province: u.province || '',
                    city: u.city || '',
                    whatsapp: u.whatsapp || '',
                });
                if (u.avatar) {
                    setAvatarPreview(`${API_URL}${u.avatar}`);
                }
            } catch (err) {
                console.error(err);
                toast.error('Error al cargar perfil');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (avatarFile) {
            data.append('avatar', avatarFile);
        }

        try {
            const res = await axios.put(`${API_URL}/api/users/${user.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Perfil actualizado correctamente');

            // Update context with new user data
            // We reuse the login function to update state and localStorage
            const updatedUser = res.data;
            // Ensure we keep the token (it's not changed here, but 'login' expects it if we use it fully, 
            // or we can just update the user part if we modify AuthContext, 
            // but re-calling login(token, user) is safer if we have the token available or in localStorage)

            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                login(currentToken, updatedUser);
            }

        } catch (err) {
            console.error(err);
            toast.error('Error al actualizar perfil');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '4rem', display: 'flex', justifyContent: 'center' }}><Spinner /></div>;

    return (
        <div className="container" style={{ padding: '4rem 20px', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User /> Mi Perfil
            </h2>

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>

                {/* Avatar Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1rem' }}>
                        <div style={{
                            width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
                            border: '3px solid #eee', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={50} color="#ccc" />
                            )}
                        </div>
                        <label style={{
                            position: 'absolute', bottom: 0, right: 0, background: 'var(--primary-red)', color: 'white',
                            padding: '8px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}>
                            <Camera size={18} />
                            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                        </label>
                    </div>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Foto de perfil</p>
                </div>

                {/* Personal Info */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Información Personal</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nombre de Usuario</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nombre Completo</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Nombre y Apellido"
                            value={formData.fullName}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                {/* Contact Info */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Contacto</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ marginBottom: '0.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Mail size={16} /> Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ marginBottom: '0.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Phone size={16} /> WhatsApp
                        </label>
                        <input
                            type="text"
                            name="whatsapp"
                            placeholder="+54 9 11 ..."
                            value={formData.whatsapp}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                {/* Location */}
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Ubicación</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>País</label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Provincia</label>
                        <input
                            type="text"
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Localidad/Ciudad</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
                    {submitting ? <Spinner size={20} color="#fff" /> : <><Save size={20} /> Guardar Cambios</>}
                </button>

            </form>
        </div>
    );
};

export default EditProfile;
