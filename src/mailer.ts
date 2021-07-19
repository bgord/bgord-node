import nodemailer, { SendMailOptions } from 'nodemailer';

import {
  SmtpHostType,
  SmtpPortType,
  SmtpUserType,
  SmtpPassType,
} from './schema';

type MailerConfigType = {
  SMTP_HOST: SmtpHostType;
  SMTP_PORT: SmtpPortType;
  SMTP_USER: SmtpUserType;
  SMTP_PASS: SmtpPassType;
};

export class Mailer {
  private transport: nodemailer.Transporter;

  constructor(config: MailerConfigType) {
    this.transport = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }

  send(options: SendMailOptions): Promise<unknown> {
    return this.transport.sendMail(options);
  }
}
