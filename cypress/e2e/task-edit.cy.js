describe("Task Edit Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should allow a user to edit a basic task", () => {
    const originalTitle = "Go to the mall";
    const updatedTitle = "Buy groceries and cook dinner";

    cy.get('[data-testid="new-task-title-input"]').type(originalTitle);
    cy.wait(300);
    cy.get('[data-testid="new-task-type-input"]').select("basic");
    cy.wait(300);
    cy.get('[data-testid="new-task-add-button"]').click();
    cy.wait(300);
    cy.contains(originalTitle, { timeout: 5000 }).should("be.visible");
    cy.wait(500);

    cy.get('[data-testid="basic-task-editbutton"]').click();
    cy.wait(300);
    cy.get('[data-testid="basic-task-editinput"]').clear().type(updatedTitle);
    cy.wait(300);
    cy.get('[data-testid="basic-task-savebutton"]').click();
    cy.wait(500);

    cy.contains(updatedTitle).should("be.visible");
    cy.contains(originalTitle).should("not.exist");
  });

  it("should allow a user to edit a timed task", () => {
    const originalTitle = "Workout session";
    const updatedTitle = "Morning yoga and workout";
    const addedHours = 1;
    const addedMinutes = 30;

    cy.get('[data-testid="new-task-title-input"]').type(originalTitle);
    cy.wait(300);
    cy.get('[data-testid="new-task-type-input"]').select("timed");
    cy.wait(300);
    cy.get('[data-testid="new-task-add-button"]').click();
    cy.wait(300);
    cy.contains(originalTitle, { timeout: 5000 }).should("be.visible");
    cy.wait(500);

    cy.get('[data-testid="timed-task-editbutton"]').click();
    cy.wait(300);
    cy.get('[data-testid="timed-task-editinput"]').clear().type(updatedTitle);
    cy.get('[data-testid="timed-task-edit-hourinput"]')
      .clear()
      .type(`${addedHours}`);
    cy.get('[data-testid="timed-task-edit-minuteinput"]')
      .clear()
      .type(`${addedMinutes}`);
    cy.wait(300);
    cy.get('[data-testid="timed-task-savebutton"]').click();
    cy.wait(500);

    cy.contains(updatedTitle).should("be.visible");
    cy.contains(originalTitle).should("not.exist");
  });
});
