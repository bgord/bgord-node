import express from 'express';

export class Redirector {
  static build(path: string) {
    return (_request: express.Request, response: express.Response) =>
      response.redirect(path);
  }
}
