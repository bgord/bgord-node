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

type MailerSendOptionsType = SendMailOptions;

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

  async send(options: MailerSendOptionsType): Promise<unknown> {
    return this.transport.sendMail(options);
  }

  async verify() {
    return this.transport.verify();
  }
}
