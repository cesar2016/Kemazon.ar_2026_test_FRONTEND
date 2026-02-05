import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Truck, RotateCcw, MessageCircle, Send, Share2, ArrowLeft, Trophy, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from '../components/Spinner';
import API_URL from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import ArrangeWithSeller from '../components/ArrangeWithSeller';
import SocialShare from '../components/SocialShare';

const ProductDetail = () => {
    const { addToCart } = useContext(CartContext);
    const { idSlug } = useParams();
    const id = idSlug ? idSlug.split('-')[0] : null;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    // Gallery State
    const [showGallery, setShowGallery] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);

    const { user } = useContext(AuthContext);
    const [question, setQuestion] = useState('');
    const [questions, setQuestions] = useState([]);
    const [showArrangeModal, setShowArrangeModal] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/products/${id}`);
                setProduct(res.data);
                if (res.data.images && res.data.images.length > 0) {
                    setSelectedImage(res.data.images[0]);
                }

                // Fetch questions
                try {
                    const qRes = await axios.get(`${API_URL}/api/questions/product/${id}`);
                    setQuestions(qRes.data);
                } catch (qErr) {
                    console.error('Error fetching questions');
                }

            } catch (err) {
                console.error('Error fetching product:', err);
                toast.error('Error al cargar el producto');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Debes iniciar sesión para preguntar');
            return;
        }
        if (!question.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/api/questions`, {
                productId: product.id,
                question: question
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestions([res.data, ...questions]);
            setQuestion('');
            toast.success('Pregunta enviada');
        } catch (error) {
            toast.error('Error al enviar pregunta');
        }
    };

    // Gallery Logic
    const openGallery = () => {
        if (!product.images || product.images.length === 0) return;
        // Find index of currently selected image
        const idx = product.images.findIndex(img => img === selectedImage);
        setGalleryIndex(idx !== -1 ? idx : 0);
        setShowGallery(true);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setGalleryIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setGalleryIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const getImageSrc = (path) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `${API_URL}${path}`;
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
                <Spinner size={40} />
            </div>
        );
    }

    if (!product) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Producto no encontrado</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '1rem', color: '#666', textDecoration: 'none' }}>
                <ArrowLeft size={16} /> Volver al listado
            </Link>

            <div className="grid-responsive" style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Images Section */}
                <div style={{ display: 'flex', gap: '15px' }}>
                    {/* Thumbnails Column - Left side */}
                    {product.images && product.images.length > 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    onMouseEnter={() => setSelectedImage(img)}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        border: selectedImage === img ? '2px solid var(--primary-red)' : '1px solid #eee',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        flexShrink: 0
                                    }}
                                >
                                    <img
                                        src={getImageSrc(img)}
                                        alt={`Thumb ${index}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Main Image Container */}
                    <div
                        onClick={openGallery}
                        style={{
                            flex: 1,
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            height: '500px',
                            width: '100%',
                            backgroundColor: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            cursor: 'zoom-in'
                        }}
                    >
                        <img
                            src={selectedImage ? getImageSrc(selectedImage) : 'https://via.placeholder.com/500?text=No+Image'}
                            alt={product.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    </div>
                </div>

                {/* Info Section */}
                <div>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: '500' }}>{product.name}</h1>

                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: '300' }}>
                            $ {parseFloat(product.price).toLocaleString('es-AR')}
                        </span>
                        <p style={{ color: '#00a650', fontSize: '1rem', fontWeight: '500' }}>en 6 cuotas de ${(parseFloat(product.price) / 6).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                    </div>

                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00a650', fontWeight: '600', marginBottom: '1rem' }}>
                        Llega gratis mañana <Truck size={20} />
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', color: '#333' }}>
                        <RotateCcw size={20} color="#00a650" />
                        <span>Devolución gratis.</span>
                        <span style={{ color: '#999' }}>Tenés 30 días desde que lo recibís.</span>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                        {user?.id !== product.userId ? (
                            <>
                                <button className="btn btn-primary" onClick={() => addToCart(product)} style={{ width: '100%', padding: '1rem' }}>
                                    Agregar al carrito
                                </button>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => setShowArrangeModal(true)}
                                    style={{ width: '100%', padding: '1rem', borderColor: '#3483fa', color: '#3483fa', background: '#e1f5fe' }}
                                >
                                    Acordar con el vendedor
                                </button>
                            </>
                        ) : (
                            <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
                                Esta es tu publicación
                            </div>
                        )}
                    </div>
                    {/* Social Share Component */}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                        <SocialShare
                            url={window.location.href}
                            title={`¡Mirá este producto! ${product.name} a $${product.price}`}
                        />
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#666' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <ShieldCheck size={18} color="#666" />
                            <span>Compra Protegida</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Trophy size={18} color="#666" />
                            <span>MercadoPuntos</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description & Questions */}
            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Descripción</h3>
                    <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: '#666' }}>
                        {product.description || 'Sin descripción.'}
                    </p>
                </div>

                <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Preguntas</h3>

                    <form onSubmit={handleQuestionSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Escribí tu pregunta..."
                            className="form-control"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
                            Preguntar
                        </button>
                    </form>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {questions.length === 0 ? (
                            <p style={{ color: '#999', fontStyle: 'italic' }}>Nadie ha preguntado todavía.</p>
                        ) : (
                            questions.map(q => (
                                <div key={q.id}>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                                        <MessageCircle size={16} color="#999" />
                                        <p style={{ fontSize: '0.95rem', color: '#333' }}>{q.question}</p>
                                    </div>
                                    {q.answer && (
                                        <div style={{ display: 'flex', gap: '10px', paddingLeft: '26px', opacity: 0.8 }}>
                                            <div style={{ transform: 'scaleX(-1)' }}><MessageCircle size={16} color="#999" /></div>
                                            <p style={{ fontSize: '0.9rem', color: '#666' }}>{q.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Arrange With Seller Modal */}
            {showArrangeModal && (
                <ArrangeWithSeller
                    product={product}
                    seller={product.user}
                    onClose={() => setShowArrangeModal(false)}
                />
            )}

            {/* Full Screen Image Gallery Modal */}
            {showGallery && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        userSelect: 'none'
                    }}
                    onClick={() => setShowGallery(false)}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setShowGallery(false)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={32} />
                    </button>

                    {/* Counter */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        color: 'white',
                        fontSize: '1.2rem'
                    }}>
                        {galleryIndex + 1} / {product.images.length}
                    </div>

                    {/* Prev Button */}
                    <button
                        onClick={prevImage}
                        style={{
                            position: 'absolute',
                            left: '20px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        <ChevronLeft size={32} />
                    </button>

                    {/* Image */}
                    <img
                        src={getImageSrc(product.images[galleryIndex])}
                        alt={`Gallery ${galleryIndex}`}
                        onClick={(e) => e.stopPropagation()} // Prevent close on image click
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain',
                            boxShadow: '0 0 20px rgba(0,0,0,0.5)'
                        }}
                    />

                    {/* Next Button */}
                    <button
                        onClick={nextImage}
                        style={{
                            position: 'absolute',
                            right: '20px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        <ChevronRight size={32} />
                    </button>

                </div>
            )}
        </div>
    );
};

export default ProductDetail;
