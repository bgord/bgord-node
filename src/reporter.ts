export class Reporter {
  info(...args: string[]) {
    console.log("[ info ] ", ...args);
  }

  success(...args: string[]) {
    console.log("[ success ]", ...args);
  }

  error(message: string, options?: { quit: boolean }) {
    console.log("  [error]", message);

    if (options?.quit) {
      process.exit(1);
    }
  }
}
