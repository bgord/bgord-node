export function sleep(config: { ms: number }) {
  return new Promise(resolve => setTimeout(resolve, config.ms));
}
