package com.salesforce.tests;

import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

@Epic("Salesforce")
@Feature("Login - Invalid Scenarios")
public class InvalidLoginTest extends BaseTest {

    private static final String INVALID_CREDENTIALS_ERROR = "Error: Please check your username and password. If you still can't log in, contact your Salesforce administrator.";
    private static final String EMPTY_USERNAME_ERROR = "Error: Please enter your username.";
    private static final String EMPTY_PASSWORD_ERROR = "Error: Please enter your password.";

    @DataProvider(name = "invalidCredentials")
    public Object[][] invalidCredentials() {
        return new Object[][]{
                {"invalid.user@example.com", "WrongPass@123", INVALID_CREDENTIALS_ERROR},
                {"invalid.user@example.com", "", EMPTY_PASSWORD_ERROR},
                {"", "WrongPass@123", EMPTY_USERNAME_ERROR},
                {"", "", EMPTY_USERNAME_ERROR}
        };
    }

    @Test(priority = 1, dataProvider = "invalidCredentials", description = "Invalid credentials show the expected error")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verify the error message for invalid, empty username and empty password combinations")
    public void verifyInvalidLoginShowsError(String username, String password, String expectedError) {
        loginPage.doLogin(username, password);
        Assert.assertEquals(loginPage.getErrorMessage(), expectedError, "Error message mismatch");
        Assert.assertTrue(loginPage.getCurrentUrl().contains(LOGIN_HOST), "Navigated away from login page");
    }

    @Test(priority = 2, description = "Failed login with Remember me checked stays on login page")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verify a failed attempt with Remember me checked keeps the user on the login page with the password cleared")
    public void verifyFailedLoginWithRememberMe() {
        loginPage.setRememberMe(true).doLogin("invalid.user@example.com", "WrongPass@123");
        Assert.assertEquals(loginPage.getErrorMessage(), INVALID_CREDENTIALS_ERROR, "Error message mismatch");
        Assert.assertTrue(loginPage.getCurrentUrl().contains(LOGIN_HOST), "Navigated away from login page");
        Assert.assertTrue(loginPage.getPasswordValue().isEmpty(), "Password not cleared after failed login");
    }
}
