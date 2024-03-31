import chalk from 'chalk';

export const logger = {
  info: (...messages) => console.log(chalk.italic.cyanBright(messages.join(' '))),
  success: (...messages) => console.log(chalk.italic.green('\n✨ ' + messages.join(' ') + ' \n')),
  error: (...messages) => console.log(chalk.italic.red(messages.join(' '))),
  warn: (...messages) => console.log(chalk.italic.yellow(messages.join(' '))),
};
