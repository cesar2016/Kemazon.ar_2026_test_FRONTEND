import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Truck, RotateCcw, MessageCircle, Send, Share2, ArrowLeft, Trophy } from 'lucide-react';
import Spinner from '../components/Spinner';
import API_URL from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'sonner';
import ArrangeWithSeller from '../components/ArrangeWithSeller';

const ProductDetail = () => {
    const { addToCart } = useContext(CartContext);
    const { idSlug } = useParams();
    const id = idSlug ? idSlug.split('-')[0] : null;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/products/${id}`);
                setProduct(res.data);
                if (res.data.images && res.data.images.length > 0) {
                    setSelectedImage(res.data.images[0]);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

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
                                        src={`${API_URL}${img}`}
                                        alt={`Thumb ${index}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Main Image Container */}
                    <div style={{
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
                        position: 'relative'
                    }}>
                        <img
                            src={selectedImage ? `${API_URL}${selectedImage}` : 'https://via.placeholder.com/500?text=No+Image'}
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
                        <Truck size={20} /> Llega gratis mañana
                    </p>

                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        <ShieldCheck size={16} color="#00a650" />
                        Compra Protegida
                    </p>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        <Trophy size={16} color="#00a650" />
                        MercadoPuntos
                    </p>

                    {/* Payment Options */}
                    {product.user?.paymentMethods?.some(pm => pm.provider === 'MERCADOPAGO') ? (
                        <button
                            onClick={async () => {
                                if (!user) {
                                    toast.error('Inicia sesión para comprar');
                                    return;
                                }
                                try {
                                    const token = localStorage.getItem('token');
                                    const res = await axios.post(`${API_URL}/api/payment/create_preference`, {
                                        productId: product.id,
                                        title: product.name,
                                        price: product.price,
                                        quantity: 1,
                                        picture_url: product.images && product.images.length > 0 ? `${API_URL}${product.images[0]}` : ''
                                    }, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    window.location.href = res.data.init_point;
                                } catch (error) {
                                    console.error(error);
                                    if (error.response && error.response.status === 400) {
                                        toast.error(error.response.data.msg || 'Error al iniciar el pago');
                                    } else {
                                        toast.error('Error al iniciar el pago');
                                    }
                                }
                            }}
                            className="btn btn-primary"
                            style={{ width: '100%', marginBottom: '1rem', padding: '1rem', backgroundColor: '#009ee3', borderColor: '#009ee3' }}
                        >
                            Comprar con MercadoPago
                        </button>
                    ) : null}

                    <button
                        onClick={() => addToCart(product)}
                        className="btn btn-outline"
                        style={{ width: '100%', padding: '1rem', background: '#e6f7ee', border: 'none', color: '#00a650', marginBottom: '1rem' }}
                    >
                        Agregar al carrito
                    </button>

                    <ArrangeWithSeller product={product} />

                    {/* Social Share */}
                    <div style={{ marginTop: '2rem' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '10px', color: '#666' }}>Compartir con amigos:</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* WhatsApp */}
                            <button
                                onClick={() => {
                                    const shareUrl = `${API_URL}/social/share/${id}`;
                                    const text = `¡Mira este producto en Kemazon! ${shareUrl}`;
                                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                                }}
                                title="Compartir en WhatsApp"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#25D366', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </button>

                            {/* Facebook */}
                            <button
                                onClick={() => {
                                    const shareUrl = `${API_URL}/social/share/${id}`;
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
                                }}
                                title="Compartir en Facebook"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#1877F2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </button>

                            {/* Instagram (Copy Link) */}
                            <button
                                onClick={() => {
                                    const shareUrl = `${API_URL}/social/share/${id}`;
                                    navigator.clipboard.writeText(shareUrl);
                                    toast.success('Enlace viral copiado para Instagram');
                                    window.open('https://instagram.com', '_blank');
                                }}
                                title="Copiar enlace para Instagram"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </button>

                            {/* TikTok (Copy Link) */}
                            <button
                                onClick={() => {
                                    const shareUrl = `${API_URL}/social/share/${id}`;
                                    navigator.clipboard.writeText(shareUrl);
                                    toast.success('Enlace viral copiado para TikTok');
                                    window.open('https://tiktok.com', '_blank');
                                }}
                                title="Copiar enlace para TikTok"
                                style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#000000', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                            </button>
                        </div>
                    </div>

                    <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '2rem' }}>Vendido por: <strong>{product.user?.username || 'Vendedor'}</strong></p>
                </div>
            </div>

            {/* Full Width Sections */}
            <div style={{ marginTop: '3rem', background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Descripción</h3>
                <p style={{ color: '#666', whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '1.1rem' }}>
                    {product.description || 'Sin descripción.'}
                </p>

                <hr style={{ margin: '3rem 0', border: 'none', borderTop: '1px solid #eee' }} />

                <QuestionsSection productId={id} productUserId={product.userId} />
            </div>
        </div>
    );
};

