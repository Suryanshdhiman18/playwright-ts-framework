import {
    Page,
    Locator
} from '@playwright/test';

export class P360Breadcrumb {

    readonly page: Page;

    readonly productBreadcrumb: Locator;

    readonly searchResultsBreadcrumb: Locator;

    constructor(page: Page) {

        this.page = page;

        // Product Breadcrumb
        // Navigates to Search Page

        this.productBreadcrumb =
            page.getByRole(
                'link',
                {
                    name: 'Product'
                }
            );

        // Search Results Breadcrumb
        // Navigates to Results Page

        this.searchResultsBreadcrumb =
            page.getByRole(
                'link',
                {
                    name: 'Search Results'
                }
            );
    }

    // ---------- Navigate To Search Page ----------

    async goToSearchPage() {

        await this.productBreadcrumb
            .waitFor({
                state: 'visible',
                timeout: 30000
            });

        await this.productBreadcrumb
            .click();

        await this.page.waitForLoadState(
            'networkidle'
        );
    }

    // ---------- Navigate To Results Page ----------

    async goToResultsPage() {

        await this.searchResultsBreadcrumb
            .click();

        await this.page.waitForLoadState(
            'networkidle'
        );
    }
}