import { test, expect } from '@playwright/test';

import { LoginPage } from '../../pages/common/LoginPage';

import { SidebarComponent } from '../../pages/common/SidebarComponent';

import { P360SearchPage } from '../../pages/p360/P360SearchPage';

import { P360ResultsPage } from '../../pages/p360/P360ResultsPage';

import { ProductDetailPage } from '../../pages/p360/ProductDetailPage';

import { ExcelReader } from '../../utils/ExcelReader';

import { ExcelWriter } from '../../utils/ExcelWriter';

import { Logger } from '../../utils/Logger';

import { ScreenshotUtil } from '../../utils/ScreenshotUtil';

import { P360Breadcrumb } from '../../pages/common/P360Breadcrumb';

import { ProductSearchValidator } from '../../utils/ProductSearchValidator';

import { DownloadUtil } from '../../utils/DownloadUtil';

import { ProductDetailValidator } from '../../utils/ProductDetailValidator';

import { PerformanceUtil } from '../../utils/PerformanceUtil';

const filePath = 'test-data/P360_TestCases.xlsx';

const sheetName = 'Sheet1';

const testData = ExcelReader.readTestData(filePath, sheetName);

test.setTimeout(15 * 60 * 1000);

test('P360 Product Search Flow',

    async ({ page }) => {

        const loginPage = new LoginPage(page);

        const sidebar = new SidebarComponent(page);

        const searchPage = new P360SearchPage(page);

        const resultsPage = new P360ResultsPage(page);

        const detailPage = new ProductDetailPage(page);

        const breadcrumb = new P360Breadcrumb(page);

        // ---------------- Login ----------------

        Logger.info('Opening application');

        await page.goto('/');

        if (!process.env.APP_USERNAME || !process.env.APP_PASSWORD) {
            throw new Error('USERNAME or PASSWORD missing from .env');
        }

        await loginPage.login(process.env.APP_USERNAME!, process.env.APP_PASSWORD!);

        Logger.info('Login completed successfully');

        // ---------------- Navigate To P360 ----------------

        await expect(sidebar.p360Icon).toBeVisible({ timeout: 30000 });

        await sidebar.goToP360();

        // ---------------- Execute Test Data ----------------

        for (const data of testData as any[]) {

            let actualResult = '';

            let searchApiTime = 0;

            let detailApiTime = 0;

            let pageLoadTime = 0;

            if (
                data.Execute !== 'YES'
            ) {
                Logger.info(`Skipping Test Case: ${data.TC_ID}`);

                continue;
            }

            try {
                Logger.step(`Executing Test Case: ${data.TC_ID}`);

                // ---------- Verify Search Page ----------

                await searchPage.verifyP360Loaded();

                // ---------- Select Search Type ----------

                await searchPage.selectSearchType(data.SearchType);

                // ---------- Search Product ----------

                await searchPage.searchProduct(data.SearchType, data.SearchValue);


                // ---------- Wait For Search API ----------

                const responsePromise =
                    page.waitForResponse(
                        response =>
                            response.url().includes(
                                'GetProduct360SearchResults'
                            )
                            &&
                            response.status() === 200
                    );

                const detailApiPromise =
                    data.SearchType === 'UPC'
                        ? page.waitForResponse(
                            response =>
                                response.url().includes(
                                    'LoadProduct360ViewV5'
                                )
                                &&
                                response.status() === 200
                        )
                        : null;

                          // ----------- Api Performance ----------

                const searchApiStartTime = Date.now();

                await searchPage.clickSearch();

                // ---------- Capture API Response ----------

                const response = await responsePromise;

                searchApiTime = Date.now() - searchApiStartTime;

                Logger.info(`Search API Response Time: ${searchApiTime} ms`);

                const responseBody = await response.json();

                Logger.info(`Total API Results: ${responseBody.NumberOfResults}`);

                Logger.info(`Search executed for: ${data.SearchValue}`);

                // ---------- Flow Based On Search Type ----------

                let detailBody: any;
                let requestBody: any;

                if (data.SearchType === 'UPC') {

                    Logger.info('UPC Search → Direct Product Detail Page');

                    const detailApiStartTime = Date.now();

                    const detailResponse = await detailApiPromise!;

                    detailApiTime = Date.now() - detailApiStartTime;

                    Logger.info(`Detail API Response Time: ${detailApiTime} ms`);

                    detailBody = await detailResponse.json();

                    requestBody = detailResponse.request().postDataJSON();

                    console.log('REQUEST BODY:', requestBody);

                    const searchProduct = responseBody.Results[0];

                    // API → API Validation

                    expect(detailBody.Product360CardInfo.SK_DimUPC).toBe(searchProduct.SK_DimUPC);

                    expect(detailBody.Product360CardInfo.UPCCode).toBe(searchProduct.UPCCode);

                    expect(detailBody.Product360CardInfo.Description).toBe(searchProduct.Description);

                    expect(detailBody.Product360CardInfo.Brand).toBe(searchProduct.Brand);

                    expect(detailBody.Product360CardInfo.Manufacturer).toBe(searchProduct.Manufacturer);

                    Logger.info(`SK_DIMUPC: ${detailBody.Product360CardInfo.SK_DimUPC}`);

                    Logger.info(`UPC: ${detailBody.Product360CardInfo.UPCCode}`);

                    Logger.info(`Brand: ${detailBody.Product360CardInfo.Brand}`);

                    Logger.info(`Manufacturer: ${detailBody.Product360CardInfo.Manufacturer}`);

                    // ----------------------- API Performance ------------------

                    const pageLoadStartTime = Date.now();

                    await detailPage.verifyProductLoaded();

                    pageLoadTime = Date.now() - pageLoadStartTime;

                    Logger.info(`Product Detail Page Load Time: ${pageLoadTime} ms`);

                    // expect(searchApiTime).toBeLessThan(5000);

                    // expect(detailApiTime).toBeLessThan(5000);

                    // expect(pageLoadTime).toBeLessThan(10000);

                    const SEARCH_API_THRESHOLD = 5000;
                    const DETAIL_API_THRESHOLD = 5000;
                    const PAGE_LOAD_THRESHOLD = 10000;

                    if (searchApiTime > SEARCH_API_THRESHOLD) {
                        Logger.warn(
                            `Search API exceeded threshold: ${searchApiTime} ms`
                        );
                    }

                    if (detailApiTime > DETAIL_API_THRESHOLD) {
                        Logger.warn(
                            `Detail API exceeded threshold: ${detailApiTime} ms`
                        );
                    }

                    if (pageLoadTime > PAGE_LOAD_THRESHOLD) {
                        Logger.warn(
                            `Page Load exceeded threshold: ${pageLoadTime} ms`
                        );
                    }

                    // await detailPage.verifyProductLoaded();

                    // Search Input Validation

                    expect(responseBody.Results[0].UPCCode.replace(/^0+/, ''))
                        .toBe(String(data.SearchValue).replace(/^0+/, ''));

                    Logger.info('UPC API Validation Passed');
                }
                else {

                    Logger.info('Description Search → Results Page');

                    await resultsPage.verifyResultsDisplayed();

                    const resultCount = responseBody.NumberOfResults;

                    Logger.info(`Results displayed: ${resultCount}`);

                    expect(resultCount).toBeGreaterThan(0);

                    console.debug('Before Open Product');

                    const detailApiPromise =
                        page.waitForResponse(
                            response =>
                                response.url().includes(
                                    'LoadProduct360ViewV5'
                                )
                                &&
                                response.status() === 200
                        );

                    // await resultsPage.openFirstProduct();

                    // console.log('After Open Product');

                    const detailApiStartTime = Date.now();

                    await resultsPage.openFirstProduct();

                    console.debug("After Open Product");

                    const detailResponse = await detailApiPromise;

                    detailApiTime = Date.now() - detailApiStartTime;

                    Logger.info(`Detail API Response Time: ${detailApiTime} ms`);

                    detailBody = await detailResponse.json();

                    requestBody = detailResponse.request().postDataJSON();

                    const searchProduct = responseBody.Results[0];

                    ProductDetailValidator.validateProductDetail(searchProduct, requestBody, detailBody);

                    Logger.info(`SK_DIMUPC: ${requestBody.SK_DIMUPC}`);

                    Logger.info(`UPC: ${detailBody.Product360CardInfo.UPCCode}`);

                    Logger.info(`Brand: ${detailBody.Product360CardInfo.Brand}`);

                    Logger.info(`Manufacturer: ${detailBody.Product360CardInfo.Manufacturer}`);

                    const pageLoadStartTime = Date.now();

                    await detailPage.verifyProductLoaded();

                    pageLoadTime = Date.now() - pageLoadStartTime;

                    Logger.info(`Product Detail Page Load Time: ${pageLoadTime} ms`);
                }

                // ---------- Validate Product Detail ----------

                const description = await detailPage.getProductDescription();

                Logger.info(`Product Description: ${description}`);

                // expect(description)
                //     .not.toBe('');

                expect(description?.trim()).toBe(detailBody.Product360CardInfo.Description.trim());

                expect(description).not.toBeNull();

                // ---------- Export Validation ----------

                const download = await detailPage.exportSearchResults();

                Logger.info(`Downloaded File Name: ${download.suggestedFilename()}`);

                const downloadFilePath = await DownloadUtil.saveDownload(download);

                expect(DownloadUtil.fileExists(downloadFilePath)).toBeTruthy();

                Logger.info(`Export Downloaded: ${downloadFilePath}`);

                // ---------- Validate File Type ----------

                expect(downloadFilePath).toMatch(/\.(xlsx|csv)$/i);

                Logger.success('Export Validation Passed');

                // ---------- Update Excel PASS ----------

                // ExcelWriter.updateResult(filePath, sheetName, data.TC_ID, `Results displayed successfully for ${data.SearchValue}`, 'PASS');

                actualResult =
                    `Results displayed successfully for ${data.SearchValue}`;

                ExcelWriter.updateResult(
                    filePath,
                    sheetName,
                    data.TC_ID,
                    actualResult,
                    'PASS',
                    searchApiTime,
                    detailApiTime,
                    pageLoadTime
                );

                Logger.success(`Test Passed: ${data.TC_ID}`);

                // ---------- Navigate Back ----------

                // ---------- Reset To Search Page ----------

                try {

                    const isLastTestCase = data === testData[testData.length - 1];

                    if (!isLastTestCase) {

                        await breadcrumb.goToSearchPage();

                        await searchPage.verifyP360Loaded();

                        await page.waitForLoadState('networkidle');
                    }

                }
                catch {
                    Logger.error('Navigation reset failed');
                }

            }
            catch (error: any) {

                Logger.error(`Test Failed: ${data.TC_ID}`);

                Logger.error(error.message);

                // ---------- Screenshot ----------

                await ScreenshotUtil.capture(page, data.TC_ID);

                // ---------- Update Excel FAIL ----------

                // ExcelWriter.updateResult(filePath, sheetName, data.TC_ID, error.message, 'FAIL');

                ExcelWriter.updateResult(
                    filePath,
                    sheetName,
                    data.TC_ID,
                    error.message,
                    'FAIL',
                    searchApiTime,
                    detailApiTime,
                    pageLoadTime
                );

                // ---------- Reset Navigation ----------

                try {
                    await breadcrumb.goToSearchPage();

                    await searchPage.verifyP360Loaded();

                    await page.waitForLoadState('networkidle');
                }
                catch {
                    Logger.error('Navigation reset failed');
                }
            }
        }
    }
);