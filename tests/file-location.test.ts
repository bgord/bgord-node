import { describe, it, expect } from 'vitest';

import { FileLocation } from '../src/file-location'; // Adjust the import path as needed

describe('FileLocation', () => {
  it('should create a FileLocation instance with valid configuration', () => {
    const fileLocation = new FileLocation({
      parent: '/path/to/parent',
      basename: 'index',
      extension: '.html',
    });

    expect(fileLocation).toBeDefined();
    expect(fileLocation.parent).toBe('/path/to/parent');
    expect(fileLocation.getBasename()).toBe('index');
    expect(fileLocation.getExtension()).toBe('.html');
  });

  it('should correctly generate the filename', () => {
    const fileLocation = new FileLocation({
      parent: '/path/to/parent',
      basename: 'index',
      extension: '.html',
    });

    expect(fileLocation.getFilename()).toBe('index.html');
  });

  it('should correctly generate the filename with another extension', () => {
    const fileLocation = new FileLocation({
      parent: '/path/to/parent',
      basename: 'index',
      extension: '.html',
    });

    expect(fileLocation.getFilename('.txt')).toBe('index.txt');
  });

  it('should correctly generate the path', () => {
    const fileLocation = new FileLocation({
      parent: '/path/to/parent',
      basename: 'index',
      extension: '.html',
    });

    expect(fileLocation.getPath()).toBe('/path/to/parent/index.html');
  });

  it('should correctly generate the path with a specified extension', () => {
    const fileLocation = new FileLocation({
      parent: '/path/to/parent',
      basename: 'index',
      extension: '.html',
    });

    expect(fileLocation.getPath('.txt')).toBe('/path/to/parent/index.txt');
  });

  it('should correctly generate the gzipped path', () => {
    const fileLocation = new FileLocation({
      parent: '/path/to/parent',
      basename: 'index',
      extension: '.html',
    });

    expect(fileLocation.getGzippedPath()).toBe('/path/to/parent/index.html.gz');
  });

  it('should set and get the basename', () => {
    const fileLocation = new FileLocation({
      parent: '/path/to/parent',
      basename: 'index',
      extension: '.html',
    });

    fileLocation.setBasename('newindex');

    expect(fileLocation.getBasename()).toBe('newindex');
    expect(fileLocation.getFilename()).toBe('newindex.html');
    expect(fileLocation.getPath()).toBe('/path/to/parent/newindex.html');
    expect(fileLocation.getGzippedPath()).toBe(
      '/path/to/parent/newindex.html.gz'
    );
  });

  it('should handle invalid parent properly', () => {
    const fileLocation = new FileLocation({
      parent: '/path/to/parent/',
      basename: 'index',
      extension: '.html',
    });

    expect(fileLocation.getBasename()).toBe('index');
    expect(fileLocation.getFilename()).toBe('index.html');
    expect(fileLocation.getPath()).toBe('/path/to/parent/index.html');
    expect(fileLocation.getGzippedPath()).toBe('/path/to/parent/index.html.gz');
  });

  it('should return summary', () => {
    const fileLocation = new FileLocation({
      parent: '/path/to/parent',
      basename: 'index',
      extension: '.html',
    });

    expect(fileLocation.summary()).toEqual({
      parent: '/path/to/parent',
      basename: 'index',
      extension: '.html',
      filename: 'index.html',
      path: '/path/to/parent/index.html',
      gzipped: '/path/to/parent/index.html.gz',
    });
  });
});
