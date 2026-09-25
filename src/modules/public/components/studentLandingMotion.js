export const editorialStagger = {
  ready: { transition: { staggerChildren: 0.09 } },
};

export const editorialItem = {
  rest: { opacity: 0.92, y: 8 },
  ready: { opacity: 1, y: 0, transition: { duration: 0.58, ease: 'easeOut' } },
};

export const previewSequence = {
  ready: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

export const previewItem = {
  rest: { opacity: 0.94, y: 6 },
  ready: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
};

export const panelSwap = {
  initial: { opacity: 0.88, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0.88, y: -4, transition: { duration: 0.13, ease: 'easeOut' } },
};

export const indicatorSpring = { type: 'spring', stiffness: 350, damping: 32 };
