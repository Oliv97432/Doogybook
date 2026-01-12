import { useEffect, useRef, useCallback } from 'react';

const useInfiniteScroll = (callback, loading) => {
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        callback();
      }
    },
    [callback, loading]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [handleObserver]);

  return loadMoreRef;
};

export default useInfiniteScroll;
