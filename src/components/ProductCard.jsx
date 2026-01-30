import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import API_URL from '../config/api';

const ProductCard = ({ product }) => {
    const imageUrl = product.images && product.images.length > 0
        ? `${API_URL}${product.images[0]}`
        : 'https://via.placeholder.com/300?text=No+Image';

    return (
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                transition: 'transform 0.2s',
                textAlign: 'left',
                cursor: 'pointer',
                border: '1px solid #eee'
            }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
                <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                    <img
                        src={imageUrl}
                        alt={product.name}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            padding: '10px'
                        }}
                    />
                </div>
                <div style={{ padding: '15px' }}>
                    <h3 style={{
                        fontSize: '1rem',
                        fontWeight: '400',
                        color: '#333',
                        marginBottom: '10px',
                        height: '48px',
                        lineHeight: '1.5',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {product.name}
                    </h3>

                    <p style={{ fontSize: '1.5rem', fontWeight: '300', marginBottom: '5px' }}>
                        $ {parseFloat(product.price).toLocaleString('es-AR')}
                    </p>

                    <p style={{ fontSize: '0.9rem', color: '#00a650', fontWeight: '500', marginBottom: '5px' }}>
                        Mismo precio en 6 cuotas
                    </p>

                    <p style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#00a650',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        background: '#e6f7ee',
                        width: 'fit-content',
                        padding: '2px 6px',
                        borderRadius: '4px'
                    }}>
                        Llega gratis mañana <Truck size={14} />
                    </p>

                    <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '10px' }}>
                        Por {product.user?.username || 'Vendedor'}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
