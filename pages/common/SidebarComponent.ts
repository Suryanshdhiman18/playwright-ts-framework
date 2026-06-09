import { Page, Locator, expect } from '@playwright/test';

export class SidebarComponent {

    readonly page: Page;

    readonly p360Icon: Locator;

    readonly dataMenu: Locator;

    readonly catalogIcon: Locator;

    readonly basketIcon: Locator;

    constructor(page: Page) {

        this.page = page;

        this.p360Icon =
            page.locator(
                "//li[.//a[normalize-space()='Product 360']]"
            );

        this.dataMenu =
            page.locator(
                "//div[contains(@class,'material-symbols-outlined') and normalize-space()='business_center']"
            );

        this.catalogIcon =
            page.getByText('My Catalog');

        this.basketIcon =
            page.getByText('Baskets');
    }

    // -------- P360 --------

    async goToP360() {

        console.log(
            'Navigating to Product 360 module'
        );

        await this.p360Icon.click();

        await expect(this.page)
            .toHaveURL(/price-iq\/product360V2/i);

        console.log(
            'Product 360 page opened successfully'
        );
    }

    // -------- Catalog --------

    async goToCatalog() {

        console.log(
            'Navigating to Catalog module'
        );

        await this.dataMenu.click();

        await this.catalogIcon.click();

        console.log(
            'Catalog page opened successfully'
        );
    }

    // -------- Basket --------

    async goToBasket() {

        console.log(
            'Navigating to Basket module'
        );

        await this.dataMenu.click();

        await this.basketIcon.click();

        console.log(
            'Basket page opened successfully'
        );
    }
}