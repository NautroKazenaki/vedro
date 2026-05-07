import { useEffect } from 'react';
import Lenis from 'lenis';
import TitleBar from './components/TitleBar/TitleBar';
import CollectionStrip from './components/CollectionStrip/CollectionStrip';
import PhotoViewer from './components/PhotoViewer/PhotoViewer';
import { useCollections } from './hooks/useCollections';
import styles from './App.module.css';

export default function App() {
  const { activeIndex, photos, loading, selectCollection } = useCollections();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main className={styles.root}>
      <TitleBar />
      <CollectionStrip activeIndex={activeIndex} onSelect={selectCollection} />
      <PhotoViewer photos={photos} loading={loading} />
    </main>
  );
}
