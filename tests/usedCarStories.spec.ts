import { test, expect, Page, Browser } from '@playwright/test';
import { UsedCarsPage } from '../pages/UsedCarsPage';

let page: Page;
let usedCarsPage: UsedCarsPage;

test.describe('Used Cars Scenario - User Stories Based Tests', () => {
  test.beforeEach(async ({ browser }: { browser: Browser }) => {
    page = await browser.newPage();
    usedCarsPage = new UsedCarsPage(page);
    await page.goto('https://www.zigwheels.com/');
  });

  test('@Smoke Navigate to Used Cars Section', async () => {
    await usedCarsPage.navigateToUsedCarsPage();
    await expect(page).toHaveURL(/used-car/);
  });

  test('@Smoke Select Chennai City', async () => {
    await usedCarsPage.navigateToUsedCarsPage();
    await usedCarsPage.selectCity('Chennai');
    await expect(page.locator('//h1[@id="usedcarttlID"]')).toBeVisible();
  });

  test('@Regression Scroll to Popular Models Section', async () => {
    await usedCarsPage.navigateToUsedCarsPage();
    await usedCarsPage.selectCity('Chennai');
    await usedCarsPage.scrollDown();
    await expect(page.locator('//div[@class="zw-sr-shortWrap pt-15"]/div[@class="gsc_thin_scroll"]')).toBeVisible();
  });

  test('@Regression Verify Popular Used Car Models Are Displayed', async () => {
    await usedCarsPage.navigateToUsedCarsPage();
    await usedCarsPage.selectCity('Chennai');
    await usedCarsPage.scrollDown();
    await usedCarsPage.getPopularUsedCarModels();
  });

  test('@Regression Capture Screenshot of Used Cars Section', async () => {
    await usedCarsPage.navigateToUsedCarsPage();
    await usedCarsPage.selectCity('Chennai');
    await usedCarsPage.scrollDown();
    await page.screenshot({ path: './screenshots/usedCarsSection.png' });
  });

  test.afterEach(async () => {
    await page.close();
  });
});
