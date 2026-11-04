package com.salesforce.tests;

import com.salesforce.pages.LoginPage;
import io.qameta.allure.Allure;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;

import java.io.ByteArrayInputStream;
import java.time.Duration;

public abstract class BaseTest {

    protected static final String BASE_URL = System.getProperty("baseUrl", "https://login.salesforce.com/?locale=in");
    protected static final String LOGIN_HOST = "login.salesforce.com";
    protected static final Duration TIMEOUT = Duration.ofSeconds(Long.getLong("timeoutSeconds", 20L));

    protected WebDriver driver;
    protected LoginPage loginPage;

    @BeforeTest(alwaysRun = true)
    public void setUpDriver() {
        try {
            ChromeOptions options = new ChromeOptions();
            if (Boolean.parseBoolean(System.getProperty("headless", "false"))) {
                options.addArguments("--headless=new");
            }
            options.addArguments("--start-maximized", "--disable-notifications", "--lang=en-IN");
            driver = new ChromeDriver(options);
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(60));
        } catch (WebDriverException e) {
            throw new IllegalStateException("Failed to start ChromeDriver", e);
        }
    }

    @BeforeMethod(alwaysRun = true)
    public void openLoginPage() {
        driver.manage().deleteAllCookies();
        loginPage = new LoginPage(driver, TIMEOUT).open(BASE_URL);
    }

    @AfterMethod(alwaysRun = true)
    public void captureFailure(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE && driver != null) {
            try {
                byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
                Allure.addAttachment(result.getName() + " - failure", "image/png", new ByteArrayInputStream(screenshot), "png");
            } catch (WebDriverException e) {
                Allure.addAttachment("Screenshot error", e.getMessage());
            }
        }
    }

    @AfterTest(alwaysRun = true)
    public void tearDownDriver() {
        if (driver != null) {
            try {
                driver.quit();
            } catch (WebDriverException e) {
                Allure.addAttachment("Driver quit error", e.getMessage());
            } finally {
                driver = null;
            }
        }
    }
}
