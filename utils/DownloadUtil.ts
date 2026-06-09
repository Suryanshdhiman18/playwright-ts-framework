import * as fs from 'fs';
import * as path from 'path';
import { Download } from '@playwright/test';

export class DownloadUtil {

    static async saveDownload(
        download: Download,
        folder: string = 'downloads'
    ) {

        if (
            !fs.existsSync(folder)
        ) {

            fs.mkdirSync(
                folder,
                { recursive: true }
            );
        }

        const fileName =
            download.suggestedFilename();

        const filePath =
            path.join(
                folder,
                fileName
            );
            
        await download.saveAs(
            filePath
        );

        return filePath;
    }

    static fileExists(
        filePath: string
    ): boolean {

        return fs.existsSync(
            filePath
        );
    }

    static deleteFile(
        filePath: string
    ): void {

        if (
            fs.existsSync(
                filePath
            )
        ) {

            fs.unlinkSync(
                filePath
            );
        }
    }
}