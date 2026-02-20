import { Page, Locator, expect } from '@playwright/test';
import { LoginPageLocators } from '../locators/LoginPageLocators';

export class LoginPage {
  page: Page;                  
  loginIcon: Locator;          
  googleLoginButton: Locator;  
  emailInput: string;          
  nextButton: string;          
  errorMessageLocator: string; 
  closeButton: Locator;        
  passwordField: Locator;      
  popupPage: Page | undefined; 

  constructor(page: Page) {
    this.page = page;
    this.loginIcon = page.locator(LoginPageLocators.loginIcon);
    this.googleLoginButton = page.locator('text=Google'); 
    this.emailInput = LoginPageLocators.emailInputLabel;
    this.nextButton = LoginPageLocators.nextButtonText;
    this.errorMessageLocator = LoginPageLocators.errorMessageLocator;
    this.closeButton = page.locator(LoginPageLocators.closeButton);
    this.passwordField = page.locator(LoginPageLocators.passwordField);
  }

  // Go to ZigWheels homepage
  async navigateToHomePage(): Promise<void> {
    await this.page.goto('https://www.zigwheels.com/');
    await expect(this.page).toHaveURL('https://www.zigwheels.com/');
  }

  // Click on the login icon
  async clickLoginIcon(): Promise<void> {
    await this.loginIcon.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.loginIcon).toBeEnabled();
    await this.loginIcon.click();
  }

  // Click Google login and wait for popup window
  async clickGoogleLogin(): Promise<void> {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.googleLoginButton.click()
    ]);
    this.popupPage = popup;
    await this.popupPage.waitForLoadState('domcontentloaded');
    await this.popupPage.waitForSelector(`text=${this.emailInput}`, { state: 'visible', timeout: 10000 });
  }

  // Enter email in the respective feild
  async enterEmail(email: string): Promise<void> {
    if (!this.popupPage) throw new Error('Popup page not available');
    const emailField = this.popupPage.getByLabel(this.emailInput);
    await emailField.waitFor({ state: 'visible' });
    await expect(emailField).toBeEditable();
    await emailField.fill(email);
    await expect(emailField).toHaveValue(email);
  }

  // Enter phone number 
  async enterPhnNumber(email: string): Promise<void> {
    if (!this.popupPage) throw new Error('Popup page not available');
    const emailField = this.popupPage.getByLabel(this.emailInput);
    await emailField.waitFor({ state: 'visible' });
    await expect(emailField).toBeEditable();
    await emailField.fill(email);
    await expect(emailField).toHaveValue(email);
  }

  // Click the Next button 
  async clickNext(): Promise<void> {
    if (!this.popupPage || this.popupPage.isClosed()) {
      throw new Error('Popup page is not available or already closed.');
    }
    const nextBtn = this.popupPage.getByRole('button', { name: this.nextButton });
    await nextBtn.waitFor({ state: 'visible' });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();
  }

  // Capture screenshot of error message 
  async captureErrorMessageScreenshot(path: string): Promise<void> {
    if (!this.popupPage) throw new Error('Popup page not available');
    const errorLocator = this.popupPage.locator(this.errorMessageLocator);
    await errorLocator.waitFor({ state: 'visible', timeout: 20000 });
    await errorLocator.screenshot({ path });
  }

  //forgot email link
  async getForgotEmailLink(): Promise<Locator> {
    if (!this.popupPage) throw new Error('Popup page not available');
    const forgotLink = this.popupPage.locator(LoginPageLocators.forgotEmailButtonXPath);
    await forgotLink.waitFor({ state: 'visible' });
    return forgotLink;
  }

  // close the popup and login window
  async closePopups(): Promise<void> {
    if (this.popupPage && !this.popupPage.isClosed()) {
      await this.popupPage.close();
    }
    await this.closeButton.waitFor({ state: 'visible' });
    await this.closeButton.click();
    await expect(this.page.locator(LoginPageLocators.closeButton)).not.toBeVisible();
  }

  // Enter password into password field
  async enterPassword(password: string): Promise<void> {
    await this.passwordField.waitFor({ state: 'visible' });
    await expect(this.passwordField).toBeEditable();
    await this.passwordField.fill(password);
  }
}
