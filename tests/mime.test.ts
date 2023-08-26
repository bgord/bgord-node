import { describe, it, expect } from 'vitest';
import { InvalidMimeError } from '../src/errors';
import { Mime } from '../src/mime';

describe('Mime', () => {
  it('should create a Mime instance with valid input', () => {
    const plainText = 'text/plain';
    const mime = new Mime(plainText);

    expect(mime).toBeDefined();
    expect(mime.raw).toBe(plainText);
    expect(mime.type).toBe('text');
    expect(mime.subtype).toBe('plain');
  });

  it('should throw InvalidMimeError for invalid input', () => {
    expect(() => new Mime('')).toThrow(InvalidMimeError);
    expect(() => new Mime('/subtype')).toThrow(InvalidMimeError);
    expect(() => new Mime('type/')).toThrow(InvalidMimeError);
  });

  it('should correctly check if a Mime instance satisfies another', () => {
    const textPlain = new Mime('text/plain');
    const textHtml = new Mime('text/html');
    const appJson = new Mime('application/json');
    const textWildcard = new Mime('text/*');
    const wildcard = new Mime('*/*');

    expect(textPlain.isSatisfiedBy(textHtml)).toBe(false);
    expect(textPlain.isSatisfiedBy(appJson)).toBe(false);
    expect(textPlain.isSatisfiedBy(textPlain)).toBe(true);
    expect(textWildcard.isSatisfiedBy(textPlain)).toBe(true);
    expect(wildcard.isSatisfiedBy(textPlain)).toBe(true);
  });

  it('should correctly check wildcard type and subtype', () => {
    const textPlain = new Mime('text/plain');
    const imageWildcard = new Mime('image/*');
    const wildcardPlain = new Mime('*/plain');
    const wildcard = new Mime('*/*');

    expect(textPlain.isSatisfiedBy(imageWildcard)).toBe(false);
    expect(textPlain.isSatisfiedBy(wildcardPlain)).toBe(false);
    expect(textPlain.isSatisfiedBy(wildcard)).toBe(false);
    expect(imageWildcard.isSatisfiedBy(wildcardPlain)).toBe(false);
    expect(imageWildcard.isSatisfiedBy(wildcard)).toBe(false);
    expect(wildcardPlain.isSatisfiedBy(wildcard)).toBe(false);
  });
});
