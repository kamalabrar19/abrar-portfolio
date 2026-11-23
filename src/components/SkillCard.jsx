import { motion } from 'framer-motion'
import styles from '../styles/Portfolio.module.css'

function SkillCard({ skill }) {
  return (
    <motion.article
      className={`${styles.skillCard} ${styles.easeSoft}`}
      style={{ minHeight: '250px' }}
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, margin: '-50px' }}
      whileHover={{ 
        y: -6, 
        scale: 1.02,
        rotateX: 2,
        rotateY: 1,
        filter: 'drop-shadow(0 10px 20px rgba(220,38,38,0.3))'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 20 
      }}
    >
      <motion.h3 
        className={styles.skillTitle}
        whileHover={{ color: '#dc2626' }}
      >
        {skill.name}
      </motion.h3>
      <motion.p 
        className={styles.skillDetail}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {skill.detail}
      </motion.p>
    </motion.article>
  )
}

export default SkillCard

