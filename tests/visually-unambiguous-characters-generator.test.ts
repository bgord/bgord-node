import { describe, test, expect } from 'vitest';

import { VisuallyUnambiguousCharactersGenerator } from '../src/visually-unambiguous-characters-generator';

describe('VisuallyUnambiguousCharactersGenerator', () => {
  describe('generate', () => {
    test('default length', () => {
      expect(VisuallyUnambiguousCharactersGenerator.chars).toContain(
        VisuallyUnambiguousCharactersGenerator.generate()
      );
    });

    test('length of 5', () => {
      const length = 5;
      const result = VisuallyUnambiguousCharactersGenerator.generate(length);

      expect(result.length).toEqual(length);

      for (const char of result) {
        expect(VisuallyUnambiguousCharactersGenerator.chars).toContain(char);
      }
    });
  });
});
