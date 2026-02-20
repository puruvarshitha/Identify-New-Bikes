import { test, expect, Page } from '@playwright/test';
import { Home } from '../pages/HomePage';

test.describe.serial('ZigWheels Home Page Tests', () => {
  let homePage: Home;

  test.beforeEach(async ({ page }: { page: Page }) => {
    homePage = new Home(page);
    await homePage.goto();
  });


  test('@Smoke should navigate to ZigWheels homepage', async ({ page }: { page: Page }) => {
    const home = new Home(page);
    await home.goto();
    await expect(page).toHaveURL('https://www.zigwheels.com/');
  });

  test('@Smoke should verify News & Reviews is visible', async ({ page }: { page: Page }) => {
    const home = new Home(page);
    await home.goto();
    await page.getByText('NEWS & REVIEWS').click();
    await page.getByRole('link', { name: 'Auto News' }).click();
    // await page.goto('https://www.zigwheels.com/');
    // await page.goBack();
  });

  test('Login button should be enabled', async ({ page }: { page: Page }) => {
    const home = new Home(page);
    await home.goto();
    await page.locator('#forum_login_title_lg').click();
    await page.locator('#report_submit_close_login').click();
    // await page.goto('https://www.zigwheels.com/');
  });

  test('@Regression should ensure electric Bikes tab is clickable', async ({ page }: { page: Page }) => {
    const home = new Home(page);
    await home.goto();
    await page.locator('#electric-bikes').click();
    // await page.goto('https://www.zigwheels.com/');
  });

  test.afterEach(async ({ page }: { page: Page }) => {
    await page.close();
  });
});
