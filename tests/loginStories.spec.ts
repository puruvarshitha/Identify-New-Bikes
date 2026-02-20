import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { Home } from '../pages/HomePage';

test.setTimeout(60000);

test.describe.serial('Login Scenarios', () => {
  test('@Smoke S3:T1:Login page loads correctly', async ({ page }: { page: Page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToHomePage();
    await loginPage.clickLoginIcon();
    await expect(loginPage.googleLoginButton).toBeVisible();
    await expect(page.getByText('Facebook')).toBeVisible();
  });

  test('@Regression S3:T2:loginEmailvalid', async ({ page }: { page: Page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToHomePage();
    await loginPage.clickLoginIcon();
    await loginPage.clickGoogleLogin();
    await loginPage.enterEmail('team@4');
    await loginPage.clickNext();
    await loginPage.captureErrorMessageScreenshot('./screenshots/login_invalid_email.png');
    await loginPage.closePopups();
  });

  test('@Regression S3:T3:loginvalidphoneNUMBER', async ({ page }: { page: Page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToHomePage();
    await loginPage.clickLoginIcon();
    await loginPage.clickGoogleLogin();
    await loginPage.enterPhnNumber('1@112344657');
    await loginPage.clickNext();
    await loginPage.captureErrorMessageScreenshot('./screenshots/login_invalid_phone.png');
    await loginPage.closePopups();
  });

  test('@Regression S3:T4:Clicking Next without entering email shows error', async ({ page }: { page: Page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToHomePage();
    await loginPage.clickLoginIcon();
    await loginPage.clickGoogleLogin();
    await loginPage.clickNext();
    await loginPage.captureErrorMessageScreenshot('./screenshots/empty-email-error.png');
    await expect(loginPage.popupPage!.locator(loginPage.errorMessageLocator)).toBeVisible();
    await loginPage.closePopups();
  });

  test.afterEach(async ({ page }: { page: Page }) => {
    await page.screenshot({ path: './screenshots/post-login.png' });
  });
});
