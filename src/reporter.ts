import { formatISO } from 'date-fns';

export class Reporter {
  private static getTimestamp() {
    return formatISO(new Date());
  }

  static info(...args: string[]) {
    const ts = Reporter.getTimestamp();
    console.log(`[ info ][${ts}]`, ...args);
  }

  static success(...args: string[]) {
    const ts = Reporter.getTimestamp();
    console.log(`[ success ][${ts}]`, ...args);
  }

  static error(message: string, options?: { quit: boolean }) {
    const ts = Reporter.getTimestamp();
    console.log(`[ error ][${ts}]`, message);

    if (options?.quit) {
      process.exit(1);
    }
  }

  static raw(label: string, arg: any) {
    const ts = Reporter.getTimestamp();
    console.log(`[ raw ][${ts}]`, `\n${label}\n`, JSON.stringify(arg));
  }
}
