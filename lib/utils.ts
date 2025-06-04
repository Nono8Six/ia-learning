import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useAnimateOnScroll() {
  if (typeof window === 'undefined') return;
  
  const sections = document.querySelectorAll('.section-animated');
  
  const animateSection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-section-in');
      }
    });
  };
  
  const observer = new IntersectionObserver(animateSection, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });
  
  sections.forEach(section => {
    observer.observe(section);
  });
  
  return () => {
    sections.forEach(section => {
      observer.unobserve(section);
    });
  };
}