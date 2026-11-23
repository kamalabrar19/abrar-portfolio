import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from '../styles/Portfolio.module.css'
import CertificateCard from './CertificateCard'

const certificates = [
  { id: 1, title: 'Certificate 1', image: '/cert-1.png' },
  { id: 2, title: 'Certificate 2', image: '/cert-2.png' },
  { id: 3, title: 'Certificate 3', image: '/cert-3.png' },
  { id: 4, title: 'Certificate 4', image: '/cert-4.png' },
  { id: 5, title: 'Certificate 5', image: '/cert-5.png' },
  { id: 6, title: 'Certificate 6', image: '/cert-6.png' },
];

function CertificateGallery() {
  const [selectedCert, setSelectedCert] = useState(null);

  const openCert = (cert) => setSelectedCert(cert);
  const closeCert = () => setSelectedCert(null);

  return (
    <>
      <div className={styles.certGrid}>
        {certificates.map((cert) => (
          <CertificateCard key={cert.id} cert={cert} onClick={openCert} />
        ))}
      </div>
      
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            className={styles.certModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCert}
          >
            <motion.img 
              src={selectedCert.image}
              alt={selectedCert.title}
              initial={{ scale: 0.8, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: -90 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <motion.h3>{selectedCert.title}</motion.h3>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CertificateGallery;

