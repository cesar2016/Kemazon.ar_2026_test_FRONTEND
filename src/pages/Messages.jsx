import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { MessageSquare, HelpCircle, CornerDownRight, CheckCircle } from 'lucide-react';
import Spinner from '../components/Spinner';

const Messages = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('received'); // 'received' | 'asked'
    const [receivedQuestions, setReceivedQuestions] = useState([]);
    const [askedQuestions, setAskedQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Reply state
    const [replyingId, setReplyingId] = useState(null);
    const [replyText, setReplyText] = useState('');

    const fetchReceived = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/questions/user/received`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReceivedQuestions(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAsked = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/questions/user/asked`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAskedQuestions(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReply = async (questionId) => {
        if (!replyText.trim()) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/questions/${questionId}/answer`, {
                answer: replyText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            setReceivedQuestions(prev => prev.map(q =>
                q.id === questionId ? { ...q, answer: replyText } : q
            ));

            setReplyText('');
            setReplyingId(null);
        } catch (error) {
            console.error('Error answering:', error);
            alert('Error al enviar respuesta');
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchReceived(), fetchAsked()]).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}><Spinner /></div>;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ marginBottom: '2rem', color: 'var(--primary-red)' }}>Preguntas y Respuestas</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('received')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'received' ? '2px solid var(--primary-red)' : 'none',
                        color: activeTab === 'received' ? 'var(--primary-red)' : '#666',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        flex: 1
                    }}
                >
                    Preguntas Recibidas
                </button>
                <button
                    onClick={() => setActiveTab('asked')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'asked' ? '2px solid var(--primary-red)' : 'none',
                        color: activeTab === 'asked' ? 'var(--primary-red)' : '#666',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        flex: 1
                    }}
                >
                    Mis Preguntas
                </button>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* --- RECEIVED QUESTIONS (SELLER VIEW) --- */}
                {activeTab === 'received' && (
                    receivedQuestions.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>No tienes preguntas pendientes en tus productos.</p>
                    ) : (
                        receivedQuestions.map(q => (
                            <div key={q.id} style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid #eee' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <img
                                        src={q.product.images[0] ? `${API_URL}${q.product.images[0]}` : 'https://via.placeholder.com/60'}
                                        alt={q.product.name}
                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                    <div>
                                        <h3 style={{ fontSize: '1rem', margin: '0 0 5px 0' }}>{q.product.name}</h3>
                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>Pregunta de <strong>{q.user.username}</strong> - {format(new Date(q.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <MessageSquare size={20} color="#666" style={{ marginTop: '2px' }} />
                                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>{q.content}</p>
                                </div>

                                {q.answer ? (
                                    <div style={{ marginTop: '1rem', marginLeft: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                            <CornerDownRight size={16} color="#4caf50" />
                                            <span style={{ fontWeight: 'bold', color: '#4caf50' }}>Tu respuesta:</span>
                                        </div>
                                        <p style={{ margin: 0 }}>{q.answer}</p>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '1rem', marginLeft: '2rem' }}>
                                        {replyingId === q.id ? (
                                            <div>
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Escribe tu respuesta..."
                                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '80px', marginBottom: '10px' }}
                                                />
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => handleReply(q.id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Responder</button>
                                                    <button onClick={() => setReplyingId(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#666' }}>Cancelar</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setReplyingId(q.id)}
                                                style={{ color: '#009ee3', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}
                                            >
                                                Responder
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )
                )}

                {/* --- ASKED QUESTIONS (BUYER VIEW) --- */}
                {activeTab === 'asked' && (
                    askedQuestions.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>No has realizado preguntas.</p>
                    ) : (
                        askedQuestions.map(q => (
                            <div key={q.id} style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', border: '1px solid #eee' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                    <img
                                        src={q.product.images[0] ? `${API_URL}${q.product.images[0]}` : 'https://via.placeholder.com/60'}
                                        alt={q.product.name}
                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                    <div>
                                        <h3 style={{ fontSize: '1rem', margin: '0 0 5px 0' }}>{q.product.name}</h3>
                                        <span style={{ fontSize: '0.8rem', color: '#999' }}>Preguntaste el {format(new Date(q.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <HelpCircle size={20} color="#666" style={{ marginTop: '2px' }} />
                                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>{q.content}</p>
                                </div>

                                {q.answer ? (
                                    <div style={{ marginTop: '1rem', marginLeft: '2rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                                            <CheckCircle size={16} color="#4caf50" />
                                            <span style={{ fontWeight: 'bold', color: '#4caf50' }}>Respuesta del vendedor:</span>
                                        </div>
                                        <p style={{ margin: 0 }}>{q.answer}</p>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '1rem', marginLeft: '2rem', color: '#999', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                        Esperando respuesta...
                                    </div>
                                )}
                            </div>
                        ))
                    )
                )}

            </div>
        </div>
    );
};

export default Messages;
