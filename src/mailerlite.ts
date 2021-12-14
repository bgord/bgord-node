import axios from 'axios';

import {
  EmailType,
  MailerliteGroupIdType,
  MailerliteApiKeyType,
} from './schema';

type MailerliteConfigType = {
  groupId: MailerliteGroupIdType;
  apiKey: MailerliteApiKeyType;
};

export class Mailerlite {
  groupId: MailerliteGroupIdType;
  apiKey: MailerliteApiKeyType;

  constructor(config: MailerliteConfigType) {
    this.groupId = config.groupId;
    this.apiKey = config.apiKey;
  }

  async addToGroup(email: EmailType) {
    return axios.post(
      `https://api.mailerlite.com/api/v2/groups/${this.groupId}/subscribers`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': this.apiKey,
        },
      }
    );
  }

  async removeFromGroup(email: EmailType) {
    return axios.delete(
      `https://api.mailerlite.com/api/v2/groups/${this.groupId}/subscribers/${email}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': this.apiKey,
        },
      }
    );
  }
}
