import { Random } from './random';

export class VisuallyUnambigiousCharactersGenerator {
  // prettier-ignore
  static chars = [
    'a', 'b', 'c', 'd', 'e', 'f',
    'h', 'i', 'j', 'k', 'm', 'n',
    'o', 'p', 'r', 's', 't', 'w',
    'x', 'y', '3', '4',
  ];

  static generate(length = 1): string {
    return Array.from({ length })
      .map(
        () =>
          VisuallyUnambigiousCharactersGenerator.chars[
            Random.generate({
              min: 0,
              max: VisuallyUnambigiousCharactersGenerator.chars.length - 1,
            })
          ]
      )
      .join('');
  }
}
