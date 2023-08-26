import { describe, it, expect } from 'vitest';
import { NewUUID } from '../src/uuid';

describe('UUID', () => {
  it('should return a uuid', () => {
    const uuid = NewUUID.generate();
    expect(uuid.length).eql(36);
    expect(typeof uuid).eql('string');
  });
});
