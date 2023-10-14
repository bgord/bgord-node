import * as crypto from 'node:crypto';
import * as util from 'node:util';
import * as stream from 'node:stream';
import { createReadStream, createWriteStream, PathLike } from 'node:fs';

import * as Schema from './schema';

export type EncryptionConfig = {
  password: Schema.EncryptionSecretType;
  iv: Schema.EncryptionIVType;
};

export type EncryptionOperationConfig = {
  input: PathLike;
  output: PathLike;
};

const scrypt = util.promisify(crypto.scrypt);

export class Encryption {
  private algorithm = 'aes-192-cbc';

  constructor(private config: EncryptionConfig) {}

  public async createCipher() {
    const key = (await scrypt(this.config.password, 'salt', 24)) as Buffer;

    return crypto.createCipheriv(this.algorithm, key, this.config.iv);
  }

  public async createDecipher() {
    const key = (await scrypt(this.config.password, 'salt', 24)) as Buffer;

    return crypto.createDecipheriv(this.algorithm, key, this.config.iv);
  }

  public async encrypt(config: EncryptionOperationConfig) {
    const encrypt = await this.createCipher();

    return util.promisify(stream.pipeline)(
      createReadStream(config.input),
      encrypt,
      createWriteStream(config.output)
    );
  }

  public async decrypt(config: EncryptionOperationConfig) {
    const decrypt = await this.createDecipher();

    return util.promisify(stream.pipeline)(
      createReadStream(config.input),
      decrypt,
      createWriteStream(config.output)
    );
  }
}
