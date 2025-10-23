describe('Full User Journey with Real Backend', () => {

  it('should allow a user to register, login, create, edit, and delete a task', () => {
    const userEmail = `test-${Date.now()}@test.com`;
    const userPassword = 'Password123';
    const taskTitle = 'Tarefa criada pelo Cypress';
    const editedTaskTitle = 'Tarefa editada pelo Cypress';

    // --- Etapa 1: Registro ---
    cy.registerByUI(userEmail, userPassword);
    cy.contains('Registro realizado com sucesso! Faça login agora.').should('be.visible');

    // --- Etapa 2: Login ---
    cy.loginByUI(userEmail, userPassword);
    cy.url().should('include', '/tasks'); // Verifica se o redirecionamento ocorreu
    cy.get('.empty-state').should('be.visible'); // Verifica se a lista de tarefas está vazia

    // --- Etapa 3: Criar Tarefa ---
    cy.get('input[formcontrolname="title"]').type(taskTitle, { force: true });
    cy.get('button').contains('Adicionar Tarefa').click();
    cy.contains('mat-card-title', taskTitle).should('be.visible');

    // --- Etapa 4: Editar Tarefa ---
    cy.contains('mat-card', taskTitle).within(() => {
      cy.get('button[aria-label="Editar tarefa"]').click();
      cy.wait(100); // Espera forçada para a renderização do modo de edição
      cy.get('button').contains('Salvar').should('be.visible');
      cy.get('input[formcontrolname="title"]').clear().type(editedTaskTitle);
      cy.get('button').contains('Salvar').click();
    });
    cy.contains('mat-card-title', editedTaskTitle).should('be.visible');
    cy.contains('mat-card-title', taskTitle).should('not.exist');

    // --- Etapa 5: Deletar Tarefa ---
    cy.stub(window, 'confirm').returns(true); // Stub para o diálogo de confirmação
    cy.contains('mat-card', editedTaskTitle).within(() => {
      cy.get('button[aria-label="Excluir tarefa"]').click();
    });
    cy.contains('mat-card-title', editedTaskTitle).should('not.exist');
    cy.get('.empty-state').should('be.visible');

    cy.log('Jornada completa do usuário com backend real testada com sucesso!');
  });
});
