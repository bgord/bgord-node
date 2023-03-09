import express from 'express';

export class ResponseBodyInLocals {
  static applyTo(app: express.Application): void {
    app.use((_request, response, next) => {
      const oldJson = response.json;

      response.json = body => {
        response.locals.body = body;

        return oldJson.call(response, body);
      };

      next();
    });
  }
}
