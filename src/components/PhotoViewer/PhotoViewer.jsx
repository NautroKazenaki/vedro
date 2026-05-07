import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import ProgressiveImage from '../ProgressiveImage/ProgressiveImage';
import styles from './PhotoViewer.module.css';

const EMPTY_HINT = 'Выберите коллекцию';

// ─── Placeholder when no collection is selected ───────────────────────────────
const EmptyState = memo(function EmptyState() {
  return (
    <motion.div
      className={styles.emptyState}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className={styles.emptyIcon} aria-hidden>◎</span>
      <p className={styles.emptyText}>{EMPTY_HINT}</p>
    </motion.div>
  );
});

// ─── Loading skeleton ──────────────────────────────────────────────────────────
const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <motion.div
      className={styles.skeleton}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      aria-label="Загрузка фотографий"
    />
  );
});

// ─── Photo counter badge ───────────────────────────────────────────────────────
const Counter = memo(function Counter({ current, total }) {
  return (
    <motion.div
      className={styles.counter}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className={styles.counterCurrent}>{current}</span>
      <span className={styles.counterSep}>/</span>
      <span className={styles.counterTotal}>{total}</span>
    </motion.div>
  );
});

// ─── Main component ────────────────────────────────────────────────────────────
const PhotoViewer = memo(function PhotoViewer({ photos, loading }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSlideChange = useCallback((swiper) => {
    setActiveSlide(swiper.realIndex);
  }, []);

  const hasPhotos = photos.length > 0;

  return (
    <section className={styles.section} aria-label="Просмотр фотографий">
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingSkeleton key="loading" />
        ) : !hasPhotos ? (
          <EmptyState key="empty" />
        ) : (
          <motion.div
            key="viewer"
            className={styles.viewerWrap}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Swiper
              modules={[EffectCreative, Keyboard]}
              effect="creative"
              creativeEffect={{
                prev: {
                  shadow: true,
                  translate: ['-105%', 0, -200],
                  opacity: 0,
                },
                next: {
                  translate: ['105%', 0, 0],
                  opacity: 0,
                },
              }}
              keyboard={{ enabled: true }}
              grabCursor
              loop={photos.length > 1}
              onSlideChange={handleSlideChange}
              className={styles.swiper}
            >
              {photos.map((src, idx) => (
                <SwiperSlide key={src ?? idx} className={styles.slide}>
                  <ProgressiveImage
                    src={src}
                    alt={`Фото ${idx + 1}`}
                    className={styles.photo}
                    objectFit="contain"
                    priority={idx === 0}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Floating photo counter */}
            <Counter
              current={activeSlide + 1}
              total={photos.length}
            />

            {/* Gradient vignette for cinematic depth */}
            <div className={styles.vignette} aria-hidden />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

export default PhotoViewer;
