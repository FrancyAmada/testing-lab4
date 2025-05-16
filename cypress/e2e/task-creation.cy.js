describe("Task Creation Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should allow a user to create a new basic task", () => {
    const taskTitle = "Buy groceries";

    cy.get('[data-testid="new-task-title-input"]').type(taskTitle);
    cy.wait(300);

    cy.get('[data-testid="new-task-type-input"]').select("basic");
    cy.wait(300);

    cy.get('[data-testid="new-task-add-button"]').click();
    cy.wait(300);

    cy.contains(taskTitle, { timeout: 5000 }).should("be.visible");

    cy.contains("Task added successfully!").should("be.visible");
  });

  it("should create a timed task", () => {
    const taskTitle = "Work on my Project";

    cy.get('[data-testid="new-task-title-input"]').type(taskTitle);
    cy.wait(300);

    cy.get('[data-testid="new-task-type-input"]').select("timed");
    cy.wait(300);

    cy.get('[data-testid="new-task-timed-hour-input"]').clear().type("1");
    cy.wait(300);

    cy.get('[data-testid="new-task-timed-minutes-input"]').clear().type("30");
    cy.wait(800);

    cy.get('[data-testid="new-task-add-button"]').click();
    cy.wait(1000);

    cy.contains(taskTitle, { timeout: 5000 }).should("be.visible");
    cy.contains("Task added successfully!").should("be.visible");
  });

  it("should create a checklist task", () => {
    const taskTitle = "Grocery List";

    cy.get('[data-testid="new-task-title-input"]').type(taskTitle);
    cy.wait(300);

    cy.get('[data-testid="new-task-type-input"]').select("checklist");
    cy.wait(300);

    cy.get('[data-testid="new-task-due-date-input"]').type(
      new Date(Date.now() + 86400000).toISOString().slice(0, 16)
    );
    cy.wait(1000);

    cy.get('[data-testid="new-task-add-button"]').click();
    cy.wait(1000);

    cy.contains(taskTitle).should("exist");
    cy.contains("Task added successfully!").should("be.visible");
  });

  it("should create new tasks for the checklist task", () => {
    const checklistItems = ["Milk", "Eggs", "Bread"];

    checklistItems.forEach((item) => {
      cy.get('[data-testid="checklist-task-new-item-input"]').type(`${item}`);
      cy.wait(300);

      cy.get('[data-testid="checklist-task-new-item-button"]').click();
      cy.wait(500);

      cy.contains(item).should("exist");
    });
  });

  after(() => {
    cy.request("DELETE", "http://localhost:3000/api/tasks");
  });
});
