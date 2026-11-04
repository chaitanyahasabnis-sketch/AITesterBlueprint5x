package com.salesforce.tests;

import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

@Epic("Salesforce")
@Feature("Login - Valid Scenarios")
public class ValidLoginTest extends BaseTest {

    @Test(priority = 1, description = "Login page loads with all UI elements")
    @Severity(SeverityLevel.BLOCKER)
    @Description("Verify title, logo, username, Log In button, Remember me and Forgot password are present and password is hidden until username is submitted")
    public void verifyLoginPageUiElements() {
        SoftAssert soft = new SoftAssert();
        soft.assertTrue(loginPage.getTitle().contains("Login | Salesforce"), "Page title mismatch: " + loginPage.getTitle());
        soft.assertTrue(loginPage.isLogoDisplayed(), "Logo not displayed");
        soft.assertTrue(loginPage.isUsernameDisplayed(), "Username field not displayed");
        soft.assertFalse(loginPage.isPasswordFieldVisibleNow(), "Password field displayed before username submitted");
        soft.assertTrue(loginPage.isLoginButtonEnabled(), "Log In button not enabled");
        soft.assertEquals(loginPage.getLoginButtonLabel(), "Log In", "Log In button label mismatch");
        soft.assertEquals(loginPage.getRememberMeLabelText(), "Remember me", "Remember me label mismatch");
        soft.assertTrue(loginPage.isForgotPasswordLinkDisplayed(), "Forgot password link not displayed");
        soft.assertFalse(loginPage.isErrorDisplayed(), "Error displayed on initial load");
        soft.assertAll();
    }

    @Test(priority = 2, description = "Submitting a username reveals a masked password field")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify the password field appears after username submission and is of type password")
    public void verifyPasswordRevealedAndMasked() {
        String username = "qa.automation@example.com";
        loginPage.submitUsername(username).enterPassword("SamplePassword123");
        Assert.assertTrue(loginPage.isPasswordDisplayed(), "Password field not displayed after username submitted");
        Assert.assertEquals(loginPage.getPasswordFieldType(), "password", "Password field is not masked");
        Assert.assertEquals(loginPage.getUsernameValue(), username, "Username value not retained");
        Assert.assertFalse(loginPage.isErrorDisplayed(), "Error displayed after valid username submission");
    }

    @Test(priority = 3, description = "Username field accepts a valid email")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify the username field retains the entered value")
    public void verifyUsernameAcceptsInput() {
        String username = "qa.automation@example.com";
        loginPage.enterUsername(username);
        Assert.assertEquals(loginPage.getUsernameValue(), username, "Username value not retained");
    }

    @Test(priority = 4, description = "Remember me checkbox toggles")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify Remember me is unchecked by default and can be checked and unchecked")
    public void verifyRememberMeToggle() {
        Assert.assertFalse(loginPage.isRememberMeSelected(), "Remember me checked by default");
        loginPage.setRememberMe(true);
        Assert.assertTrue(loginPage.isRememberMeSelected(), "Remember me not checked");
        loginPage.setRememberMe(false);
        Assert.assertFalse(loginPage.isRememberMeSelected(), "Remember me not unchecked");
    }

    @Test(priority = 5, description = "Valid credentials navigate away from login page")
    @Severity(SeverityLevel.BLOCKER)
    @Description("Login with credentials supplied via SF_USERNAME and SF_PASSWORD")
    public void verifyValidLogin() {
        String username = System.getProperty("sfUsername", System.getenv("SF_USERNAME"));
        String password = System.getProperty("sfPassword", System.getenv("SF_PASSWORD"));
        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            throw new SkipException("Valid credentials not provided: set SF_USERNAME and SF_PASSWORD");
        }
        loginPage.setRememberMe(true).doLogin(username, password);
        Assert.assertTrue(loginPage.waitForNavigationAwayFrom(LOGIN_HOST), "Still on login page: " + loginPage.getCurrentUrl());
        Assert.assertFalse(loginPage.getCurrentUrl().contains(LOGIN_HOST), "Login did not succeed");
    }
}
