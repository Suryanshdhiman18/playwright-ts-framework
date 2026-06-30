import {
    Locator,
    Page,
    expect
} from '@playwright/test';

export class UploadCatalogModal {

    readonly page: Page;

    readonly fileInput: Locator;

    readonly uploadButton: Locator;

    readonly uploadValidRecordsButton: Locator;

    readonly validationMessage: Locator;

    readonly errorBanner: Locator;

    readonly downloadErrorButton: Locator;

    readonly cancelUploadButton: Locator;

    constructor(page: Page) {

        this.page = page;

        this.fileInput =
            page.locator(
                "//input[@type='file']"
            );

        this.uploadButton =
            page.getByRole(
                'button',
                {
                    name: 'Upload',
                    exact: true
                }
            );

        this.uploadValidRecordsButton =
            page.getByRole(
                'button',
                {
                    name: 'Upload Valid Records'
                }
            );

        this.validationMessage =
            page.locator(
                "//*[contains(text(),'catalog file was successfully validated')]"
            );

        this.errorBanner =
            page.locator(
                "//*[contains(text(),'The Upload process was unsuccessful')]"
            );

        this.downloadErrorButton =
            page.getByRole(
                'button',
                {
                    name: 'Download Records with Errors'
                }
            );

        this.cancelUploadButton =
            page.getByRole(
                'button',
                {
                    name: 'Cancel Upload'
                }
            );
    }

    async uploadFile(filePath: string) {

        await this.fileInput.setInputFiles(filePath);
    }

    async clickUpload() {

        await this.uploadButton.click();
    }

    async waitForValidationSuccess() {

        await expect(this.validationMessage).toBeVisible({timeout: 120000});
    }

    async waitForPartialValidation() {

        await expect(this.downloadErrorButton).toBeVisible({timeout: 120000});

        await expect(this.uploadValidRecordsButton).toBeVisible({timeout: 120000});
    }

    async waitForUploadFailure() {

        await expect(this.errorBanner).toBeVisible({timeout: 120000});
    }

    async clickUploadValidRecords() {

        await this.uploadValidRecordsButton.click();
    }

    async downloadErrorRecords() {

        await this.downloadErrorButton.click();
    }

    async cancelUpload() {

        await this.cancelUploadButton.click();
    }
}