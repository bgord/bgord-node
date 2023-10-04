import * as path from 'node:path';
import * as fs from 'node:fs/promises';

import * as Schema from './schema';

type FileLocationBasenameType = string;

type FileLocationExtensionType = string;

type FileLocationParentType = string;

type FileLocationConfigType = {
  parent: FileLocationParentType;
  basename: FileLocationBasenameType;
  extension: FileLocationExtensionType;
};

export class FileLocation {
  readonly parent: Schema.PathType; // parent

  private basename: FileLocationBasenameType; // index

  private extension: FileLocationExtensionType; // .html

  constructor(config: FileLocationConfigType) {
    this.parent = Schema.Path.parse(config.parent);
    this.basename = config.basename;
    this.extension = config.extension;
  }

  public getBasename(): FileLocationBasenameType {
    return this.basename; // index
  }

  public getExtension(): FileLocationExtensionType {
    return this.extension; // .html
  }

  public getFilename(extension?: FileLocationExtensionType): Schema.PathType {
    return Schema.Path.parse(`${this.basename}${extension ?? this.extension}`); // index.html
  }

  public getPath(extension?: FileLocationExtensionType): Schema.PathType {
    const filename = this.getFilename(extension);
    return Schema.Path.parse(path.join(this.parent, filename)); // parent/index.html
  }

  public getGzippedPath(): Schema.PathType {
    return Schema.Path.parse(`${this.getPath()}.gz`); // parent/index.html.gz
  }

  public setBasename(basename: FileLocationBasenameType): FileLocation {
    this.basename = basename;
    return this;
  }

  public async delete(): Promise<void> {
    return fs.unlink(this.getPath());
  }
}
