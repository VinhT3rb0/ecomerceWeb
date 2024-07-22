// useInViewAnimation.js
import { useInView } from 'react-intersection-observer';

const useInViewAnimation = (options = {}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    ...options,
  });

  return { ref, inView };
};

export default useInViewAnimation;
