export class Logger {

    private static readonly RESET = '\x1b[0m';

    private static readonly GREEN = '\x1b[32m';

    private static readonly BRIGHT_GREEN = '\x1b[92m';

    private static readonly YELLOW = '\x1b[33m';

    private static readonly RED = '\x1b[31m';

    private static readonly CYAN = '\x1b[36m';

    private static readonly MAGENTA = '\x1b[35m';

    static info(message: string) {

        console.log(
            `${this.GREEN}[INFO] ${message}${this.RESET}`
        );
    }

    static success(message: string) {

        console.log(
            `${this.BRIGHT_GREEN}[PASS] ${message}${this.RESET}`
        );
    }

    static warn(message: string) {

        console.log(
            `${this.YELLOW}[WARN] ${message}${this.RESET}`
        );
    }

    static error(message: string) {

        console.log(
            `${this.RED}[ERROR] ${message}${this.RESET}`
        );
    }

    static debug(message: string) {

        console.log(
            `${this.CYAN}[DEBUG] ${message}${this.RESET}`
        );
    }

    static step(message: string) {

        console.log(
            `${this.MAGENTA}[STEP] ${message}${this.RESET}`
        );
    }
}