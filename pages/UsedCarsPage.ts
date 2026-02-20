import { Page, Locator, expect } from '@playwright/test';
import { UsedCarsPageLocators } from '../locators/UsedCarsPageLocators';
import * as fs from 'fs';
import * as path from 'path';

export class UsedCarsPage {
  page: Page;                     
  usedCarsNavLink: Locator;       
  usedCarsSubNavLink: Locator;    
  popularModelList: string;      
  scrollLocator: string;          

  constructor(page: Page) {
    this.page = page;
    this.usedCarsNavLink = page.locator(UsedCarsPageLocators.usedCarsNavLink);
    this.usedCarsSubNavLink = page.locator(UsedCarsPageLocators.usedCarsSubNavLink);
    this.popularModelList = UsedCarsPageLocators.popularModelList;
    this.scrollLocator = UsedCarsPageLocators.scrollLocatorXPath;
  }

  // Navigate to Used Cars page by clicking nav and sub-nav links
  async navigateToUsedCarsPage(): Promise<void> {
    await this.usedCarsNavLink.waitFor({ state: 'visible' });
    await expect(this.usedCarsNavLink).toBeEnabled();
    await this.usedCarsNavLink.click();

    await this.usedCarsSubNavLink.waitFor({ state: 'visible' });
    await expect(this.usedCarsSubNavLink).toBeEnabled();
    await this.usedCarsSubNavLink.click();
  }

  // Select a city (like Chennai) and wait until popular models section appears
  async selectCity(cityName: string): Promise<void> {
    const cityLink = this.page.getByTitle(cityName);
    await cityLink.waitFor({ state: 'visible' });
    await expect(cityLink).toBeEnabled();
    await cityLink.click();
    await this.page.locator(this.popularModelList).waitFor({ state: 'visible', timeout: 10000 });
  }

  // Scroll down to the section defined by scrollLocator
  async scrollDown(): Promise<void> {
    const scrollElement = this.page.locator(this.scrollLocator);
    await scrollElement.waitFor({ state: 'visible' });
    await scrollElement.scrollIntoViewIfNeeded();
    await expect(scrollElement).toBeVisible();
  }

  // Get list of popular used car models and save them into a JSON file
  async getPopularUsedCarModels(): Promise<string[]> {
    const resultPopular = this.page.locator(this.popularModelList);
    await resultPopular.waitFor({ state: 'visible', timeout: 10000 });

    // collecting all the popular cars list
    const resultListName = await resultPopular.locator('label').allTextContents();
    if (!resultListName || resultListName.length === 0) {
      throw new Error('Popular models list not found or empty');
    }
    const cleanedPopularModels = resultListName.map(model => model.trim());
    // Save the result list into a JSON file
    const filepath = path.join(__dirname, '..', 'Result/used_cars.json');
    const popularModelsDict = { "Popular Used Car Models in Chennai": cleanedPopularModels };
    fs.writeFileSync(filepath, JSON.stringify(popularModelsDict, null, 4));

    // Make sure we got at least one model
    expect(cleanedPopularModels.length).toBeGreaterThan(0);

    // Return the list of models
    return cleanedPopularModels;
  }
}
