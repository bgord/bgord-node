import type { MimeRawType } from './mime';

export const MIME_TYPES: Record<string, MimeRawType[]> = {
  wildcard: [ '*/*' ],
  jpeg: [ 'image/jpeg' ],
  png: [ 'image/png' ],
  wav: ['audio/x-wav', 'audio/wav'],
  mp4: [ 'video/mp4' ],
};
