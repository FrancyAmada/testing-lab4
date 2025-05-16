describe("Task Creation Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should allow a user to create a new basic task", () => {
    const taskTitle = "Buy groceries";

    cy.get('[data-testid="new-task-title-input"]').type(taskTitle);

    cy.get('[data-testid="new-task-type-input"]').select("basic");

    cy.get('[data-testid="new-task-add-button"]').click();

    cy.contains(taskTitle, { timeout: 5000 }).should("be.visible");

    cy.contains("Task added successfully!").should("be.visible");
  });

  it("should create a timed task", () => {
    cy.get('[data-testid="new-task-title-input"]').type("My Timed Task");
    cy.wait(300);

    cy.get('[data-testid="new-task-type-input"]').select("timed");
    cy.wait(300);

    cy.get('[data-testid="new-task-timed-hour-input"]').clear().type("1");
    cy.wait(300);

    cy.get('[data-testid="new-task-timed-minutes-input"]').clear().type("30");
    cy.wait(300);

    cy.get('[data-testid="new-task-add-button"]').click();
    cy.wait(1000);

    cy.contains("My Timed Task").should("exist");
  });

  it("should create a checklist task", () => {
    cy.get('[data-testid="new-task-title-input"]').type("My Checklist Task");
    cy.wait(300);

    cy.get('[data-testid="new-task-type-input"]').select("checklist");
    cy.wait(300);

    cy.get('[data-testid="new-task-due-date-input"]').type(
      new Date(Date.now() + 86400000).toISOString().slice(0, 16)
    );
    cy.wait(300);

    cy.get('[data-testid="new-task-add-button"]').click();
    cy.wait(1000);

    cy.contains("My Checklist Task").should("exist");
  });
});
