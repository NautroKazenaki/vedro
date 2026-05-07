import { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProgressiveImage.module.css';

const ProgressiveImage = memo(function ProgressiveImage({
  src,
  alt = '',
  className = '',
  layoutId,
  objectFit = 'cover',
  priority = false,
}) {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(priority);
  const containerRef = useRef(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`}
      style={{ '--object-fit': objectFit }}
    >
      {/* Shimmer skeleton */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            className={styles.skeleton}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Actual image */}
      {visible && src && (
        <motion.img
          layoutId={layoutId}
          src={src}
          alt={alt}
          className={styles.image}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          initial={{ opacity: 0, filter: 'blur(12px)' }}
          animate={loaded ? { opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </div>
  );
});

export default ProgressiveImage;
