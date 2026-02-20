import { Page, Locator, expect } from '@playwright/test';
import { HomePageLocators } from '../locators/HomePageLocators';

export class Home {
  private page: Page;
  private url: string;
  private upcomingBikesTab: Locator;
  //creating constructors
  constructor(page: Page) {
    this.page = page;
    this.url = 'https://www.zigwheels.com/';
    this.upcomingBikesTab = page
      .locator(HomePageLocators.bikeTabs)
      .getByText(HomePageLocators.upcomingBikesText, { exact: true });
  }
  //navigating to url
  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await expect(this.page).toHaveURL(this.url);
  }
//function to click upcoming bikes tab
  async clickUpcomingBikesTab(): Promise<void> {
    // Ensure the tab is visible and enabled before clicking
    await this.upcomingBikesTab.waitFor({ state: 'visible' });
    await expect(this.upcomingBikesTab).toBeEnabled();
    // Scroll into view to avoid hidden element issues
    await this.upcomingBikesTab.scrollIntoViewIfNeeded();
    // Click the tab
    await this.upcomingBikesTab.click();
  }
}
