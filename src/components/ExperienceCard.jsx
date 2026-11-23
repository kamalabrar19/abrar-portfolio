import { motion } from 'framer-motion'
import styles from '../styles/Portfolio.module.css'

const containerVariants = {
  visible: {
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1 
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: 30, rotateY: 10 },
  visible: { 
    opacity: 1, 
    x: 0,
    rotateY: 0,
    transition: { type: 'spring', stiffness: 350 }
  }
}

function ExperienceCard({ item }) {
  return (
    <motion.article
      className={styles.timelineItem}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-100px' }}
    >
      <motion.span 
        className={styles.timelineMarker}
        variants={itemVariants}
        whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 10px #dc2626)' }}
      >
        {item.date}
      </motion.span>
      <motion.h3 
        className={styles.timelineRole}
        variants={itemVariants}
        whileHover={{ color: '#dc2626', scale: 1.02 }}
      >
        {item.title}
      </motion.h3>
      <motion.p 
        className={styles.timelineCompany}
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
      >
        {item.company}
      </motion.p>
      <motion.p 
        className={styles.timelineCopy}
        variants={itemVariants}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {item.details}
      </motion.p>
    </motion.article>
  )
}

export default ExperienceCard

