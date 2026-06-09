import {
    Page,
    Locator,
    expect
} from '@playwright/test';

export class P360ResultsPage {

    readonly page: Page;

    readonly productCards: Locator;

    readonly viewDetailsButton: Locator;

    readonly resultHeader: Locator;

    constructor(page: Page) {

        this.page = page;

        // ---------- Product Cards ----------

        this.productCards =
            page.locator(
                "//a[contains(text(),'View Details')]/ancestor::div[contains(@class,'card-text-outer')]"
            );

        // ---------- View Details ----------

        this.viewDetailsButton =
            page.locator(
                "//a[contains(text(),'View Details')]"
            );

        // ---------- Result Header ----------

        this.resultHeader =
            page.locator(
                "//*[contains(text(),'Showing')]"
            );
    }

    // ---------- Verify Results ----------

    async verifyResultsDisplayed() {

        await expect(
            this.resultHeader
        ).toBeVisible({
            timeout: 30000
        });
    }

    // ---------- Validate Search Results ----------

    async validateSearchResults(
        expectedKeywords: string
    ) {

        const keywords =
            expectedKeywords
                .split(',')
                .map(
                    keyword =>
                        keyword
                            .trim()
                            .toLowerCase()
                );

        const cards =
            await this.productCards
                .allInnerTexts();

        console.log(
            'Captured Cards:',
            cards
        );

        let matchedCount = 0;

        for (const card of cards) {

            const lowerCard =
                card.toLowerCase();

            const matched =
                keywords.some(
                    keyword =>
                        lowerCard.includes(
                            keyword
                        )
                );

            if (matched) {

                matchedCount++;

                console.log(
                    `Matched Card: ${card}`
                );
            }
        }

        return matchedCount;
    }

    async openFirstProduct() {

        const count =
            await this.viewDetailsButton.count();

        console.log(
            `View Details Buttons Found: ${count}`
        );

        await this.viewDetailsButton
            .first()
            .click();

        await this.page.waitForLoadState(
            'networkidle'
        );

        await this.page.waitForTimeout(
            3000
        );

        console.log(
            'After Open Product'
        );
    }
}