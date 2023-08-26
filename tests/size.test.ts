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
});
