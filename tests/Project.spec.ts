import { test, Page, Browser } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { UsedCarsPage } from '../pages/UsedCarsPage';
import { Home } from '../pages/HomePage';
import { UpcomingBikesPage } from '../pages/UpcomingBikesPage';

test.describe.serial('Grouping 3 scenarios', () => {
  let page: Page;
  let usedCarsPage: UsedCarsPage;
  let loginPage: LoginPage;
  let homePage: Home;
  let upcomingBikesPage: UpcomingBikesPage;

  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    page = await browser.newPage();
    usedCarsPage = new UsedCarsPage(page);
    loginPage = new LoginPage(page);
    homePage = new Home(page);
    upcomingBikesPage = new UpcomingBikesPage(page);
  });

  test('Verify Upcoming Royal Enfield Bikes Details using two Page Objects', async () => {
    await homePage.goto();
    await homePage.clickUpcomingBikesTab();
    await upcomingBikesPage.clickAllUpcomingBikesLink();
    await upcomingBikesPage.selectBrand('Royal Enfield');
    await upcomingBikesPage.getBikeDetails();
  });

  test('Upcoming cars Test - Popular Used Car Models in Chennai', async () => {
    await usedCarsPage.navigateToUsedCarsPage();
    await usedCarsPage.selectCity('Chennai');
    await usedCarsPage.scrollDown();
    await usedCarsPage.getPopularUsedCarModels();
  });

  test('loginvalid', async () => {
    await loginPage.clickLoginIcon();
    await loginPage.clickGoogleLogin();
    await loginPage.enterEmail('team7@');
    await loginPage.clickNext();
    await loginPage.captureErrorMessageScreenshot('./screenshots/element-screenshot.png');
    await loginPage.closePopups();
  });

  test.afterEach(async () => {
    await page.locator('img[alt="Home"]').first().click();
    await page.screenshot({ path: './screenshots/homePage.png' });
    await page.waitForTimeout(2000);
  });
});
