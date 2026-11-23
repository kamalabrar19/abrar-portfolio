import { useEffect, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import styles from '../styles/Portfolio.module.css'

const charVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
}

const orbVariants = {
  animate: {
    y: [-20, 20, -20],
    rotate: [0, 180, 360],
    transition: {
      y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
      rotate: { duration: 8, repeat: Infinity }
    }
  }
}

function HeroCard({ phrases }) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayedPhrase, setDisplayedPhrase] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const controls = useAnimationControls()

  useEffect(() => {
    const phrase = phrases[phraseIndex]
    setCharIndex(0)
    setDisplayedPhrase('')

    const timer = setInterval(() => {
      if (charIndex < phrase.length) {
        setDisplayedPhrase(prev => prev + phrase[charIndex])
        setCharIndex(prev => prev + 1)
      } else {
        clearInterval(timer)
        setTimeout(() => {
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
        }, 2000)
      }
    }, 80)

    return () => clearInterval(timer)
  }, [phraseIndex, phrases.length, charIndex])

  useEffect(() => {
    controls.start('visible')
  }, [])

  return (
    <motion.section 
      className={styles.heroSection} 
      id="top"
      initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)' }}
      animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* Floating Orbs */}
      <motion.div 
        className={styles.floatingOrb}
        style={{ top: '20%', right: '20%', width: 120, height: 120 }}
        variants={orbVariants}
        animate="animate"
      />
      <motion.div 
        className={styles.floatingOrb}
        style={{ bottom: '30%', left: '15%', width: 80, height: 80 }}
        variants={orbVariants}
        animate="animate"
        transition={{ delay: 0.5 }}
      />
      <motion.div 
        className={styles.floatingOrb}
        style={{ top: '60%', right: '10%', width: 60, height: 60 }}
        variants={orbVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />

      <div className={styles.heroAccent} />
      
      <motion.div 
        className={styles.heroCard}
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { delay: 0.8, duration: 0.8 }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          className={styles.heroBadge}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          whileHover={{ scale: 1.05, filter: 'drop-shadow(0 4px 8px rgba(220,38,38,0.4))' }}
        >
          The Introduction
        </motion.span>

        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          whileHover={{ y: -8, scale: 1.02 }}
        >
          Kamal Abrar — your most favorite bro!
        </motion.h1>

        <motion.p
          className={styles.heroText}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          I build high-contrast developer portfolios and motion-led digital experiences inspired by cinematic posters.
        </motion.p>

        <motion.div
          className={styles.heroReveal}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.8 }}
        >
          <span className={styles.typeLabel}>Story line</span>
          <motion.strong
            animate={controls}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.1
                }
              }
            }}
          >
            {displayedPhrase.split('').map((char, i) => (
              <motion.span 
                key={i}
                variants={charVariants}
                style={{ display: 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
            <span className={styles.cursor}>|</span>
          </motion.strong>
        </motion.div>

        <motion.div
          className={styles.heroButtons}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.2 }}
        >
          <motion.a 
            className={styles.primaryCta} 
            href="#projects"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 20px 40px rgba(220,38,38,0.6)',
              y: -4 
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            Explore Missions
          </motion.a>
          <motion.a 
            className={styles.secondaryCta} 
            href="#contact"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring' }}
          >
            Start the Mission
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default HeroCard

