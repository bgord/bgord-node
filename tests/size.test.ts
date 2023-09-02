import { describe, test, expect } from 'vitest';
import { Size, SizeUnit } from '../src/size';

describe('Size', () => {
  test('Create Size instance with bytes', () => {
    const sizeConfig = { unit: SizeUnit.b, value: 500 };
    const size = new Size(sizeConfig);

    expect(size.toString()).toEqual('500 b');
  });

  test('Create Size instance with kB', () => {
    const sizeConfig = { unit: SizeUnit.kB, value: 500 };
    const size = new Size(sizeConfig);

    expect(size.toString()).toEqual('500 kB');
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

  test('Convert Size to Bytes (kB)', () => {
    const sizeConfig = { unit: SizeUnit.kB, value: 512 };
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

  test('Static method: Convert Size to Bytes (kB)', () => {
    const sizeConfig = { unit: SizeUnit.kB, value: 256 };
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
      expect(bytes.format(SizeUnit.kB)).toEqual('1 kB');
      expect(bytes.format(SizeUnit.MB)).toEqual('0 MB');
      expect(bytes.format(SizeUnit.GB)).toEqual('0 GB');
    });

    test('should return formatted kB', () => {
      const kB = new Size({ unit: SizeUnit.kB, value: 512 });
      expect(kB.format(SizeUnit.b)).toEqual('524288 b');
      expect(kB.format(SizeUnit.kB)).toEqual('512 kB');
      expect(kB.format(SizeUnit.MB)).toEqual('0.5 MB');
      expect(kB.format(SizeUnit.GB)).toEqual('0 GB');
    });

    test('should return formatted MB', () => {
      const MB = new Size({ unit: SizeUnit.MB, value: 128 });
      expect(MB.format(SizeUnit.b)).toEqual('134217728 b');
      expect(MB.format(SizeUnit.kB)).toEqual('131072 kB');
      expect(MB.format(SizeUnit.MB)).toEqual('128 MB');
      expect(MB.format(SizeUnit.GB)).toEqual('0.13 GB');
    });

    test('should return formatted GB', () => {
      const GB = new Size({ unit: SizeUnit.GB, value: 2 });
      expect(GB.format(SizeUnit.b)).toEqual('2147483648 b');
      expect(GB.format(SizeUnit.kB)).toEqual('2097152 kB');
      expect(GB.format(SizeUnit.MB)).toEqual('2048 MB');
      expect(GB.format(SizeUnit.GB)).toEqual('2 GB');
    });
  });
});
