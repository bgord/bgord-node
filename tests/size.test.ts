import { describe, test, expect } from 'vitest';
import { Size, SizeUnit } from '../src/size';

describe('Size', () => {
  test('Create Size instance with bytes', () => {
    const sizeConfig = { unit: SizeUnit.b, value: 500 };
    const size = new Size(sizeConfig);

    expect(size.toString()).toEqual('500 b');
  });

  test('Create Size instance with KB', () => {
    const sizeConfig = { unit: SizeUnit.KB, value: 500 };
    const size = new Size(sizeConfig);

    expect(size.toString()).toEqual('500 KB');
  });

  test('Create Size instance with MB', () => {
    const sizeConfig = { unit: SizeUnit.MB, value: 2 };
    const size = new Size(sizeConfig);

    expect(size.toString()).toEqual('2 MB');
  });

  test('Create Size instance with GB', () => {
    const sizeConfig = { unit: SizeUnit.GB, value: 2 };
    const size = new Size(sizeConfig);

    expect(size.toString()).toEqual('2 GB');
  });

  test('Convert Size to Bytes (bytes)', () => {
    const sizeConfig = { unit: SizeUnit.b, value: 4096 };
    const size = new Size(sizeConfig);

    const bytes = size.toBytes();

    expect(bytes).toEqual(sizeConfig.value);
  });

  test('Convert Size to Bytes (KB)', () => {
    const sizeConfig = { unit: SizeUnit.KB, value: 512 };
    const size = new Size(sizeConfig);

    const bytes = size.toBytes();

    expect(bytes).toEqual(524288);
  });

  test('Convert Size to Bytes (MB)', () => {
    const sizeConfig = { unit: SizeUnit.MB, value: 1.5 };
    const size = new Size(sizeConfig);

    const bytes = size.toBytes();

    expect(bytes).toEqual(1572864);
  });

  test('Convert Size to Bytes (GB)', () => {
    const sizeConfig = { unit: SizeUnit.GB, value: 1.5 };
    const size = new Size(sizeConfig);

    const bytes = size.toBytes();

    expect(bytes).toEqual(1610612736);
  });

  test('Static method: Convert Size to Bytes (bytes)', () => {
    const sizeConfig = { unit: SizeUnit.b, value: 8192 };
    const bytes = Size.toBytes(sizeConfig);

    expect(bytes).toEqual(sizeConfig.value);
  });

  test('Static method: Convert Size to Bytes (KB)', () => {
    const sizeConfig = { unit: SizeUnit.KB, value: 256 };
    const bytes = Size.toBytes(sizeConfig);

    expect(bytes).toEqual(262144);
  });

  test('Static method: Convert Size to Bytes (MB)', () => {
    const sizeConfig = { unit: SizeUnit.MB, value: 0.75 };
    const bytes = Size.toBytes(sizeConfig);

    expect(bytes).toEqual(786432);
  });

  test('Static method: Convert Size to Bytes (GB)', () => {
    const sizeConfig = { unit: SizeUnit.GB, value: 0.75 };
    const bytes = Size.toBytes(sizeConfig);

    expect(bytes).toEqual(805306368);
  });

  test('Comparison function', () => {
    const first = new Size({ unit: SizeUnit.GB, value: 1 });
    const second = new Size({ unit: SizeUnit.MB, value: 1 });

    expect(first.isGreaterThan(second)).toBeTruthy();
  });

  test('Comparison function', () => {
    const first = new Size({ unit: SizeUnit.MB, value: 1 });
    const second = new Size({ unit: SizeUnit.MB, value: 1 });

    expect(first.isGreaterThan(second)).toBeFalsy();
  });

  describe('format', () => {
    test('should return formatted bytes', () => {
      const bytes = new Size({ unit: SizeUnit.b, value: 1024 });
      expect(bytes.format(SizeUnit.b)).toEqual('1024 b');
      expect(bytes.format(SizeUnit.KB)).toEqual('1 KB');
      expect(bytes.format(SizeUnit.MB)).toEqual('0 MB');
      expect(bytes.format(SizeUnit.GB)).toEqual('0 GB');
    });

    test('should return formatted KB', () => {
      const kb = new Size({ unit: SizeUnit.KB, value: 512 });
      expect(kb.format(SizeUnit.b)).toEqual('524288 b');
      expect(kb.format(SizeUnit.KB)).toEqual('512 KB');
      expect(kb.format(SizeUnit.MB)).toEqual('0.5 MB');
      expect(kb.format(SizeUnit.GB)).toEqual('0 GB');
    });

    test('should return formatted MB', () => {
      const mb = new Size({ unit: SizeUnit.MB, value: 128 });
      expect(mb.format(SizeUnit.b)).toEqual('134217728 b');
      expect(mb.format(SizeUnit.KB)).toEqual('131072 KB');
      expect(mb.format(SizeUnit.MB)).toEqual('128 MB');
      expect(mb.format(SizeUnit.GB)).toEqual('0.13 GB');
    });

    test('should return formatted GB', () => {
      const gb = new Size({ unit: SizeUnit.GB, value: 2 });
      expect(gb.format(SizeUnit.b)).toEqual('2147483648 b');
      expect(gb.format(SizeUnit.KB)).toEqual('2097152 KB');
      expect(gb.format(SizeUnit.MB)).toEqual('2048 MB');
      expect(gb.format(SizeUnit.GB)).toEqual('2 GB');
    });
  });
});
