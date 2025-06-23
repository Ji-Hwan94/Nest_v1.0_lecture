import { Logger as TypeOrmLogger } from 'typeorm';
import { Logger as NestLogger } from '@nestjs/common';

export class TypeormLoggerMiddleware implements TypeOrmLogger {
  private readonly logger = new NestLogger('SQL');

  logQuery(query: string, parameters?: any[]) {
    this.logger.log(
      `\n=== Query ===\n${this.formatQuery(query)}\n=== Parameters ===\n${
        parameters ? JSON.stringify(parameters, null, 2) : 'No parameters'
      }\n============\n`,
    );
  }

  private formatQuery(query: string): string {
    const keywords = [
      'SELECT',
      'FROM',
      'WHERE',
      'LIMIT',
      'ORDER BY',
      'GROUP BY',
      'AND',
      'OR',
    ];

    return query
      .split('\n')
      .map((line) => line.trim())
      .join(' ')
      .replace(/\s+/g, ' ') // 연속된 공백을 하나로
      .replace(/`/g, '') // 백틱 제거
      .replace(new RegExp(`(${keywords.join('|')})`, 'g'), '\n$1') // 키워드 앞에 줄바꿈
      .replace(/,/g, ',\n  ') // 컬럼 구분을 위한 줄바꿈
      .trim();
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    this.logger.error(
      `Query Error: ${error}\nQuery: ${query}\nParameters: ${JSON.stringify(
        parameters,
      )}`,
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn(
      `Slow Query (${time}ms)\nQuery: ${query}\nParameters: ${JSON.stringify(
        parameters,
      )}`,
    );
  }

  logMigration(message: string) {
    this.logger.log(message);
  }

  logSchemaBuild(message: string) {
    this.logger.log(message);
  }

  log(level: 'log' | 'info' | 'warn', message: string) {
    if (level === 'log') this.logger.log(message);
    if (level === 'info') this.logger.debug(message);
    if (level === 'warn') this.logger.warn(message);
  }
}
