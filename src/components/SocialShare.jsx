import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

const SocialShare = ({ url, title }) => {

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        toast.success('Enlace copiado al portapapeles');
    };

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    };

    const shareOnLinkedin = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    };

    const shareOnWhatsApp = () => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '500', color: '#333' }}>Compartir</h4>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={shareOnFacebook}
                    style={{ background: '#1877f2', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    title="Compartir en Facebook"
                >
                    <Facebook size={18} />
                </button>
                <button
                    onClick={shareOnTwitter}
                    style={{ background: '#1da1f2', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    title="Compartir en Twitter"
                >
                    <Twitter size={18} />
                </button>
                <button
                    onClick={shareOnWhatsApp}
                    style={{ background: '#25d366', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    title="Compartir en WhatsApp"
                >
                    <Share2 size={18} />
                </button>
                <button
                    onClick={handleCopyLink}
                    style={{ background: '#eee', color: '#333', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    title="Copiar enlace"
                >
                    <LinkIcon size={18} />
                </button>
            </div>
        </div>
    );
};

export default SocialShare;
