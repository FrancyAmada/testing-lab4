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
});
