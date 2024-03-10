import { describe, test, expect } from 'vitest';

import { EmailCensor } from '../src/email-censor';

describe('EmailCensor', () => {
  test('works for 1 char', () => {
    expect(EmailCensor.censor('te@example.com')).toEqual('**@example.com');
  });

  test('works for 2 chars', () => {
    expect(EmailCensor.censor('te@example.com')).toEqual('**@example.com');
  });

  test('works for more than 2 chars', () => {
    expect(EmailCensor.censor('testing@example.com')).toEqual(
      't*****g@example.com'
    );
  });
});
