import { test as setup } from '@playwright/test';

import path from 'path';

import fs from 'fs';

import { LoginPage } from '../../pages/LoginPage';

const authFile = path.join(
    __dirname,
    '../../playwright/.auth/user.json'
);

setup(
    'Authenticate User',

    async ({ page }) => {

        const loginPage =
            new LoginPage(page);

        await loginPage.login(
            'suryansh.dhiman@rdsolutions.in',
            'Suryansh@Ryzen#S'
        );

        console.log(
            'Waiting for dashboard to load completely'
        );

        // Wait for final application URL

        await page.waitForURL(
            /azurewebsites\.net/,
            {
                timeout: 60000
            }
        );

        // Wait for sidebar/Product360 icon
        // This confirms app is fully initialized

        await page.locator(
            "//li[.//a[normalize-space()='Product 360']]"
        ).waitFor({
            state: 'visible',
            timeout: 60000
        });

        // Additional stabilization for Angular/Azure session

        await page.waitForLoadState(
            'networkidle'
        );

        await page.waitForTimeout(5000);

        console.log(
            'Dashboard fully loaded successfully'
        );

        // Ensure auth directory exists

        fs.mkdirSync(
            path.dirname(authFile),
            { recursive: true }
        );

        // Save auth state AFTER full app stabilization

        await page.context().storageState({
            path: authFile
        });

        console.log(
            'Authentication saved successfully'
        );
    }
);