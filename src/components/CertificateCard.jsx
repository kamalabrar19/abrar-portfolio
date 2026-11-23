import { motion } from 'framer-motion'
import styles from '../styles/Portfolio.module.css'

const certificates = [
  { id: 1, title: 'Certificate 1', image: '/cert-1.png' },
  { id: 2, title: 'Certificate 2', image: '/cert-2.png' },
  { id: 3, title: 'Certificate 3', image: '/cert-3.png' },
  { id: 4, title: 'Certificate 4', image: '/cert-4.png' },
  { id: 5, title: 'Certificate 5', image: '/cert-5.png' },
  { id: 6, title: 'Certificate 6', image: '/cert-6.png' },
];

function CertificateCard({ cert, onClick }) {
  return (
    <motion.div 
      className={styles.certCard}
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        boxShadow: '0 20px 40px rgba(220,38,38,0.3)'
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(cert)}
    >
      <img src={cert.image} alt={cert.title} />
      <h4>{cert.title}</h4>
    </motion.div>
  );
}

export default CertificateCard;

