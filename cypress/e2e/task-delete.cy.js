describe("The delete feature", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("should delete a task", () => {
    const taskTitle = "Task to Delete";

    cy.get('input[placeholder="Task title"]').type(taskTitle);
    cy.contains("button", "Add Task").click();

    cy.contains(taskTitle).should("be.visible");

    cy.contains(taskTitle)
      .parent()
      .parent()
      .find('[data-testid="basic-task-deletebutton"]')
      .click();

    cy.contains(taskTitle).should("not.exist");
  });

  it("should delete a timed task", () => {
    const taskTitle = "Timed Task to Delete";

    cy.get('select[data-testid="new-task-type-input"]').select("timed");
    cy.get('input[placeholder="Task title"]').type(taskTitle);

    cy.get('input[type="number"]').first().clear().type("2");
    cy.get('input[type="number"]').eq(1).clear().type("30");

    cy.contains("button", "Add Task").click();
    cy.contains(taskTitle).should("be.visible");

    cy.contains(taskTitle)
      .parent()
      .parent()
      .find('[data-testid="timed-task-deletebutton"]')
      .click();

    cy.contains(taskTitle).should("not.exist");
  });

  after(() => {
    cy.request("DELETE", "http://localhost:3000/api/tasks");
  });
});
