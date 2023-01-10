import { randomUUID } from 'crypto';

export class NewUUID {
  static generate() {
    return randomUUID();
  }
}
