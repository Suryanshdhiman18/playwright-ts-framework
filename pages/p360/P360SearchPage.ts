import {
    Page,
    Locator,
    expect
} from '@playwright/test';

export class P360SearchPage {

    readonly page: Page;

    readonly descriptionRadio: Locator;

    readonly upcRadio: Locator;

    readonly descriptionInput: Locator;

    readonly upcInput: Locator;

    readonly searchButton: Locator;

    constructor(page: Page) {

        this.page = page;

        // ---------- Radio Buttons ----------

        this.descriptionRadio =
            page.getByRole('radio')
                .first();

        this.upcRadio =
            page.getByRole('radio')
                .nth(1);

        // ---------- Description Input ----------

        this.descriptionInput =
            page.locator(
                "//input[contains(@placeholder,'Digiorno')]"
            );

        // ---------- UPC Input ----------

        this.upcInput =
            page.locator(
                "//input[contains(@placeholder,'Enter UPC')]"
            );

        // ---------- Search Button ----------

        this.searchButton =
            page.getByRole(
                'button',
                {
                    name: 'Search'
                }
            );
    }

    async verifyP360Loaded() {

        await expect(
            this.descriptionInput
        ).toBeVisible({
            timeout: 30000
        });
    }

    async selectSearchType(
        type: string
    ) {

        if (type === 'UPC') {

            await this.upcRadio.check();

            await expect(
                this.upcInput
            ).toBeVisible();
        }
        else {

            await this.descriptionRadio.check();

            await expect(
                this.descriptionInput
            ).toBeVisible();
        }
    }

    async searchProduct(
        type: string,
        value: any
    ) {

        if (type === 'UPC') {

            await this.upcInput.click();

            await this.upcInput.fill(
                String(value)
            );
        }
        else {

            await this.descriptionInput.click();

            await this.descriptionInput.fill(
                value
            );
        }
    }

    async clickSearch() {

        await this.searchButton.click();

        // await this.page.waitForLoadState(
        //     'networkidle'
        // );
    }
}