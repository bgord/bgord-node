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

export type OpenGraphConfigType = {
  title: OpenGraphTitle;
  description: OpenGraphDescription;
  url: OpenGraphUrl;
  type: OpenGraphType;
};

class OpenGraphGenerator {
  static toString(config: OpenGraphConfigType) {
    let output = '';

    output += config.title.toMeta();
    output += config.description.toMeta();
    output += config.url.toMeta();
    output += config.type.toMeta();

    return output;
  }
}

export const OpenGraph = {
  generator: OpenGraphGenerator,
  title: OpenGraphTitle,
  description: OpenGraphDescription,
  url: OpenGraphUrl,
  type: OpenGraphType,
};
