import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import API_URL from '../config/api';
import Spinner from '../components/Spinner';

const CreateProduct = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: ''
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/categories`);
                setCategories(res.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                toast.error('Error al cargar categorías');
            }
        };
        fetchCategories();
    }, []);

    const [priceDisplay, setPriceDisplay] = useState('');

    const formatPrice = (value) => {
        if (!value) return '';
        // Convert to float first to handle potential existing decimals
        const number = parseFloat(value.toString().replace(/\./g, '').replace(',', '.'));
        if (isNaN(number)) return '';
        // Format: German/Argentine style (dots for thousands, comma for decimals)
        return new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
    };

    const handlePriceChange = (e) => {
        // Allow digits, one comma
        const val = e.target.value;
        if (/^[\d.,]*$/.test(val)) {
            setPriceDisplay(val);
        }
    };

    const handlePriceBlur = () => {
        if (priceDisplay) {
            // Normalize: dots are separators, comma is decimal
            // If user types "1000", become "1.000,00"
            // If user types "1000.50" (wrong format but common), handle it?
            // Let's assume user types naturally. If they paste, we clean.
            // Simple clean: remove dots, replace comma with dot.
            let cleanVal = priceDisplay.replace(/\./g, '').replace(',', '.');
            const number = parseFloat(cleanVal);
            if (!isNaN(number)) {
                setPriceDisplay(new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number));
                setFormData({ ...formData, price: number });
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (images.length + files.length > 6) {
            toast.error('Solo puedes subir hasta 6 imágenes por producto.');
            return;
        }

        setImages([...images, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviews(newPreviews);
    };

    const makeCover = (index) => {
        if (index === 0) return;

        const newImages = [...images];
        const newPreviews = [...previews];

        // Move to front
        const [movedImage] = newImages.splice(index, 1);
        newImages.unshift(movedImage);

        const [movedPreview] = newPreviews.splice(index, 1);
        newPreviews.unshift(movedPreview);

        setImages(newImages);
        setPreviews(newPreviews);
        toast.success('Portada actualizada');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            // Ensure price is sent as number
            data.append('price', formData.price);
            data.append('categoryId', formData.categoryId);
            data.append('userId', user.id);

            images.forEach((image) => {
                data.append('images', image);
            });

            await axios.post(`${API_URL}/api/products`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('¡Producto publicado exitosamente!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Error al crear el producto. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '4rem 20px', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--primary-red)' }}>Nuevo Producto</h2>

            <form onSubmit={handleSubmit} style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                {/* Basic Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nombre del Producto</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Precio ($)</label>
                        <input
                            type="text"
                            name="price"
                            value={priceDisplay}
                            onChange={handlePriceChange}
                            onBlur={handlePriceBlur}
                            required
                            placeholder="0,00"
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Categoría</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: 'white' }}
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Descripción</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                    ></textarea>
                </div>

                {/* Image Upload */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Imágenes (Máx 6)</label>
                    <div style={{ border: '2px dashed #ddd', padding: '2rem', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', position: 'relative', marginBottom: '1rem' }}>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                        <Upload size={40} color="#999" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: '#666' }}>Arrastra tus imágenes aquí o haz clic para seleccionar</p>
                    </div>

                    {/* Previews */}
                    {previews.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
                            {previews.map((src, index) => (
                                <div key={index} style={{
                                    position: 'relative',
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    border: index === 0 ? '2px solid #ffd700' : '1px solid #eee'
                                }}>
                                    <img src={src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                                    {/* Cover Badge */}
                                    {index === 0 && (
                                        <div style={{ position: 'absolute', top: 0, left: 0, background: '#ffd700', color: '#000', fontSize: '10px', padding: '2px 4px', fontWeight: 'bold' }}>
                                            Portada
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div style={{ position: 'absolute', top: 2, right: 2, display: 'flex', gap: '2px' }}>
                                        {index !== 0 && (
                                            <button
                                                type="button"
                                                onClick={() => makeCover(index)}
                                                title="Hacer Portada"
                                                style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                            >
                                                <Star size={12} fill="white" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            style={{ background: 'rgba(255,0,0,0.7)', color: 'white', border: 'none', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {loading ? <Spinner size={20} color="#fff" /> : <><ImageIcon size={20} /> Crear Producto</>}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-outline">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProduct;
