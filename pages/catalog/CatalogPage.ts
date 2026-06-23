import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../../utils/Logger';

export class CatalogPage {

    readonly page: Page;

    readonly uploadCatalogButton: Locator;

    readonly cancelUploadButton: Locator;

    constructor(page: Page) {

        this.page = page;

        this.uploadCatalogButton =
            page.locator(
                '//button[.//span[contains(text(),"Upload Catalog")]]'
            );

        this.cancelUploadButton =
            page.locator(
                '//button//span[normalize-space()="Cancel Upload"]'
            );
    }

    async openUploadCatalogModal() {

        Logger.info('Opening Upload Catalog modal');

        if (
            await this.cancelUploadButton.isVisible().catch(() => false)
        ) {

            await this.cancelUploadButton.click();

            Logger.info('Previous upload panel closed');
        }
        else {

            Logger.info('No previous upload panel found');
        }

        await this.uploadCatalogButton.click();

        Logger.info('Upload Catalog button clicked');
    }
}