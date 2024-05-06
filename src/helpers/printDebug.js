
import chalk from 'chalk';

class OutputTypeDebug {
    static INFORMATION = 'INFORMATION';
    static SUCCESS = 'SUCCESS';
    static WARNING = 'WARNING';
    static ERROR = 'ERROR';
}

const printDebug = (message, outputTypeDebug) => {
    switch (outputTypeDebug) {
        case OutputTypeDebug.INFORMATION:
            process.env.NODE_ENV !== 'production' && console.log(chalk.white(message));
            break;
        case OutputTypeDebug.SUCCESS:
            process.env.NODE_ENV !== 'production' && console.log(chalk.green(message));
            break;
        case OutputTypeDebug.WARNING:
            process.env.NODE_ENV !== 'production' && console.log(chalk.yellow(message));
            break;
        case OutputTypeDebug.ERROR:
            process.env.NODE_ENV !== 'production' && console.log(chalk.red(message));
            break;
        default:
            process.env.NODE_ENV !== 'production' && console.log(chalk.while(message));
    }
};

export { OutputTypeDebug, printDebug };
