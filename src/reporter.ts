export class Reporter {
  static info(...args: string[]) {
    console.log('[ info ] ', ...args);
  }

  static success(...args: string[]) {
    console.log('[ success ]', ...args);
  }

  static error(message: string, options?: { quit: boolean }) {
    console.log('  [error]', message);

    if (options?.quit) {
      process.exit(1);
    }
  }
}
