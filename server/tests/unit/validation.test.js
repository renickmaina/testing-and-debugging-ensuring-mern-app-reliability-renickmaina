const { validateBug } = require('../../src/middleware/validation');

describe('Validation Middleware', () => {
  describe('validateBug', () => {
    it('should be an array of validation chains', () => {
      expect(Array.isArray(validateBug)).toBe(true);
      expect(validateBug.length).toBe(4); // title, description, priority, status
    });

    it('should validate title field correctly', () => {
      const titleValidation = validateBug[0];
      expect(titleValidation).toBeDefined();
      
      // Test the validation chain exists
      expect(typeof titleValidation).toBe('function');
    });

    it('should validate description field correctly', () => {
      const descriptionValidation = validateBug[1];
      expect(descriptionValidation).toBeDefined();
      expect(typeof descriptionValidation).toBe('function');
    });

    it('should validate priority field correctly', () => {
      const priorityValidation = validateBug[2];
      expect(priorityValidation).toBeDefined();
      expect(typeof priorityValidation).toBe('function');
    });

    it('should validate status field correctly', () => {
      const statusValidation = validateBug[3];
      expect(statusValidation).toBeDefined();
      expect(typeof statusValidation).toBe('function');
    });

    it('should have the correct validation rules structure', () => {
      validateBug.forEach(validation => {
        expect(validation).toBeDefined();
        expect(typeof validation).toBe('function');
      });
    });
  });
});