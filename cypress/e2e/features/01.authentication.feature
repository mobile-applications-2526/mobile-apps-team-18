Feature: User Login
    Background: 
        Given I am on the login page

    Scenario: Successful login
        When I enter valid credentials
        Then I should be redirected to the homepage

    Scenario: Unsuccessful login
        When I enter invalid credentials
        Then I should see a message saying "Login failed, please try again..."


        