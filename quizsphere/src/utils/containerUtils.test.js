import { 
  getAnimationVariant, 
  getStaggeredAnimationVariants,
  formatErrorMessage,
  generateAnimationKey
} from './containerUtils';

describe('containerUtils', () => {
  describe('getAnimationVariant', () => {
    it('should return fade animation variant by default', () => {
      const variant = getAnimationVariant();
      expect(variant).toHaveProperty('initial');
      expect(variant).toHaveProperty('animate');
      expect(variant).toHaveProperty('exit');
      
      expect(variant.initial).toHaveProperty('opacity', 0);
      expect(variant.animate.opacity).toBe(1);
    });
    
    it('should return slide animation variant', () => {
      const variant = getAnimationVariant('slide');
      expect(variant.initial).toHaveProperty('y', 20);
      expect(variant.animate).toHaveProperty('y', 0);
    });
    
    it('should return scale animation variant', () => {
      const variant = getAnimationVariant('scale');
      expect(variant.initial).toHaveProperty('scale', 0.96);
      expect(variant.animate).toHaveProperty('scale', 1);
    });
    
    it('should return empty variant for none type', () => {
      const variant = getAnimationVariant('none');
      expect(variant.initial).toEqual({});
      expect(variant.animate).toEqual({});
      expect(variant.exit).toEqual({});
    });
    
    it('should use custom duration', () => {
      const customDuration = 0.8;
      const variant = getAnimationVariant('fade', customDuration);
      expect(variant.animate.transition.duration).toBe(customDuration);
    });
  });
  
  describe('getStaggeredAnimationVariants', () => {
    it('should return container and item variants', () => {
      const { container, item } = getStaggeredAnimationVariants();
      
      expect(container).toHaveProperty('initial');
      expect(container).toHaveProperty('animate');
      expect(container).toHaveProperty('exit');
      
      expect(item).toHaveProperty('initial');
      expect(item).toHaveProperty('animate');
      expect(item).toHaveProperty('exit');
      
      expect(container.animate.transition).toHaveProperty('staggerChildren');
      expect(container.animate.transition).toHaveProperty('delayChildren');
    });
    
    it('should use custom stagger delay', () => {
      const customDelay = 0.3;
      const { container } = getStaggeredAnimationVariants('fade', customDelay);
      expect(container.animate.transition.staggerChildren).toBe(customDelay);
    });
  });
  
  describe('formatErrorMessage', () => {
    it('should format string error', () => {
      const error = 'Test error';
      expect(formatErrorMessage(error)).toBe('Test error');
    });
    
    it('should format Error object', () => {
      const error = new Error('Test error object');
      expect(formatErrorMessage(error)).toBe('Test error object');
    });
    
    it('should handle null/undefined errors', () => {
      expect(formatErrorMessage(null)).toBe('An unknown error occurred');
      expect(formatErrorMessage(undefined)).toBe('An unknown error occurred');
    });
    
    it('should handle non-standard error objects', () => {
      const error = { someField: 'test' };
      expect(formatErrorMessage(error)).toBe('An unexpected error occurred');
    });
  });
  
  describe('generateAnimationKey', () => {
    it('should generate a unique string', () => {
      const key1 = generateAnimationKey();
      const key2 = generateAnimationKey();
      
      expect(typeof key1).toBe('string');
      expect(key1).not.toBe(key2);
    });
  });
});
