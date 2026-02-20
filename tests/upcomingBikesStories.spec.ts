import { test, expect, Page, Browser } from '@playwright/test';
import { Home } from '../pages/HomePage';
import { UpcomingBikesPage } from '../pages/UpcomingBikesPage';

let page: Page;
let homePage: Home;
let upcomingBikesPage: UpcomingBikesPage;

test.describe.serial('Upcoming Bikes Test Suite', () => {
  test.beforeAll(async ({ browser }: { browser: Browser }) => {
    page = await browser.newPage();
    homePage = new Home(page);
    upcomingBikesPage = new UpcomingBikesPage(page);
  });

  test('@Regression Verify Upcoming Royal Enfield Bikes Details', async () => {
    await homePage.goto();
    await homePage.clickUpcomingBikesTab();
    await upcomingBikesPage.clickAllUpcomingBikesLink();
    await upcomingBikesPage.selectBrand('Royal Enfield');
    await upcomingBikesPage.getBikeDetails();
  });

  test('@Smoke Verify Upcoming Royal Enfield Bikes Are Displayed', async () => {
    await homePage.goto();
    await homePage.clickUpcomingBikesTab();
    await upcomingBikesPage.clickAllUpcomingBikesLink();
    await upcomingBikesPage.selectBrand('Royal Enfield');
    const bikeDetails = await upcomingBikesPage.getBikeDetails();
    expect(Array.isArray(bikeDetails)).toBe(true);
    expect(bikeDetails.length).toBeGreaterThan(0);
  });

  /*test.only('@Regression Verify Bike Details Contain Price and Launch Date', async () => {
    await homePage.goto();
    await homePage.clickUpcomingBikesTab();
    await upcomingBikesPage.clickAllUpcomingBikesLink();
    await upcomingBikesPage.selectBrand('Royal Enfield');

    const bikeDetails = await upcomingBikesPage.getBikeDetails();
    for (const bike of bikeDetails) {
      expect(typeof bike.price).toBe('string');
      expect(bike.price).toMatch(/(₹|Rs\.)\s?\d+/);
      expect(typeof bike.launchDates).toBe('string');
      expect(bike.launchDates).toMatch(/\d{4}/);
    }
  });
  */


test('@Regression Verify Bike Details Contain Price and Launch Date', async () => {
  await homePage.goto();
  await homePage.clickUpcomingBikesTab();
  await upcomingBikesPage.clickAllUpcomingBikesLink();
  await upcomingBikesPage.selectBrand('Royal Enfield');

  const bikeDetails = await upcomingBikesPage.getBikeDetails();

  const pricePattern = /(₹|Rs\.)\s?\d[\d,]*/i;
  const launchPattern = /\b(19|20)\d{2}\b|Unrevealed/i; // accept year or "Unrevealed"

  for (const bike of bikeDetails) {
    // --- Price ---
    expect(typeof bike.price).toBe('string');
    expect(bike.price).toMatch(pricePattern);

    // --- Launch Date ---
    expect(typeof bike.launchDates).toBe('string');
    expect(bike.launchDates).toMatch(launchPattern);
  }
});
  test('@Smoke Verify Selected Bike Brand is Royal Enfield', async () => {
    await homePage.goto();
    await homePage.clickUpcomingBikesTab();
    await upcomingBikesPage.clickAllUpcomingBikesLink();
    await upcomingBikesPage.selectBrand('Royal Enfield');

    const selectedBrand = page.locator('#carModels');
    await expect(selectedBrand).toHaveText(/Royal Enfield/i);
  });

  test('@Regression Verify All Listed Bikes Belong to Selected Brand - Royal Enfield', async () => {
    await homePage.goto();
    await homePage.clickUpcomingBikesTab();
    await upcomingBikesPage.clickAllUpcomingBikesLink();
    await upcomingBikesPage.selectBrand('Royal Enfield');

    const bikeDetails = await upcomingBikesPage.getBikeDetails();
    expect(Array.isArray(bikeDetails)).toBe(true);
    expect(bikeDetails.length).toBeGreaterThan(0);

    for (const bike of bikeDetails) {
      expect(bike.name).toBeTruthy();
      expect(bike.name).toMatch(/Royal Enfield/i);
    }
  });

  test.afterEach(async () => {
    await page.screenshot({ path: './screenshots/bikePage.png' });
    await page.locator('//img[@title="ZigWheels Home"]').first().click();
    await page.waitForTimeout(2000);
  });
});
