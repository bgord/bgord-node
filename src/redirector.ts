import { Middbg.leware } from './middleware';

export class Redirector {
  static build(path: string) {
    return Middleware((_request, response) => response.redirect(path));
  }
}
