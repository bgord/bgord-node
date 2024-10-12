import { noop } from "../noop";

type ServerType = ReturnType<typeof Bun.serve>;

export class GracefulShutdown {
  private static async shutdown(
    server: ServerType,
    callback: () => any = noop
  ) {
    server.stop();
    await callback();
    // biome-ignore lint: lint/suspicious/noConsoleLog
    console.log("HTTP server closed");
  }

  static applyTo(server: ServerType, callback: () => any = noop) {
    process.on("SIGTERM", async () => {
      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log("SIGTERM signal received: closing HTTP server");
      await GracefulShutdown.shutdown(server, callback);
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log("SIGINT signal received: closing HTTP server");
      await GracefulShutdown.shutdown(server, callback);
      process.exit(0);
    });

    process.on("unhandledRejection", async (event) => {
      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log(
        "UnhandledPromiseRejectionWarning received: closing HTTP server"
      );

      // biome-ignore lint: lint/suspicious/noConsoleLog
      console.log(JSON.stringify(event));

      await GracefulShutdown.shutdown(server, callback);
      process.exit(1);
    });
  }
}
