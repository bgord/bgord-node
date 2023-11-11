import * as Schema from './schema';
import { ImageEXIF } from './image-exif';

class OpenGraphTitle {
  private readonly value: Schema.OpenGraphTitleValueType;

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
  private readonly value: Schema.OpenGraphDescriptionValueType;

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
  private readonly value: Schema.OpenGraphUrlValueType;

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
  private readonly value: Schema.OpenGraphTypeValueType;

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
  private readonly value: Schema.OpenGraphImageUrlValueType;

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
  private readonly value: Schema.OpenGraphImageTypeValueType;

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
  private readonly value: Schema.OpenGraphImageWidthValueType;

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
  private readonly value: Schema.OpenGraphImageHeightValueType;

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
  private readonly value: OpenGraphImageConfigType;

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

class OpenGraphImageGenerator {
  static async generate(config: {
    path: Schema.PathType;
    BASE_URL: Schema.UrlWithoutTrailingSlashType;
  }) {
    const exif = await ImageEXIF.read(config.path);

    return new OpenGraphImage({
      url: new OpenGraph.image.url(
        Schema.Path.parse(`${config.BASE_URL}/${exif.name}`)
      ),
      type: new OpenGraph.image.type(exif.mimeType),
      width: new OpenGraph.image.width(exif.width),
      height: new OpenGraph.image.height(exif.height),
    });
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
    generator: OpenGraphImageGenerator,
    url: OpenGraphImageUrl,
    width: OpenGraphImageWidth,
    height: OpenGraphImageHeight,
    type: OpenGraphImageType,
  },
};
