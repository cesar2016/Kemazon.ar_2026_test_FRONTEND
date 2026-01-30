import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Save, Upload, X, Image as ImageIcon, Star } from 'lucide-react';
import { toast } from 'sonner';
import Spinner from '../components/Spinner';
import API_URL from '../config/api';

const EditProduct = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: ''
    });

    // Unified items state: { id, type: 'existing' | 'new', url, file? }
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [priceDisplay, setPriceDisplay] = useState('');

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories first
                const catRes = await axios.get(`${API_URL}/api/categories`);
                setCategories(catRes.data);

                // Fetch product
                const res = await axios.get(`${API_URL}/api/products/${id}`);
                setFormData({
                    name: res.data.name,
                    description: res.data.description || '',
                    price: res.data.price,
                    categoryId: res.data.categoryId || ''
                });
                // Initial format
                setPriceDisplay(new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(res.data.price));

                const loadedItems = (res.data.images || []).map((img, i) => ({
                    id: `existing-${i}-${Date.now()}`,
                    type: 'existing',
                    url: `${API_URL}${img}`, // Full URL for display
                    serverPath: img // Path needed for backend
                }));
                setItems(loadedItems);

            } catch (err) {
                console.error('Error fetching data:', err);
                toast.error('Error al cargar datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handlePriceChange = (e) => {
        const val = e.target.value;
        if (/^[\d.,]*$/.test(val)) {
            setPriceDisplay(val);
        }
    };

    const handlePriceBlur = () => {
        if (priceDisplay) {
            let cleanVal = priceDisplay.replace(/\./g, '').replace(',', '.');
            const number = parseFloat(cleanVal);
            if (!isNaN(number)) {
                setPriceDisplay(new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number));
                setFormData(prev => ({ ...prev, price: number }));
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (items.length + files.length > 6) {
            toast.error('El total de imágenes no puede superar 6.');
            return;
        }

        const newItems = files.map((file, i) => ({
            id: `new-${i}-${Date.now()}`,
            type: 'new',
            url: URL.createObjectURL(file), // Preview URL
            file: file
        }));

        setItems([...items, ...newItems]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const makeCover = (index) => {
        if (index === 0) return;
        const newItems = [...items];
        const [movedItem] = newItems.splice(index, 1);
        newItems.unshift(movedItem);
        setItems(newItems);
        toast.success('Portada actualizada');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);

        const order = [];

        // We iterate through visual items to build logic order and append files in correct order
        items.forEach(item => {
            if (item.type === 'existing') {
                data.append('existingImages', item.serverPath);
                order.push({ type: 'existing', value: item.serverPath });
            } else {
                // New Item
                data.append('images', item.file); // Multer will read these in order
                order.push({ type: 'new' });
            }
        });

        data.append('imageOrder', JSON.stringify(order));
        data.append('categoryId', formData.categoryId);

        try {
            await axios.put(`${API_URL}/api/products/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Producto actualizado exitosamente');
            navigate('/my-products');
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Error al actualizar el producto');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <Spinner size={40} />
        </div>
    );

    return (
        <div className="container" style={{ padding: '4rem 20px', maxWidth: '800px' }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--primary-red)' }}>Editar Producto</h2>

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

                {/* Image Management */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Imágenes (Máx 6)</label>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
                        {items.map((item, index) => (
                            <div key={item.id} style={{
                                position: 'relative',
                                width: '100px',
                                height: '100px',
                                border: index === 0 ? '2px solid #ffd700' : '1px solid #eee',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <img src={item.url} alt="Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                                {index === 0 && (
                                    <div style={{ position: 'absolute', top: 0, left: 0, background: '#ffd700', color: '#000', fontSize: '10px', padding: '2px 4px', fontWeight: 'bold' }}>
                                        Portada
                                    </div>
                                )}

                                <div style={{ position: 'absolute', top: 2, right: 2, display: 'flex', gap: '2px' }}>
                                    {index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => makeCover(index)}
                                            style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                            title="Hacer Portada"
                                        >
                                            <Star size={12} fill="white" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        style={{ background: 'rgba(255,0,0,0.7)', color: 'white', border: 'none', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Upload Button */}
                        {items.length < 6 && (
                            <label style={{ width: '100px', height: '100px', border: '2px dashed #ccc', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#999' }}>
                                <Upload size={24} />
                                <span style={{ fontSize: '0.8rem' }}>Agregar</span>
                                <input type="file" multiple accept="image/*" onChange={handleNewImageChange} style={{ display: 'none' }} />
                            </label>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn btn-primary" disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {submitting ? <Spinner size={20} color="#fff" /> : <><Save size={20} /> Guardar Cambios</>}
                    </button>
                    <button type="button" onClick={() => navigate('/my-products')} className="btn btn-outline">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
