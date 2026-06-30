import {
    Page,
    Locator,
    expect,
    Download
} from '@playwright/test';

export class ProductDetailPage {

    readonly page: Page;

    readonly productDescription: Locator;

    readonly upcValue: Locator;

    readonly exportButton: Locator;

    constructor(page: Page) {

        this.page = page;

        // Product Description

        this.productDescription =
            page.getByRole('main')
                .locator(
                    'span.product-description'
                );

        // UPC Value

        this.upcValue =
            page.locator(
                "//label[normalize-space()='UPC:']/following-sibling::span"
            );

        this.exportButton =
            page.getByRole(
                'button',
                {
                    name: 'download'
                }
            );
    }

    async verifyProductLoaded() {

        console.log(
            'Waiting for Product Detail page...'
        );

        // await this.page.waitForLoadState(
        //     'networkidle'
        // );

        await this.productDescription
            .first()
            .waitFor({
                state: 'visible',
                timeout: 90000
            });

        console.log(
            'Product Detail page loaded'
        );
    }

    async getProductDescription() {

        const description =
            await this.productDescription
                .textContent();

        return description?.trim() || '';
    }

    async getUPC() {

        const upc =
            await this.upcValue
                .textContent();

        return upc?.trim() || '';
    }

    async exportSearchResults(): Promise<Download> {

        const downloadPromise =
            this.page.waitForEvent(
                'download'
            );

        await this.exportButton.click();

        return await downloadPromise;
    }
}