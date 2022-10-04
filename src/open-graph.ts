import * as Schema from './schema';

class OpenGraphTitle {
  value: Schema.OpenGraphTitleValueType;

  constructor(value: Schema.OpenGraphTitleValueType) {
    this.value = Schema.OpenGraphTitleValue.parse(value);
  }

  toMetatag(): string {
    return `<meta property="og:title" content="${this.value}" />`;
  }

  toMeta(): string {
    return `${this.toMetatag()}\n\t`;
  }
}

class OpenGraphDescription {
  value: Schema.OpenGraphDescriptionValueType;

  constructor(value: Schema.OpenGraphDescriptionValueType) {
    this.value = Schema.OpenGraphDescriptionValue.parse(value);
  }

  toMetatag(): string {
    return `<meta property="og:description" content="${this.value}" />`;
  }

  toMeta(): string {
    return `${this.toMetatag()}\n\t`;
  }
}

class OpenGraphUrl {
  value: Schema.OpenGraphUrlValueType;

  constructor(value: Schema.OpenGraphUrlValueType) {
    this.value = Schema.OpenGraphUrlValue.parse(value);
  }

  toMetatag(): string {
    return `<meta property="og:url" content="${this.value}" />`;
  }

  toMeta(): string {
    return `${this.toMetatag()}\n\t`;
  }
}

class OpenGraphType {
  value: Schema.OpenGraphTypeValueType;

  constructor(value: Schema.OpenGraphTypeValueType) {
    this.value = Schema.OpenGraphTypeValue.parse(value);
  }

  toMetatag(): string {
    return `<meta property="og:type" content="${this.value}" />`;
  }

  toMeta(): string {
    return `${this.toMetatag()}\n\t`;
  }
}

class OpenGraphImageUrl {
  value: Schema.OpenGraphImageUrlValueType;

  constructor(path: Schema.PathType) {
    this.value = Schema.OpenGraphImageUrlValue.parse(path);
  }

  toMetatag(): string {
    return `<meta property="og:image" content="${this.value}" />`;
  }

  toMeta(): string {
    return `${this.toMetatag()}\n\t`;
  }
}

class OpenGraphImageType {
  value: Schema.OpenGraphImageTypeValueType;

  constructor(value: Schema.OpenGraphImageTypeValueType) {
    this.value = Schema.OpenGraphImageTypeValue.parse(value);
  }

  toMetatag(): string {
    return `<meta property="og:image:type" content="${this.value}" />`;
  }

  toMeta(): string {
    return `${this.toMetatag()}\n\t`;
  }
}

class OpenGraphImageWidth {
  value: Schema.OpenGraphImageWidthValueType;

  constructor(value: Schema.OpenGraphImageWidthValueType) {
    this.value = Schema.OpenGraphImageWidthValue.parse(value);
  }

  toMetatag(): string {
    return `<meta property="og:image:width" content="${this.value}" />`;
  }

  toMeta(): string {
    return `${this.toMetatag()}\n\t`;
  }
}

class OpenGraphImageHeight {
  value: Schema.OpenGraphImageHeightValueType;

  constructor(value: Schema.OpenGraphImageHeightValueType) {
    this.value = Schema.OpenGraphImageHeightValue.parse(value);
  }

  toMetatag(): string {
    return `<meta property="og:image:height" content="${this.value}" />`;
  }

  toMeta(): string {
    return `${this.toMetatag()}\n\t`;
  }
}

export type OpenGraphImageConfigType = {
  url: OpenGraphImageUrl;
  width: OpenGraphImageWidth;
  height: OpenGraphImageHeight;
  type: OpenGraphImageType;
};

class OpenGraphImage {
  value: OpenGraphImageConfigType;

  constructor(value: OpenGraphImageConfigType) {
    this.value = value;
  }

  toString() {
    let output = '';

    output += this.value.url.toMeta();
    output += this.value.width.toMeta();
    output += this.value.height.toMeta();
    output += this.value.type.toMeta();

    return output;
  }
}

type OpenGraphConfigType = {
  title: OpenGraphTitle;
  description: OpenGraphDescription;
  url: OpenGraphUrl;
  type: OpenGraphType;
  image?: OpenGraphImage;
};

class OpenGraphGenerator {
  static toString(config: OpenGraphConfigType) {
    let output = '';

    output += config.title.toMeta();
    output += config.description.toMeta();
    output += config.url.toMeta();
    output += config.type.toMeta();

    if (config.image) {
      output += config.image.toString();
    }

    return output;
  }
}

export const OpenGraph = {
  generator: OpenGraphGenerator,
  title: OpenGraphTitle,
  description: OpenGraphDescription,
  url: OpenGraphUrl,
  type: OpenGraphType,
  image: {
    compound: OpenGraphImage,
    url: OpenGraphImageUrl,
    width: OpenGraphImageWidth,
    height: OpenGraphImageHeight,
    type: OpenGraphImageType,
  },
};
