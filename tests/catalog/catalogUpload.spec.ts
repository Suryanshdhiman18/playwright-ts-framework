import { test, expect } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage';
import { SidebarComponent } from '../../pages/common/SidebarComponent';
import { CatalogPage } from '../../pages/catalog/CatalogPage';
import { UploadCatalogModal } from '../../pages/catalog/UploadCatalogModal';

import { ExcelReader } from '../../utils/ExcelReader';
import { ExcelWriter } from '../../utils/ExcelWriter';
import { Logger } from '../../utils/Logger';
import { ScreenshotUtil } from '../../utils/ScreenshotUtil';
import { DownloadUtil } from '../../utils/DownloadUtil';
import { CatalogUploadData } from '../../models/CatalogUploadData';

test(
    'Catalog Upload Flow',
    async ({ page }) => {

        const loginPage = new LoginPage(page);

        const sidebar = new SidebarComponent(page);

        const catalogPage = new CatalogPage(page);

        const uploadModal = new UploadCatalogModal(page);

        const filePath = 'test-data/Catalog_TestCases.xlsx';

        const sheetName = 'CatalogUpload';

        const testData = ExcelReader.readTestData(filePath, sheetName) as any[];

        Logger.info('Opening application');

        await page.goto('/');

        if (!process.env.APP_USERNAME || !process.env.APP_PASSWORD) {

            throw new Error(
                'APP_USERNAME or APP_PASSWORD missing from .env'
            );
        }

        await loginPage.login(
            process.env.APP_USERNAME,
            process.env.APP_PASSWORD
        );

        Logger.info('Login completed successfully');

        await sidebar.goToCatalog();

        Logger.info('Catalog module opened successfully');

        for (const data of testData) {

            try {

                Logger.info(`Executing Test Case: ${data.TC_ID}`);

                const catalogFilePath = `test-data/catalog-files/${data.FileName}`;

                let actualResult = '';

                await catalogPage.openUploadCatalogModal();

                await uploadModal.uploadFile(catalogFilePath
                );

                Logger.info(`Uploaded file: ${data.FileName}`);

                await uploadModal.clickUpload();

                switch (data.Scenario) {

                    case 'VALID':

                        await uploadModal.waitForValidationSuccess();

                        await uploadModal.clickUploadValidRecords();

                        actualResult = 'Catalog uploaded successfully';

                        Logger.info(
                            'Valid records uploaded successfully'
                        );

                        break;

                    case 'PARTIAL':

                        await uploadModal.waitForPartialValidation();

                        const downloadPromise = page.waitForEvent('download');

                        await uploadModal
                            .downloadErrorRecords();

                        const download =
                            await downloadPromise;

                        const downloadedFile =
                            await DownloadUtil
                                .saveDownload(
                                    download
                                );

                        expect(
                            DownloadUtil.fileExists(
                                downloadedFile
                            )
                        ).toBeTruthy();

                        Logger.info(
                            `Downloaded Error File: ${downloadedFile}`
                        );

                        await uploadModal
                            .clickUploadValidRecords();

                        actualResult =
                            'Partial upload successful';

                        Logger.info(
                            'Valid records uploaded from partial file'
                        );

                        break;

                    case 'INVALID':

                        await uploadModal
                            .waitForUploadFailure();

                        actualResult =
                            'Upload validation failed as expected';

                        Logger.info(
                            'Invalid file validation failed as expected'
                        );

                        break;

                    default:

                        throw new Error(
                            `Unknown Scenario: ${data.Scenario}`
                        );
                }

                ExcelWriter.updateResult(filePath, sheetName, data.TC_ID, actualResult, 'PASS');

                Logger.info(`Test Passed: ${data.TC_ID}`);
            }
            catch (error: any) {

                Logger.error(`Test Failed: ${data.TC_ID}`);

                Logger.error(error.message);

                await ScreenshotUtil.capture(page, data.TC_ID);

                ExcelWriter.updateResult(filePath, sheetName, data.TC_ID, error.message, 'FAIL');
            }
        }
    }
);