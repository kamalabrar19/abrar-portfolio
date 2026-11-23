import { motion } from 'framer-motion'
import styles from '../styles/Portfolio.module.css'

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3
    }
  }
}

const listItemVariants = {
  hidden: { opacity: 0, x: 20, scaleY: 0.8 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scaleY: 1,
    transition: { type: 'spring', bounce: 0.3 }
  }
}

const socialVariants = {
  hover: {
    scale: 1.08,
    y: -3,
    boxShadow: '0 10px 30px rgba(220,38,38,0.5)',
    transition: { type: 'spring' }
  }
}

function ContactCard() {
  return (
    <motion.div
      className={styles.contactSplit}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
    >
      <div className={styles.contactCardMain}>
        <motion.span 
          className={styles.heroBadge}
          initial={{ rotateX: 90 }}
          animate={{ rotateX: 0 }}
          transition={{ duration: 0.6 }}
        >
          C O N T A C T
        </motion.span>
        <motion.h3 
          className={styles.contentTitle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          ABOUT ME
        </motion.h3>
        <motion.a 
          className={styles.contactButton} 
          href="mailto:kamalabrar19@gmail.com"
          whileHover={{ 
            scale: 1.05, 
            y: -4,
            boxShadow: '0 20px 50px rgba(220,38,38,0.6)'
          }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          Get In Touch
        </motion.a>
      </div>

      <div className={styles.contactDetails}>
        <motion.ul 
          className={styles.contactList}
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.li className={styles.contactItem} variants={listItemVariants}>
            <strong>Phone:</strong>
            <span>081287115319</span>
          </motion.li>
          <motion.li className={styles.contactItem} variants={listItemVariants}>
            <strong>Email:</strong>
            <span>kamalabrar19@gmail.com</span>
          </motion.li>
          <motion.li className={styles.contactItem} variants={listItemVariants}>
            <strong>Location:</strong>
            <span>Tangerang Selatan, Indonesia</span>
          </motion.li>
        </motion.ul>
        <div className={styles.socialRow}>
          <motion.a 
            className={`${styles.socialLink} ${styles.socialWhatsapp}`} 
            href="https://wa.me/6281287115319" 
            target="_blank" 
            rel="noreferrer"
            variants={socialVariants}
            whileHover="hover"
          >
            WhatsApp
          </motion.a>
          <motion.a 
            className={`${styles.socialLink} ${styles.socialGithub}`} 
            href="https://github.com/kamalabrar19" 
            target="_blank" 
            rel="noreferrer"
            variants={socialVariants}
            whileHover="hover"
          >
            GitHub
          </motion.a>
          <motion.a 
            className={`${styles.socialLink} ${styles.socialLinkedin}`} 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noreferrer"
            variants={socialVariants}
            whileHover="hover"
          >
            LinkedIn
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactCard

