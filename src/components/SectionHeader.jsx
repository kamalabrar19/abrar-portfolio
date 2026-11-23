import { motion } from 'framer-motion'
import styles from '../styles/Portfolio.module.css'

function SectionHeader({ eyebrow, title, description }) {
  return (
    <motion.div 
      className={styles.sectionHeader}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.span 
        className={styles.eyebrow}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: 'backOut' }}
        viewport={{ once: true }}
      >
        {eyebrow}
      </motion.span>
      <motion.h2 
        className={styles.sectionTitle}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -4, scale: 1.02 }}
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p 
          className={styles.sectionCopy}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  )
}

export default SectionHeader

