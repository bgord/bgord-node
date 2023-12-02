import nodemailer from 'nodemailer';
import { describe, test, expect, vi } from 'vitest';
import { Mailer } from '../src/mailer';

describe('Mailer class', () => {
  test('Mailer can be instantiated with valid configuration', () => {
    const spy = vi.spyOn(nodemailer, 'createTransport');

    const validConfig = {
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: 587,
      SMTP_USER: 'user@example.com',
      SMTP_PASS: 'password',
    };

    const mailer = new Mailer(validConfig);

    expect(mailer).toBeInstanceOf(Mailer);
    spy.mockRestore();
  });

  test('Mailer sends email using send method', async () => {
    const sendMail = vi.fn();

    const spy = vi
      .spyOn(nodemailer, 'createTransport')
      .mockImplementation(() => ({ sendMail } as any));

    const mailer = new Mailer({
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: 587,
      SMTP_USER: 'user@example.com',
      SMTP_PASS: 'password',
    });

    const sendOptions = {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Test Email',
      text: 'This is a test email.',
    };

    await mailer.send(sendOptions);

    expect(sendMail).toHaveBeenCalledWith(sendOptions);

    spy.mockRestore();
  });

  test('Mailer verifies the configuration using verify method', async () => {
    const verify = vi.fn();

    const spy = vi
      .spyOn(nodemailer, 'createTransport')
      .mockImplementation(() => ({ verify } as any));

    const mailer = new Mailer({
      SMTP_HOST: 'smtp.example.com',
      SMTP_PORT: 587,
      SMTP_USER: 'user@example.com',
      SMTP_PASS: 'password',
    });

    await mailer.verify();

    expect(verify).toHaveBeenCalled();

    spy.mockRestore();
  });
});
