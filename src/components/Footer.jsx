const Footer = () => {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '2rem 0',
            marginTop: 'auto',
            color: 'var(--text-light)',
            borderTop: '1px solid #eee'
        }}>
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Kemazon.ar. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
