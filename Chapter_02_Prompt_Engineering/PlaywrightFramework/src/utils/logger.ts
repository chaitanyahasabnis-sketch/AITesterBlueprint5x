type Level = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

/** Structured logger. Every line is also kept in memory so fixtures can attach it to Allure. */
export class Logger {
  private readonly lines: string[] = [];

  constructor(private readonly scope: string) {}

  info(message: string): void {
    this.write('INFO', message);
  }

  warn(message: string): void {
    this.write('WARN', message);
  }

  error(message: string): void {
    this.write('ERROR', message);
  }

  debug(message: string): void {
    this.write('DEBUG', message);
  }

  /** Full log for this scope, newline separated. */
  dump(): string {
    return this.lines.join('\n');
  }

  private write(level: Level, message: string): void {
    const line = `${new Date().toISOString()} [${level}] [${this.scope}] ${message}`;
    this.lines.push(line);
    if (level === 'ERROR') console.error(line);
    else if (process.env.DEBUG_LOGS === 'true' || level === 'WARN') console.log(line);
  }
}
