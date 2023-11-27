import express from 'express';
import { describe, test, expect } from 'vitest';
import request from 'supertest';

import { DownloadFile, DownloadFileConfigType } from '../src/download-file';
import { Mime } from '../src/mime';

const plainText = new Mime('text/plain');
const pdfText = new Mime('application/pdf');

describe('DownloadFile middleware', () => {
  test('sets Content-Disposition and Content-Type headers', async () => {
    const app = express();

    const config: DownloadFileConfigType = {
      filename: 'example.txt',
      mime: plainText,
    };

    app.get('/download', (_request, response) => {
      DownloadFile.attach(response, config);
      response.status(200).send('File content');
    });

    const result = await request(app)
      .get('/download')
      .expect(200);

    expect(result.header['content-disposition']).toBe(
      `attachment; filename="${config.filename}"`
    );
    expect(result.header['content-type']).toBe(
      `${config.mime.raw}; charset=utf-8`
    );
  });

  test('handles special characters in filename', async () => {
    const app = express();

    const config: DownloadFileConfigType = {
      filename: 'file with spaces & special characters.txt',
      mime: plainText,
    };

    app.get('/download', (_request, response) => {
      DownloadFile.attach(response, config);
      response.status(200).send('File content');
    });

    const result = await request(app)
      .get('/download')
      .expect(200);

    const expectedContentDisposition = `attachment; filename="${config.filename}"`;
    expect(result.header['content-disposition']).toBe(
      expectedContentDisposition
    );
    expect(result.header['content-type']).toBe(
      `${config.mime.raw}; charset=utf-8`
    );
  });

  test('handles different MIME types', async () => {
    const app = express();

    const config: DownloadFileConfigType = {
      filename: 'example.pdf',
      mime: pdfText,
    };

    app.get('/download', (_request, response) => {
      DownloadFile.attach(response, config);
      response.status(200).send('PDF content');
    });

    const result = await request(app)
      .get('/download')
      .expect(200);

    const expectedContentDisposition = `attachment; filename="${config.filename}"`;
    expect(result.header['content-disposition']).toBe(
      expectedContentDisposition
    );
    expect(result.header['content-type']).toBe(
      `${config.mime.raw}; charset=utf-8`
    );
  });
});
