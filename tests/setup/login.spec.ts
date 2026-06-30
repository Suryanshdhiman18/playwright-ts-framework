// import { test } from '@playwright/test';

// import { LoginPage } from '../../pages/LoginPage';

// test(
//     'Verify Dashboard Access',

//     async ({ page }) => {

//         const loginPage =
//             new LoginPage(page);

//         await page.goto(
//             'https://rdcas-syn-hom-app-1-dev.azurewebsites.net/'
//         );

//         await loginPage.verifyDashboardLoaded();
//     }
// );

import { test } from '@playwright/test';

import { LoginPage } from '../../pages/common/LoginPage';

test(
    'Verify Dashboard Access',

    async ({ page }) => {

        const loginPage =
            new LoginPage(page);

        await page.goto(
            'https://rdcas-syn-hom-app-1-dev.azurewebsites.net/'
        );

        await loginPage.handleReleasePopup();

        await loginPage.verifyDashboardLoaded();
    }
);


