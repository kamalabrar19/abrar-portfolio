import { motion } from 'framer-motion'
import styles from '../styles/Portfolio.module.css'

function ProjectCard({ project }) {
  return (
    <motion.article
      className={`${styles.projectCard} ${styles.easeSoft}`}
      style={{ minHeight: '320px', position: 'relative', overflow: 'visible' }}
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: '-50px' }}
      whileHover={{ 
        y: -6,
        scale: 1.01
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350 }}
    >
      <motion.div 
        className={styles.projectAccent}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.h3 
        className={styles.projectTitle}
        whileHover={{ color: '#dc2626' }}
      >
        {project.title}
      </motion.h3>
      <motion.p 
        className={styles.projectDesc}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {project.summary}
      </motion.p>
      <div className={styles.projectFooter}>
        <div className={styles.projectTags}>
          {project.tags.map((tag, i) => (
            <motion.span 
              key={tag}
              className={styles.projectTag}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: i * 0.05 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
        <motion.a 
          className={styles.primaryCta} 
          href="https://www.radiobudiluhur.com/" 
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ 
            scale: 1.02,
            y: -2
          }}
          whileTap={{ scale: 0.98 }}
        >
          Live Demo →
        </motion.a>
      </div>
    </motion.article>
  )
}

export default ProjectCard

