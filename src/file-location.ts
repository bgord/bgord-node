import * as path from 'node:path';
import fs from 'node:fs/promises';

import * as Schema from './schema';

type FileLocationBasenameType = string;

type FileLocationExtensionType = string;

type FileLocationParentType = string;

export type FileLocationConfigType = {
  parent: FileLocationParentType;
  basename: FileLocationBasenameType;
  extension: FileLocationExtensionType;
};

export class FileLocation {
  readonly parent: Schema.PathType; // /parent/dir

  private basename: FileLocationBasenameType; // index

  private extension: FileLocationExtensionType; // .html

  constructor(config: FileLocationConfigType) {
    this.parent = Schema.Path.parse(config.parent);
    this.basename = config.basename;
    this.extension = config.extension;
  }

  getBasename(): FileLocationBasenameType {
    return this.basename; // index
  }

  getExtension(): FileLocationExtensionType {
    return this.extension; // .html
  }

  getFilename(extension?: FileLocationExtensionType): Schema.PathType {
    return Schema.Path.parse(`${this.basename}${extension ?? this.extension}`); // index.html
  }

  getPath(extension?: FileLocationExtensionType): Schema.PathType {
    const filename = this.getFilename(extension);
    return Schema.Path.parse(path.join(this.parent, filename)); // parent/index.html
  }

  getGzippedPath(): Schema.PathType {
    return Schema.Path.parse(`${this.getPath()}.gz`); // parent/index.html.gz
  }

  summary() {
    return {
      parent: this.parent,
      basename: this.getBasename(),
      extension: this.getExtension(),
      filename: this.getFilename(),
      path: this.getPath(),
      gzipped: this.getGzippedPath(),
    };
  }

  setBasename(basename: FileLocationBasenameType): FileLocation {
    this.basename = basename;
    return this;
  }

  async delete(): Promise<void> {
    return fs.unlink(this.getPath());
  }
}
