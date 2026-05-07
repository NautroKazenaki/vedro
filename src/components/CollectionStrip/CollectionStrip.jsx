import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { collectionPreviews } from '../../hooks/useCollections';
import ProgressiveImage from '../ProgressiveImage/ProgressiveImage';
import styles from './CollectionStrip.module.css';

const thumbVariants = {
  hidden:  { opacity: 0, scale: 0.75, y: 10 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.48,
      delay: 0.06 + i * 0.05,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
};

const CollectionStrip = memo(function CollectionStrip({ activeIndex, onSelect }) {
  const handleClick = useCallback(
    (index) => () => onSelect(index),
    [onSelect]
  );

  return (
    <nav className={styles.nav} aria-label="Коллекции">
      <Swiper
        modules={[FreeMode, Mousewheel]}
        freeMode={{ enabled: true, momentum: true, momentumRatio: 0.8 }}
        mousewheel={{ forceToAxis: true }}
        slidesPerView="auto"
        spaceBetween={12}
        centeredSlides={false}
        grabCursor
        className={styles.swiper}
      >
        {collectionPreviews.map((src, index) => {
          const isActive = index === activeIndex;
          const label = `Коллекция ${index + 1}`;

          return (
            <SwiperSlide key={index} className={styles.slide}>
              <motion.button
                custom={index}
                variants={thumbVariants}
                initial="hidden"
                animate="visible"
                className={`${styles.thumb} ${isActive ? styles.thumbActive : ''}`}
                onClick={handleClick(index)}
                aria-label={label}
                aria-pressed={isActive}
                whileTap={{ scale: 0.92 }}
              >
                {/* Glassmorphism active ring */}
                {isActive && (
                  <motion.span
                    className={styles.ring}
                    layoutId="activeRing"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}

                <ProgressiveImage
                  src={src}
                  alt={label}
                  className={styles.image}
                  objectFit="cover"
                />

                {/* Hover gradient overlay */}
                <span className={styles.overlay} aria-hidden />

                {/* Index label */}
                <span className={styles.label}>{String(index + 1).padStart(2, '0')}</span>
              </motion.button>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </nav>
  );
});

export default CollectionStrip;
