package com.salesforce.pages;

import io.qameta.allure.Step;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//img[@id='logo']")
    private WebElement logo;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordInput;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//label[@for='rememberUn']")
    private WebElement rememberMeLabel;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorMessage;

    @FindBy(xpath = "//a[@id='forgot_password_link']")
    private WebElement forgotPasswordLink;

    @FindBy(xpath = "//a[normalize-space()='Log In with Username']")
    private WebElement logInWithUsernameLink;

    public LoginPage(WebDriver driver, Duration timeout) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, timeout);
        this.wait.ignoring(StaleElementReferenceException.class);
        PageFactory.initElements(driver, this);
    }

    @Step("Open login page: {url}")
    public LoginPage open(String url) {
        try {
            driver.get(url);
            wait.until(d -> isPresentAndDisplayed(usernameInput) || isPresentAndDisplayed(logInWithUsernameLink));
            if (!isPresentAndDisplayed(usernameInput)) {
                click(logInWithUsernameLink, "Log In with Username link");
                wait.until(ExpectedConditions.visibilityOf(usernameInput));
            }
            return this;
        } catch (TimeoutException e) {
            throw new IllegalStateException("Login page did not load within timeout: " + url, e);
        }
    }

    @Step("Enter username: {username}")
    public LoginPage enterUsername(String username) {
        type(usernameInput, username, "username");
        return this;
    }

    @Step("Enter password")
    public LoginPage enterPassword(String password) {
        type(passwordInput, password, "password");
        return this;
    }

    @Step("Click Log In")
    public LoginPage clickLogin() {
        click(loginButton, "Log In button");
        return this;
    }

    @Step("Login with username: {username}")
    public LoginPage doLogin(String username, String password) {
        enterUsername(username).clickLogin();
        try {
            wait.until(d -> isPresentAndDisplayed(passwordInput) || isErrorDisplayed());
        } catch (TimeoutException e) {
            throw new IllegalStateException("Neither password field nor error appeared after submitting username", e);
        }
        if (isPresentAndDisplayed(passwordInput)) {
            enterPassword(password).clickLogin();
        }
        return this;
    }

    @Step("Wait for password field to be revealed")
    public LoginPage submitUsername(String username) {
        enterUsername(username).clickLogin();
        waitVisible(passwordInput, "password");
        return this;
    }

    public String getPasswordValue() {
        return waitVisible(passwordInput, "password").getAttribute("value");
    }

    @Step("Set Remember me to {checked}")
    public LoginPage setRememberMe(boolean checked) {
        if (isRememberMeSelected() != checked) {
            click(rememberMeCheckbox, "Remember me checkbox");
        }
        return this;
    }

    public boolean isRememberMeSelected() {
        return waitVisible(rememberMeCheckbox, "Remember me checkbox").isSelected();
    }

    public String getRememberMeLabelText() {
        return waitVisible(rememberMeLabel, "Remember me label").getText().trim();
    }

    @Step("Read login error message")
    public String getErrorMessage() {
        try {
            return wait.until(d -> {
                String text = errorMessage.getText().trim();
                return text.isEmpty() ? null : text;
            });
        } catch (TimeoutException e) {
            throw new IllegalStateException("Login error message was not displayed", e);
        }
    }

    public boolean isErrorDisplayed() {
        try {
            return errorMessage.isDisplayed() && !errorMessage.getText().isBlank();
        } catch (NoSuchElementException | StaleElementReferenceException e) {
            return false;
        }
    }

    public boolean isPasswordFieldVisibleNow() {
        return isPresentAndDisplayed(passwordInput);
    }

    public boolean isLogoDisplayed() {
        return isDisplayed(logo);
    }

    public boolean isUsernameDisplayed() {
        return isDisplayed(usernameInput);
    }

    public boolean isPasswordDisplayed() {
        return isDisplayed(passwordInput);
    }

    public boolean isLoginButtonEnabled() {
        return waitVisible(loginButton, "Log In button").isEnabled();
    }

    public boolean isForgotPasswordLinkDisplayed() {
        return isDisplayed(forgotPasswordLink);
    }

    public String getPasswordFieldType() {
        return waitVisible(passwordInput, "password").getAttribute("type");
    }

    public String getUsernameValue() {
        try {
            return wait.until(d -> usernameInput.getAttribute("value"));
        } catch (TimeoutException e) {
            throw new IllegalStateException("Username field was not present within timeout", e);
        }
    }

    public String getLoginButtonLabel() {
        return waitVisible(loginButton, "Log In button").getAttribute("value");
    }

    public String getTitle() {
        return driver.getTitle();
    }

    public String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    @Step("Wait for navigation away from login page")
    public boolean waitForNavigationAwayFrom(String loginHost) {
        try {
            return wait.until(d -> !d.getCurrentUrl().contains(loginHost));
        } catch (TimeoutException e) {
            return false;
        }
    }

    private void type(WebElement element, String value, String fieldName) {
        try {
            WebElement field = waitVisible(element, fieldName);
            field.clear();
            field.sendKeys(value);
        } catch (WebDriverException e) {
            throw new IllegalStateException("Unable to type into " + fieldName, e);
        }
    }

    private void click(WebElement element, String elementName) {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(element)).click();
        } catch (WebDriverException e) {
            throw new IllegalStateException("Unable to click " + elementName, e);
        }
    }

    private WebElement waitVisible(WebElement element, String elementName) {
        try {
            return wait.until(ExpectedConditions.visibilityOf(element));
        } catch (TimeoutException e) {
            throw new IllegalStateException(elementName + " was not visible within timeout", e);
        }
    }

    private boolean isPresentAndDisplayed(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (NoSuchElementException | StaleElementReferenceException e) {
            return false;
        }
    }

    private boolean isDisplayed(WebElement element) {
        try {
            return wait.until(ExpectedConditions.visibilityOf(element)).isDisplayed();
        } catch (TimeoutException | NoSuchElementException e) {
            return false;
        }
    }
}
