describe("The mark complete feature", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("should mark a task as completed", () => {
    const taskTitle = "Task to Complete";

    cy.get('input[placeholder="Task title"]').type(taskTitle);
    cy.contains("button", "Add Task").click();

    cy.contains(taskTitle).should("be.visible");

    cy.contains(taskTitle)
      .parent()
      .find('[data-testid="basic-task-checkbox"]')
      .click();

    cy.contains(taskTitle)
      .parent()
      .parent()
      .find('[data-testid="basic-task-checkbox"]')
      .should("have.class", "bg-green-500");

    cy.contains(taskTitle)
      .should("have.css", "text-decoration")
      .and("include", "line-through");
  });

  it("should mark a task as uncompleted after marking it completed", () => {
    const taskTitle = "Task to Complete and Uncomplete";

    cy.get('input[placeholder="Task title"]').type(taskTitle);
    cy.contains("button", "Add Task").click();

    cy.contains(taskTitle).should("be.visible");

    cy.contains(taskTitle)
      .parent()
      .find('[data-testid="basic-task-checkbox"]')
      .click();

    cy.contains(taskTitle)
      .parent()
      .parent()
      .find('[data-testid="basic-task-checkbox"]')
      .should("have.class", "bg-green-500");

    cy.contains(taskTitle)
      .should("have.css", "text-decoration")
      .and("include", "line-through");

    cy.contains(taskTitle)
      .parent()
      .find('[data-testid="basic-task-checkbox"]')
      .click();

    cy.contains(taskTitle)
      .parent()
      .parent()
      .find('[data-testid="basic-task-checkbox"]')
      .should("not.have.class", "bg-green-500");

    cy.contains(taskTitle).should(
      "not.have.css",
      "text-decoration",
      "line-through"
    );
  });

  it("should mark multiple tasks as completed", () => {
    cy.get('input[placeholder="Task title"]').type("First Task");
    cy.contains("button", "Add Task").click();

    cy.get('input[placeholder="Task title"]').type("Second Task");
    cy.contains("button", "Add Task").click();

    cy.contains("First Task").should("be.visible");
    cy.contains("Second Task").should("be.visible");

    cy.contains("First Task")
      .parent()
      .find('[data-testid="basic-task-checkbox"]')
      .click();

    cy.contains("First Task")
      .parent()
      .parent()
      .find('[data-testid="basic-task-checkbox"]')
      .should("have.class", "bg-green-500");

    cy.contains("First Task")
      .should("have.css", "text-decoration")
      .and("include", "line-through");

    cy.contains("Second Task")
      .parent()
      .find('[data-testid="basic-task-checkbox"]')
      .click();

    cy.contains("Second Task")
      .parent()
      .parent()
      .find('[data-testid="basic-task-checkbox"]')
      .should("have.class", "bg-green-500");

    cy.contains("Second Task")
      .should("have.css", "text-decoration")
      .and("include", "line-through");
  });
});
