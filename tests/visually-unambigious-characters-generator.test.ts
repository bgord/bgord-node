import { describe, test, expect } from 'vitest';

import { VisuallyUnambigiousCharactersGenerator } from '../src/visually-unambigious-characters-generator';

describe('VisuallyUnambigiousCharacters', () => {
  describe('generate', () => {
    test('default length', () => {
      expect(VisuallyUnambigiousCharactersGenerator.chars).toContain(
        VisuallyUnambigiousCharactersGenerator.generate()
      );
    });

    test('length of 5', () => {
      const length = 5;
      const result = VisuallyUnambigiousCharactersGenerator.generate(length);

      expect(result.length).toEqual(length);

      for (const char of result) {
        expect(VisuallyUnambigiousCharactersGenerator.chars).toContain(char);
      }
    });
  });
});
