export class PerformanceUtil {

    static measureTime(
        startTime: number
    ): number {
        return Date.now() - startTime;
    }
}