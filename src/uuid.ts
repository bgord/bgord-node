import { randomUUID } from 'node:crypto';

export class NewUUID {
  static generate() {
    return randomUUID();
  }
}
