import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/Portfolio.module.css'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Portfolio', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

const hamburgerVariants = {
  closed: {
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.2 }
  },
  open: {
    opacity: 1,
    rotate: 90,
    transition: { duration: 0.2 }
  }
}

const lineTopVariants = {
  closed: {
    rotate: 0,
    translateY: 0,
    transition: { duration: 0.2 }
  },
  open: {
    rotate: 45,
    translateY: 6,
    transition: { duration: 0.2 }
  }
}

const lineMiddleVariants = {
  closed: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.2 }
  },
  open: {
    opacity: 0,
    scaleX: 0,
    transition: { duration: 0.2 }
  }
}

const lineBottomVariants = {
  closed: {
    rotate: 0,
    translateY: 0,
    transition: { duration: 0.2 }
  },
  open: {
    rotate: -45,
    translateY: -6,
    transition: { duration: 0.2 }
  }
}

const navVariants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  },
  open: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, type: 'spring', bounce: 0.25 }
  }
}

function Navbar({ darkMode, onToggle }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.header 
      className={styles.navbar}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.a 
        className={styles.brand} 
        href="#top"
        whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
        transition={{ duration: 0.3 }}
      >
        <span className={styles.brandCore}>ABRAR KAMAL</span>
      </motion.a>

      <motion.button
        className={styles.hamburger}
        variants={hamburgerVariants}
        animate={menuOpen ? 'open' : 'closed'}
        type="button"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <motion.span variants={lineTopVariants} />
        <motion.span variants={lineMiddleVariants} />
        <motion.span variants={lineBottomVariants} />
      </motion.button>

      <motion.nav 
        className={`${styles.navLinks} ${menuOpen ? styles.openMenu : ''}`}
        variants={navVariants}
        animate={menuOpen ? 'open' : 'closed'}
        initial={false}
      >
        <motion.ul 
          className={styles.navList}
          variants={{
            closed: { opacity: 0 },
            open: { 
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 }
            }
          }}
          initial="closed"
          animate={menuOpen ? 'open' : 'closed'}
        >
          {links.map((link, i) => (
            <motion.li 
              key={link.href}
              variants={{
                closed: { opacity: 0, x: 20 },
                open: { 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: i * 0.05 }
                }
              }}
            >
              <motion.a 
                className={styles.navLink} 
                href={link.href} 
                onClick={() => setMenuOpen(false)}
                whileHover={{ scale: 1.1, color: '#dc2626' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {link.label}
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>
        <motion.button 
          className={styles.toggleButton} 
          type="button" 
          onClick={onToggle}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring' }}
        >
          {darkMode ? 'Light' : 'Dark'}
        </motion.button>
      </motion.nav>
    </motion.header>
  )
}

export default Navbar

