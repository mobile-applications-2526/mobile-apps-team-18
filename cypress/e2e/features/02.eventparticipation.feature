Feature: User Login
    Background: 
        Given I am logged in as "sander" with password "sander123"

    Scenario: Successfully joining an event
        When I am on the event overview page for "Spring Boot Workshop"
        When I press the join event button
        Then I should be participating in the event

    Scenario: Successfully leaving an event
        When I am on the event overview page for "Spring Boot Workshop"
        When I press the join event button
        When I press the leave event button
        Then I should not be participating in the event