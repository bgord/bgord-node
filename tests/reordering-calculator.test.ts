import { it, expect, describe } from 'vitest';

import { ReorderingCalculator, ReorderingTransfer } from '../src/reordering';

describe('Calculator', () => {
  describe('add()', () => {
    it('correctly adds items', () => {
      const calculator = new ReorderingCalculator();

      for (const id of ['a', 'b', 'c']) {
        calculator.add(id);
      }

      calculator.transfer(new ReorderingTransfer({ id: 'c', to: 1 }));

      expect(calculator.read().ids).toEqual(['a', 'c', 'b']);
    });
  });

  describe('delete()', () => {
    it('correctly deletes items', () => {
      const calculator = ReorderingCalculator.fromArray(['a', 'b', 'c']);
      calculator.delete('b');
      expect(calculator.read().ids).toEqual(['a', 'c']);
    });

    it('throws when Item is not found', () => {
      const calculator = ReorderingCalculator.fromArray(['a', 'b', 'c']);
      expect(() => calculator.delete('d')).toThrow('Cannot find Item');
    });
  });

  describe('transfer()', () => {
    it('transfer noop', () => {
      const calculator = ReorderingCalculator.fromArray(['aaa', 'bbb', 'ccc']);
      calculator.transfer(new ReorderingTransfer({ id: 'ccc', to: 2 }));
      expect(calculator.read().ids).toEqual(['aaa', 'bbb', 'ccc']);
    });

    it('from end to middle', () => {
      const calculator = ReorderingCalculator.fromArray(['aaa', 'bbb', 'ccc']);
      calculator.transfer(new ReorderingTransfer({ id: 'ccc', to: 1 }));
      expect(calculator.read().ids).toEqual(['aaa', 'ccc', 'bbb']);
    });

    it('from end to start', () => {
      const calculator = ReorderingCalculator.fromArray(['aaa', 'bbb', 'ccc']);
      calculator.transfer(new ReorderingTransfer({ id: 'ccc', to: 0 }));
      expect(calculator.read().ids).toEqual(['ccc', 'aaa', 'bbb']);
    });

    it('from middle to start', () => {
      const calculator = ReorderingCalculator.fromArray(['aaa', 'bbb', 'ccc']);
      calculator.transfer(new ReorderingTransfer({ id: 'bbb', to: 0 }));
      expect(calculator.read().ids).toEqual(['bbb', 'aaa', 'ccc']);
    });

    it('from middle to end', () => {
      const calculator = ReorderingCalculator.fromArray(['aaa', 'bbb', 'ccc']);
      calculator.transfer(new ReorderingTransfer({ id: 'bbb', to: 2 }));
      expect(calculator.read().ids).toEqual(['aaa', 'ccc', 'bbb']);
    });

    it('from start to middle', () => {
      const calculator = ReorderingCalculator.fromArray(['aaa', 'bbb', 'ccc']);
      calculator.transfer(new ReorderingTransfer({ id: 'aaa', to: 1 }));
      expect(calculator.read().ids).toEqual(['bbb', 'aaa', 'ccc']);
    });

    it('from start to end', () => {
      const calculator = ReorderingCalculator.fromArray(['aaa', 'bbb', 'ccc']);
      calculator.transfer(new ReorderingTransfer({ id: 'aaa', to: 2 }));
      expect(calculator.read().ids).toEqual(['bbb', 'ccc', 'aaa']);
    });

    it('to back and to start', () => {
      const toEnd = new ReorderingTransfer({ id: 'aaa', to: 2 });
      const toStart = new ReorderingTransfer({ id: 'aaa', to: 0 });

      const calculator = ReorderingCalculator.fromArray(['aaa', 'bbb', 'ccc']);

      calculator.transfer(toEnd);
      expect(calculator.read().ids).toEqual(['bbb', 'ccc', 'aaa']);

      calculator.transfer(toStart);
      expect(calculator.read().ids).toEqual(['aaa', 'bbb', 'ccc']);
    });

    it('transfer error - cannot find current', () => {
      const calculator = ReorderingCalculator.fromArray(['aaa', 'bbb', 'ccc']);
      expect(() =>
        calculator.transfer(new ReorderingTransfer({ id: 'ddd', to: 1 }))
      ).toThrow('Cannot find current Item');
    });

    it('transfer error - cannot find target', () => {
      const calculator = ReorderingCalculator.fromArray(['aaa', 'bbb', 'ccc']);
      expect(() =>
        calculator.transfer(new ReorderingTransfer({ id: 'ccc', to: 4 }))
      ).toThrow('Cannot find target Item');
    });

    it('10 elements', () => {
      // prettier-ignore
      const calculator = ReorderingCalculator.fromArray([
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    ]);

      calculator.transfer(new ReorderingTransfer({ id: 'h', to: 1 }));

      // prettier-ignore
      expect(calculator.read().ids).toEqual([
      "a", "h", "b", "c", "d", "e", "f", "g", "i", "j",
    ]);
    });
  });
});
