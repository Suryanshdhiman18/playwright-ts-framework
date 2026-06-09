import { test, expect }
from '@playwright/test';

import { LoginPage }
from '../../pages/LoginPage';

import { SidebarComponent }
from '../../pages/common/SidebarComponent';

import { P360SearchPage }
from '../../pages/p360/P360SearchPage';

import { P360ResultsPage }
from '../../pages/p360/P360ResultsPage';

import { ProductDetailPage }
from '../../pages/p360/ProductDetailPage';

import { ExcelReader }
from '../../utils/ExcelReader';

import { ExcelWriter }
from '../../utils/ExcelWriter';

import { Logger }
from '../../utils/Logger';

import { ScreenshotUtil }
from '../../utils/ScreenshotUtil';

import { P360Breadcrumb }
from '../../pages/common/P360Breadcrumb';

import { ProductSearchValidator }
from '../../utils/ProductSearchValidator';

import { DownloadUtil } 
from '../../utils/DownloadUtil';

const filePath =
    'test-data/P360_TestCases.xlsx';

const sheetName =
    'Sheet1';

const testData =
    ExcelReader.readExcel(
        filePath,
        sheetName
    );

test.setTimeout(
    15 * 60 * 1000
);

test(
    'P360 Product Search Flow',

    async ({ page }) => {

        const loginPage =
            new LoginPage(page);

        const sidebar =
            new SidebarComponent(page);

        const searchPage =
            new P360SearchPage(page);

        const resultsPage =
            new P360ResultsPage(page);

        const detailPage =
            new ProductDetailPage(page);

        const breadcrumb =
            new P360Breadcrumb(page);

        // ---------------- Login ----------------

        Logger.info(
            'Opening application'
        );

        await page.goto('/');

        await loginPage.login(
            'suryansh.dhiman@rdsolutions.in',
            'Suryansh@Ryzen#S'
        );

        Logger.info(
            'Login completed successfully'
        );

        // ---------------- Navigate To P360 ----------------

        await expect(
            sidebar.p360Icon
        ).toBeVisible({
            timeout: 30000
        });

        await sidebar.goToP360();

        // ---------------- Execute Test Data ----------------

        for (const data of testData as any[]) {

            if (
                data.Execute !== 'YES'
            ) {

                Logger.info(
                    `Skipping Test Case: ${data.TC_ID}`
                );

                continue;
            }

            try {

                Logger.info(
                    `Executing Test Case: ${data.TC_ID}`
                );

                // ---------- Verify Search Page ----------

                await searchPage
                    .verifyP360Loaded();

                // ---------- Select Search Type ----------

                await searchPage
                    .selectSearchType(
                        data.SearchType
                    );

                // ---------- Search Product ----------

                await searchPage
                    .searchProduct(
                        data.SearchType,
                        data.SearchValue
                    );

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

                await searchPage
                    .clickSearch();

                    // ---------- Capture API Response ----------

                const response =
                    await responsePromise;

                const responseBody =
                    await response.json();

                Logger.info(
                    `Total API Results: ${responseBody.NumberOfResults}`
                );

                Logger.info(
                    `Search executed for: ${data.SearchValue}`
                );

                // ---------- Flow Based On Search Type ----------

                if (
                    data.SearchType === 'UPC'
                ) {

                    Logger.info(
                        'UPC Search → Direct Product Detail Page'
                    );

                    await detailPage
                        .verifyProductLoaded();

                    // Validate UPC

                    expect(
                        responseBody.Results[0]
                            .UPCCode
                            .replace(/^0+/, '')
                    )
                        .toBe(
                            String(data.SearchValue)
                                .replace(/^0+/, '')
                        );
                }
                else {

                    Logger.info(
                        'Description Search → Results Page'
                    );

                    await resultsPage
                        .verifyResultsDisplayed();

                    const resultCount =
                        responseBody.NumberOfResults;

                    Logger.info(
                        `Results displayed: ${resultCount}`
                    );

                    expect(resultCount)
                        .toBeGreaterThan(0);

                    console.log(
                        'Before Open Product'
                    );

                    await resultsPage
                        .openFirstProduct();

                    console.log(
                        'After Open Product'
                    );

                    await detailPage
                        .verifyProductLoaded();
                }

               // ---------- Validate Product Detail ----------

                const description =
                    await detailPage
                        .getProductDescription();

                Logger.info(
                    `Product Description: ${description}`
                );

                expect(description)
                    .not.toBe('');

                expect(description)
                    .not.toBeNull();

                // ---------- Export Validation ----------

                const download =
                    await detailPage
                        .exportSearchResults();

                Logger.info(
                    `Downloaded File Name: ${download.suggestedFilename()
                    }`
                );

                const filePath =
                    await DownloadUtil
                        .saveDownload(
                            download
                        );

                expect(
                    DownloadUtil
                        .fileExists(
                            filePath
                        )
                ).toBeTruthy();

                Logger.info(
                    `Export Downloaded: ${filePath}`
                );

                // ---------- Validate File Type ----------

                expect(
                    filePath
                ).toMatch(
                    /\.(xlsx|csv)$/i
                );

                Logger.info(
                    'Export Validation Passed'
                );

                // ---------- Update Excel PASS ----------

                ExcelWriter.updateResult(
                    filePath,
                    sheetName,
                    data.TC_ID,
                    `Results displayed successfully for ${data.SearchValue}`,
                    'PASS'
                );

                Logger.info(
                    `Test Passed: ${data.TC_ID}`
                );

                // ---------- Navigate Back ----------

                // ---------- Reset To Search Page ----------

                await breadcrumb.goToSearchPage();

                await searchPage.verifyP360Loaded();

                await page.waitForLoadState(
                    'networkidle'
                );
            }
            catch (error: any) {

                Logger.error(
                    `Test Failed: ${data.TC_ID}`
                );

                Logger.error(
                    error.message
                );

                // ---------- Screenshot ----------

                await ScreenshotUtil.capture(
                    page,
                    data.TC_ID
                );

                // ---------- Update Excel FAIL ----------

                ExcelWriter.updateResult(
                    filePath,
                    sheetName,
                    data.TC_ID,
                    error.message,
                    'FAIL'
                );

                // ---------- Reset Navigation ----------

                try {

                    await breadcrumb
                        .goToSearchPage();

                    await searchPage
                        .verifyP360Loaded();

                    await page.waitForLoadState(
                        'networkidle'
                    );
                }
                catch {

                    Logger.error(
                        'Navigation reset failed'
                    );
                }
            }
        }
    }
);