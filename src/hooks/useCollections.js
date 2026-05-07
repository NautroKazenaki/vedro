import { useState, useCallback } from 'react';

const TOTAL_COLLECTIONS = 10;

// Eagerly import the first frame of each collection for the picker strip.
// Vite resolves these at build time — no dynamic require needed.
const previewImages = import.meta.glob(
  '../photos/vedro*/CLR_1.jpg',
  { eager: true, import: 'default' }
);

function buildPreviewMap() {
  const map = {};
  for (const [path, url] of Object.entries(previewImages)) {
    const match = path.match(/vedro(\d+)\/CLR_1\.jpg$/);
    if (match) map[Number(match[1])] = url;
  }
  return map;
}

const previewMap = buildPreviewMap();

export const collectionPreviews = Array.from(
  { length: TOTAL_COLLECTIONS },
  (_, i) => previewMap[i + 1] ?? null
);

// Lazily import frames 2+ of each collection (CLR_1 is already eager above).
const laterPhotoModules = import.meta.glob(
  '../photos/vedro*/CLR_[2-9]*.jpg',
  { eager: false, import: 'default' }
);

async function loadCollectionPhotos(folderIndex) {
  // First frame is already in the eager bundle — use it directly.
  const preview = previewMap[folderIndex];

  const prefix = `../photos/vedro${folderIndex}/CLR_`;
  const entries = Object.entries(laterPhotoModules)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => {
      const numA = parseInt(a.match(/CLR_(\d+)\.jpg$/)?.[1] ?? '0', 10);
      const numB = parseInt(b.match(/CLR_(\d+)\.jpg$/)?.[1] ?? '0', 10);
      return numA - numB;
    });

  const laterUrls = await Promise.all(entries.map(([, loader]) => loader()));
  return [preview, ...laterUrls].filter(Boolean);
}

export function useCollections() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const selectCollection = useCallback(async (index) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setLoading(true);
    setPhotos([]);

    const urls = await loadCollectionPhotos(index + 1);
    setPhotos(urls);
    setLoading(false);
  }, [activeIndex]);

  return { activeIndex, photos, loading, selectCollection };
}
