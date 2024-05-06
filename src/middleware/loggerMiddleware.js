import chalk from 'chalk';
import onFinished from 'on-finished';

const loggerMiddleware = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const startTime = Date.now();

    let styledMethod;
    switch (method) {
        case 'GET':
            styledMethod = chalk.green.bold(method);
            break;
        case 'POST':
            styledMethod = chalk.yellow.bold(method);
            break;
        case 'PUT':
            styledMethod = chalk.blue.bold(method);
            break;
        case 'DELETE':
            styledMethod = chalk.red.bold(method);
            break;
        default:
            styledMethod = chalk.bgRed.bold(method);
            break;
    }

    const styledUrl = chalk.bgBlackBright(url);

    onFinished(res, function (err, res) {
        const time = Date.now() - startTime;
        const code = res.statusCode;
        const contentLength = res.getHeader('content-length');

        const styledTime = time > 1000 ? chalk.bgRedBright.black(`(${time}ms)`) : chalk.gray(`(${time}ms)`);

        let styledCode;
        if (code >= 200 && code < 400) {
            styledCode = chalk.green(code);
        } else if (code >= 400) {
            styledCode = chalk.red(code);
        } else {
            styledCode = chalk.gray(code);
        }

        const styledContentLength = chalk.gray(contentLength);

        console.log(styledMethod, styledUrl, styledCode, styledContentLength, styledTime);
    });
    next();
};

export default loggerMiddleware;
