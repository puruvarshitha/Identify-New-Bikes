import { Page, Locator, expect } from '@playwright/test';
import { UpcomingBikesLocators } from '../locators/UpcomingBikesLocators';
import * as fs from 'fs';
import * as path from 'path';

// Define a Bike object structure
interface Bike {
  name: string;        
  price: string;       
  launchDates: string; 
  dataprice: string;   
}

export class UpcomingBikesPage {
  page: Page;                        
  allUpcomingBikesLink: Locator;     
  modelNameLocator: Locator;         
  modelPriceLocator: Locator;        
  modelLaunchDateLocator: Locator;   
  dataprice: Locator;                
  scrollBikes: Locator;              

  constructor(page: Page) {
    this.page = page;
    this.allUpcomingBikesLink = page.locator(UpcomingBikesLocators.allUpcomingBikesLink);
    this.modelNameLocator = page.locator(UpcomingBikesLocators.modelNameLocator);
    this.modelPriceLocator = page.locator(UpcomingBikesLocators.modelPriceLocator);
    this.modelLaunchDateLocator = page.locator(UpcomingBikesLocators.modelLaunchDateLocator);
    this.dataprice = page.locator(UpcomingBikesLocators.dataPriceLocator);
    this.scrollBikes = page.locator(UpcomingBikesLocators.scrollBikesLocator);
  }

  // Click the "All Upcoming Bikes" link and wait until bike models are visible
  async clickAllUpcomingBikesLink(): Promise<void> {
    await this.allUpcomingBikesLink.waitFor({ state: 'visible' });
    await expect(this.allUpcomingBikesLink).toBeEnabled();
    await this.allUpcomingBikesLink.click();
    // Confirm navigation worked by checking that at least one bike name is visible
    await this.modelNameLocator.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  // Select a brand (like Royal Enfield) and wait until bike models load
  async selectBrand(brandName: string): Promise<void> {
    const brandLink = this.page.getByRole('link', { name: brandName, exact: true });
    await brandLink.waitFor({ state: 'visible' });
    await expect(brandLink).toBeEnabled();
    await brandLink.scrollIntoViewIfNeeded();
    await brandLink.click();
    // Confirm that bike models are loaded for the chosen brand
    await this.modelNameLocator.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  // Get details of all upcoming bikes and save them into a JSON file
  async getBikeDetails(): Promise<Bike[]> {
    // Scroll to bike section and wait until bike names are visible
    await this.scrollBikes.scrollIntoViewIfNeeded();
    await this.modelNameLocator.first().waitFor({ state: 'visible', timeout: 10000 });

    // fetching text values for names, prices, and launch dates
    const modelNameTitles = await this.modelNameLocator.allTextContents();
    const modelPrices = await this.modelPriceLocator.allTextContents();
    const modelLaunchDates = await this.modelLaunchDateLocator.allTextContents();

    // converting the lakhs to numeric values
    const modeldataprice = await this.dataprice.evaluateAll(elements =>
      elements.map(el => el.getAttribute('data-price'))
    );

    // Check if data which we get is in valid format or not
    if (
      !modelNameTitles || !modelPrices || !modelLaunchDates || !modeldataprice ||
      !Array.isArray(modelNameTitles) || modelNameTitles.length === 0
    ) {
      throw new Error('Bike details not loaded or not in expected format');
    }

    // Build an array of Bike objects
    const bikes: Bike[] = modelNameTitles.map((name, index) => ({
      name: name?.trim() || 'N/A',
      price: modelPrices[index] || 'N/A',
      launchDates: modelLaunchDates[index] || 'N/A',
      dataprice: modeldataprice[index] || '0',
    }));

    // Filter bikes with price less than 4 lakhs
    const filteredBikes = bikes.filter(bike => parseInt(bike.dataprice || '0') < 400000);

    // Saving filtered bikes output to json file
    const filepath = path.join(__dirname, '..', 'Result/upcoming_bikes.json');
    const popularModelsDict = { "Upcoming bikes list": filteredBikes };
    fs.writeFileSync(filepath, JSON.stringify(popularModelsDict, null, 4));

    // Verify file was created
    expect(fs.existsSync(filepath)).toBe(true);

    // Return filtered bikes list
    return filteredBikes;
  }
}
