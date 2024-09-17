import * as crypto from 'node:crypto';
import * as util from 'node:util';
import * as fs from 'node:fs';
import { pipeline } from 'node:stream/promises';

import * as Schema from './schema';

export type EncryptionConfig = {
  secret: Schema.EncryptionSecretType;
  iv: Schema.EncryptionIVType;
};

export type EncryptionOperationConfig = {
  input: fs.PathLike;
  output: fs.PathLike;
};

const scrypt = util.promisify(crypto.scrypt);

export class Encryption {
  private readonly algorithm = 'aes-192-cbc';

  constructor(private readonly config: EncryptionConfig) {}

  async createEncrypt() {
    const key = (await scrypt(this.config.secret, 'salt', 24)) as Buffer;

    // @ts-ignore
    return crypto.createCipheriv(this.algorithm, key, this.config.iv);
  }

  async createDecrypt() {
    const key = (await scrypt(this.config.secret, 'salt', 24)) as Buffer;

    // @ts-ignore
    return crypto.createDecipheriv(this.algorithm, key, this.config.iv);
  }

  async encrypt(config: EncryptionOperationConfig) {
    const encrypt = await this.createEncrypt();

    return pipeline(
      fs.createReadStream(config.input),
      encrypt,
      fs.createWriteStream(config.output)
    );
  }

  async decrypt(config: EncryptionOperationConfig) {
    const decrypt = await this.createDecrypt();

    return pipeline(
      fs.createReadStream(config.input),
      decrypt,
      fs.createWriteStream(config.output)
    );
  }
}
