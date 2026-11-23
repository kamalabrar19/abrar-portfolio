import { motion } from 'framer-motion'
import styles from '../styles/Portfolio.module.css'

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const listItemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 400 }
  }
}

const photoVariants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    boxShadow: '0 0 50px rgba(220,38,38,0.7)',
    transition: { type: 'spring', stiffness: 300 }
  }
}

const aboutText = `Saya mahasiswa Sistem Informasi dengan kemampuan komunikasi yang kuat dan minat besar pada stand-up comedy dan programming. Dengan kemampuan adaptasi dan interaksi yang efektif, saya dapat membangun hubungan baik dan mengkomunikasikan ide dengan jelas dan menarik. Saya percaya bahwa kreativitas dalam komunikasi dapat meningkatkan kinerja tim dan menghasilkan solusi inovatif.

I am an Information Systems student with strong communication skills and a great interest in stand-up comedy and programming. With the ability to adapt and interact effectively, I can build good relationships and communicate ideas clearly and engagingly. I believe that creativity in communication can enhance team performance and lead to innovative solutions.`;

function AboutCard() {
  return (
    <motion.div
      className={styles.aboutGrid}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.aboutText}>
        <motion.span 
          className={styles.heroBadge}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
        >
          Tentang Saya
        </motion.span>
        <motion.h3 
          className={styles.contentTitle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          ABRAR KAMAL
        </motion.h3>
        <motion.p 
          className={styles.contentText}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ whiteSpace: 'pre-line' }}
        >
          {aboutText}
        </motion.p>
      </div>

      <motion.div 
        className={styles.profileCard}
        whileHover="hover"
      >
        <motion.div 
          className={styles.profilePhoto}
          variants={photoVariants}
          whileHover="hover"
        >
          AK
        </motion.div>
        <div className={styles.profileInfo}>
          <p className={styles.profileName}>ABRAR KAMAL</p>
          <p className={styles.profileTitle}>Information Systems Universitas Pembangunan Jaya</p>
          <p className={styles.profileMeta}>Tangerang Selatan, Indonesia</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AboutCard

