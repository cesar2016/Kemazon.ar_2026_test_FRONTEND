import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const ArrangeWithSeller = ({ product }) => {
    return (
        <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', background: '#f9f9f9' }}>
            <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Otras opciones de pago:</p>
            <button
                onClick={() => {
                    // Redirect to chat or show info
                    // For now, simpler: Scroll to questions or open WhatsApp if available
                    if (product.user && product.user.whatsapp) {
                        const text = `Hola, estoy interesado en tu producto "${product.name}". ¿Cómo podemos acordar el pago?`;
                        window.open(`https://api.whatsapp.com/send?phone=${product.user.whatsapp}&text=${encodeURIComponent(text)}`, '_blank');
                    } else {
                        toast.info('Puedes contactar al vendedor en la sección de preguntas.');
                    }
                }}
                className="btn btn-outline"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
                <MessageCircle size={18} />
                Acordar con el vendedor
            </button>
        </div>
    );
};

export default ArrangeWithSeller;