// Sub-component for Questions to keep main component cleaner
const QuestionsSection = ({ productId, productUserId }) => {
    const { user } = useContext(AuthContext); // Import AuthContext at top level if needed, or pass user prop
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [answerText, setAnswerText] = useState('');
    const [answeringId, setAnsweringId] = useState(null);

    // Refresh questions
    const fetchQuestions = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/questions/${productId}`);
            setQuestions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [productId]);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!newQuestion.trim()) return;
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Debes iniciar sesión para preguntar');
            return;
        }

        try {
            await axios.post(`${API_URL}/api/questions`, {
                productId,
                content: newQuestion
            }, {
                headers: {
                    'x-auth-token': token
                }
            });
            setNewQuestion('');
            toast.success('Pregunta enviada');
            fetchQuestions();
        } catch (err) {
            toast.error('Error al enviar pregunta');
        }
    };

    const handleAnswer = async (questionId) => {
        if (!answerText.trim()) return;
        const token = localStorage.getItem('token');

        try {
            await axios.put(`${API_URL}/api/questions/${questionId}/answer`, {
                answer: answerText
            }, {
                headers: {
                    'x-auth-token': token
                }
            });
            setAnswerText('');
            setAnsweringId(null);
            toast.success('Respuesta enviada');
            fetchQuestions();
        } catch (err) {
            toast.error('Error al responder');
        }
    };

    const isOwner = user && user.id === productUserId;

    return (
        <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Preguntas y respuestas</h3>

            {/* Ask Form */}
            {user && !isOwner && (
                <form onSubmit={handleAsk} style={{ marginBottom: '2rem', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Escribe una pregunta..."
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>Preguntar</button>
                </form>
            )}

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {questions.map((q) => (
                    <div key={q.id}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{q.content}</span>
                        </div>

                        {q.answer ? (
                            <div style={{ marginLeft: '1rem', marginTop: '5px', color: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ccc' }}></div>
                                <span style={{ fontSize: '0.9rem' }}>{q.answer}</span>
                                {/* <span style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(q.createdAt).toLocaleDateString()}</span> */}
                            </div>
                        ) : (
                            isOwner && (
                                <div style={{ marginTop: '10px', marginLeft: '1rem' }}>
                                    {answeringId === q.id ? (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input
                                                type="text"
                                                autoFocus
                                                placeholder="Escribe tu respuesta..."
                                                value={answerText}
                                                onChange={(e) => setAnswerText(e.target.value)}
                                                style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                            />
                                            <button onClick={() => handleAnswer(q.id)} className="btn btn-primary" style={{ padding: '0 15px', fontSize: '0.9rem' }}>Enviar</button>
                                            <button onClick={() => setAnsweringId(null)} style={{ border: 'none', background: 'transparent', color: '#666', cursor: 'pointer' }}>Cancelar</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setAnsweringId(q.id)} style={{ color: '#00a650', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}>
                                            Responder
                                        </button>
                                    )}
                                </div>
                            )
                        )}
                        <div style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '4px', marginLeft: '1rem' }}>
                            Usuario: {q.user.username}
                        </div>
                    </div>
                ))}
                {questions.length === 0 && <p style={{ color: '#999', fontStyle: 'italic' }}>Nadie ha preguntado todavía. ¡Sé el primero!</p>}
            </div>
        </div>
    );
};

export default ProductDetail;
