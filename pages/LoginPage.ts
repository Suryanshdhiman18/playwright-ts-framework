import {
    Page,
    Locator,
    expect
} from '@playwright/test';

export class LoginPage {

    readonly page: Page;

    // =====================================================
    // LOCATORS
    // =====================================================

    // Microsoft Email Field

    readonly emailField: Locator;

    // Next / Sign In Button

    readonly nextButton: Locator;

    // Password Field

    readonly passwordField: Locator;

    // Stay Signed In Popup

    readonly staySignedInTitle: Locator;

    // Yes Button

    readonly yesButton: Locator;

    // Release Popup Close Button

    readonly releasePopupCloseButton: Locator;

    // Dashboard Header

    readonly dashboardHeader: Locator;

    constructor(page: Page) {

        this.page = page;

        // =====================================================
        // INITIALIZE LOCATORS
        // =====================================================

        // Microsoft Email Field

        this.emailField =
            page.locator('#i0116');

        // Next / Sign In Button

        this.nextButton =
            page.locator('#idSIButton9');

        // Password Field

        this.passwordField =
            page.locator('#i0118');

        // Stay Signed In Popup

        this.staySignedInTitle =
            page.locator(
                'text=Stay signed in'
            );

        // Yes Button

        this.yesButton =
            page.getByRole(
                'button',
                { name: 'Yes' }
            );

        // Release Popup Close Button

        this.releasePopupCloseButton =
            page.getByRole(
                'button',
                { name: 'Close' }
            );

        // Dashboard Header

        this.dashboardHeader =
            page.getByText(
                'Hello, Welcome Back'
            );
    }

    // =====================================================
    // LOGIN METHOD
    // =====================================================

    async login(username: string, password: string) {

        console.log(
            'Starting login process'
        );

        // -------------------------------------------------
        // OPEN APPLICATION
        // -------------------------------------------------

        await this.page.goto(
            'https://rdcas-syn-hom-app-1-dev.azurewebsites.net/'
        );

        // -------------------------------------------------
        // ENTER USERNAME
        // -------------------------------------------------

        console.log(
            'Current URL:',
            this.page.url()
        );

        await this.page.waitForLoadState(
            'domcontentloaded'
        );

        console.log(
            'Waiting for Microsoft login page...'
        );

        await expect(
            this.page
        ).toHaveURL(
            /login\.microsoftonline\.com/,
            {
                timeout: 180000
            }
        );

        await expect(
            this.emailField
        ).toBeVisible({
            timeout: 180000
        });

        await this.emailField.click();

        await this.emailField.fill(username);

        console.log(
            'Username entered'
        );

        // -------------------------------------------------
        // CLICK NEXT
        // -------------------------------------------------

        await this.nextButton.click();

        // -------------------------------------------------
        // ENTER PASSWORD
        // -------------------------------------------------

        await this.passwordField.waitFor({
            state: 'visible',
            timeout: 60000
        });

        await this.passwordField.click();

        await this.passwordField.fill(password);

        console.log(
            'Password entered'
        );

        // -------------------------------------------------
        // CLICK SIGN IN
        // -------------------------------------------------

        await this.nextButton.click();

        // await this.page.waitForLoadState(
        //     'networkidle'
        // );

        console.log(
            'Waiting for MFA approval...'
        );

        // -------------------------------------------------
        // MFA HANDLING
        // -------------------------------------------------

        await this.waitForMFACompletion();

        // -------------------------------------------------
        // HANDLE STAY SIGNED IN
        // -------------------------------------------------

        await this.handleStaySignedIn();

        // -------------------------------------------------
        // HANDLE RELEASE POPUP
        // -------------------------------------------------

        await this.handleReleasePopup();

        // -------------------------------------------------
        // VERIFY DASHBOARD
        // -------------------------------------------------

        await this.verifyDashboardLoaded();

        console.log(
            'Login completed successfully'
        );
    }

    // =====================================================
    // MFA HANDLING
    // =====================================================

    async waitForMFACompletion() {

        console.log(
            'Complete MFA manually and click Resume in Playwright Inspector'
        );

        // Pause execution for manual MFA

        await this.page.pause();

        console.log(
            'MFA completed successfully'
        );
    }

    // async waitForMFACompletion() {

    //     console.log(
    //         'Waiting for manual MFA approval...'
    //     );

    //     // Wait until redirected back
    //     // to actual application

    //     await this.page.waitForURL(
    //         '**azurewebsites.net/**',
    //         {
    //             timeout: 180000
    //         }
    //     );

    //     console.log(
    //         'MFA completed successfully'
    //     );
    // }

    // =====================================================
    // HANDLE STAY SIGNED IN
    // =====================================================

    async handleStaySignedIn() {

        try {

            if (
                await this.staySignedInTitle.isVisible({
                    timeout: 5000
                })
            ) {

                console.log(
                    'Stay signed in popup detected'
                );

                await this.yesButton.click();

                console.log(
                    'Clicked Yes on Stay signed in'
                );
            }

        } catch {

            console.log(
                'Stay signed in popup not displayed'
            );
        }
    }

    // =====================================================
    // HANDLE RELEASE POPUP
    // =====================================================

    async handleReleasePopup() {

        try {

            const releaseNotesPopup =
                this.page.getByText(
                    'Intrics Release Notes'
                );

            // Wait for popup

            await releaseNotesPopup.waitFor({
                timeout: 15000
            });

            console.log(
                'Release popup detected'
            );

            // Close popup

            await this.page.getByRole(
                'button',
                { name: 'Close' }
            ).click();

            console.log(
                'Release popup closed'
            );

        } catch {

            console.log(
                'Release popup not displayed'
            );
        }
    }

    // =====================================================
    // VERIFY DASHBOARD
    // =====================================================

    async verifyDashboardLoaded() {

        await expect(
            this.dashboardHeader
        ).toBeVisible({
            timeout: 90000
        });

        console.log(
            'Dashboard loaded successfully'
        );
    }
}