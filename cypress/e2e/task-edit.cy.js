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

  it("should allow a user to edit a checklist task title", () => {
    const originalTitle = "Checklist Task 1";
    const updatedTitle = "Updated Checklist Task Title";

    cy.get('[data-testid="new-task-title-input"]').type(originalTitle);
    cy.wait(300);
    cy.get('[data-testid="new-task-type-input"]').select("checklist");
    cy.wait(300);
    cy.get('[data-testid="new-task-add-button"]').click();
    cy.wait(500);

    cy.contains(originalTitle, { timeout: 5000 }).should("be.visible");
    cy.wait(300);

    cy.get('[data-testid="checklist-task-editbutton"]').click();
    cy.wait(300);
    cy.get('[data-testid="checklist-task-editinput"]')
      .clear()
      .type(updatedTitle);
    cy.wait(300);
    cy.get('[data-testid="checklist-task-savebutton"]').click();
    cy.wait(500);

    cy.contains(updatedTitle).should("be.visible");
    cy.contains(originalTitle).should("not.exist");
  });

  it("should allow a user to edit a checklist item", () => {
    const taskTitle = "Updated Checklist Task Title";
    const itemText = "Original checklist item";
    const updatedItemText = "Updated checklist item";

    cy.contains(taskTitle).should("be.visible");
    cy.get('[data-testid="checklist-task-new-item-input"]').type(itemText);
    cy.get('[data-testid="checklist-task-new-item-button"]').click();
    cy.wait(300);

    cy.get('[data-testid="checklist-task-item-editbutton"]').first().click();
    cy.wait(300);
    cy.get('[data-testid="checklist-task-item-editinput"]')
      .clear()
      .type(`${updatedItemText}`);
    cy.wait(500);
    cy.get('[data-testid="checklist-task-item-savebutton"]').first().click();
    cy.wait(300);

    cy.contains(updatedItemText).should("be.visible");
    cy.contains(itemText).should("not.exist");
  });

  after(() => {
    cy.request("DELETE", "http://localhost:3000/api/tasks");
  });
});
