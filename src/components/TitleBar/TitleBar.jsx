import { useRef, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './TitleBar.module.css';

const LABEL = 'Лёша Ведро';
const REPEAT = 8;

const TitleBar = memo(function TitleBar() {
  const containerRef = useRef(null);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 120], [1, 0]);
  const translateY = useTransform(scrollY, [0, 120], [0, -20]);

  const items = Array.from({ length: REPEAT }, (_, i) => (
    <span key={i} className={styles.item} aria-hidden={i > 0}>
      {LABEL}
    </span>
  ));

  return (
    <motion.header
      className={styles.header}
      style={{ opacity, y: translateY }}
      aria-label={LABEL}
    >
      {/* Noise grain texture */}
      <div className={styles.noise} aria-hidden />

      {/* Marquee track — GPU animated via CSS custom property */}
      <div className={styles.marqueeWrapper} ref={containerRef}>
        <motion.div
          className={styles.marquee}
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 22,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          }}
        >
          {items}
          {/* Duplicate for seamless loop */}
          {items}
        </motion.div>
      </div>

      {/* Bottom fade edge */}
      <div className={styles.bottomFade} aria-hidden />
    </motion.header>
  );
});

export default TitleBar;
