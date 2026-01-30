import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 className="fade-in" style={{ fontSize: '3rem', color: 'var(--primary-red)', marginBottom: '1rem' }}>
                    Bienvenido a Kemazon.ar
                </h1>
                <p className="fade-in" style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--text-light)' }}>
                    Compra y vende productos con estilo minimalista.
                </p>
                <div className="fade-in" style={{ animationDelay: '0.2s' }}>
                    <Link to="/register" className="btn btn-primary" style={{ marginRight: '1rem' }}>Comenzar a vender</Link>
                    <Link to="/login" className="btn btn-outline">Ingresar</Link>
                </div>
            </div>

            <div>
                <h2 style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary-red)', paddingLeft: '10px', fontSize: '1.5rem', color: '#333' }}>
                    Productos Destacados
                </h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Cargando productos...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {products.length > 0 ? (
                            products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '8px' }}>
                                <p>No hay productos disponibles aún.</p>
                                <Link to="/create-product" style={{ color: 'var(--primary-red)', textDecoration: 'none', fontWeight: 'bold' }}>¡Sé el primero en vender!</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
