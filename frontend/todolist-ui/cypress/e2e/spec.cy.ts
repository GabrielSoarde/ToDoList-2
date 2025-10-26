describe('Full User Journey', () => {
  beforeEach(() => {
    // --- PREPARAÇÃO (SETUP) VIA API ---
    const userEmail = `test-${Date.now()}@test.com`;
    const userPassword = 'Password123';
    cy.registerByApi(userEmail, userPassword);
    cy.loginByApi(userEmail, userPassword);
    cy.visit('/tasks');
  });

  it('should allow a user to create, edit, complete, and delete a task with all fields', () => {
    // --- DADOS DE TESTE ---
    const taskData = {
      title: 'Revisar Relatório Trimestral',
      description: 'Verificar os dados de vendas do Q3.',
      priority: 'Alta',
      category: 'Trabalho'
    };
    const editedTaskData = {
      title: 'Finalizar Relatório Trimestral (Editado)',
      description: 'Dados de vendas do Q3 verificados. Adicionar conclusões.',
      priority: 'Média'
    };

    // --- ETAPA 1: CRIAR TAREFA COM TODOS OS CAMPOS ---
    cy.get('.empty-state').should('be.visible');

    // Preenche o formulário de adição, usando seletores específicos
    cy.get('app-add-task-form input[formcontrolname="title"]').type(taskData.title, { force: true });
    cy.get('app-add-task-form textarea[formcontrolname="description"]').type(taskData.description, { force: true });
    
    // Interage com o mat-select de Prioridade
    cy.get('app-add-task-form mat-select[formcontrolname="priority"]').click();
    cy.get('mat-option').contains(taskData.priority).click(); // Busca a opção globalmente

    // Interage com o mat-select de Categoria
    cy.get('app-add-task-form mat-select[formcontrolname="category"]').click();
    cy.get('mat-option').contains(taskData.category).click(); // Busca a opção globalmente

    cy.get('app-add-task-form button').contains('Adicionar Tarefa').click();

    // Verifica se o card foi criado com todos os dados
    cy.get('.todo-list__list-container').within(() => {
      cy.contains('mat-card-title', taskData.title).should('be.visible');
      cy.contains('.task-item__description', taskData.description).should('be.visible');
      cy.contains('.task-item__metadata-item', taskData.priority).should('be.visible');
      cy.contains('.task-item__metadata-item', taskData.category).should('be.visible');
    });

    // --- ETAPA 2: EDITAR TAREFA ---
    cy.get('.todo-list__list-container').within(() => {
      cy.contains('mat-card', taskData.title).find('button[aria-label="Editar tarefa"]').click();

      // Edita os campos de texto
      cy.get('input[formcontrolname="title"]').should('be.visible').clear().type(editedTaskData.title);
      cy.get('textarea[formcontrolname="description"]').clear().type(editedTaskData.description);
      
      // Interage com o mat-select de Prioridade
      cy.get('mat-select[formcontrolname="priority"]').click();
    });
    // A busca pela opção DEVE ser feita fora do .within(), no escopo global
    cy.get('mat-option').contains(editedTaskData.priority).click();

    // Salva as alterações
    cy.get('.todo-list__list-container').find('button').contains('Salvar').click();

    // Verifica se o card foi atualizado
    cy.contains('mat-card-title', editedTaskData.title).should('be.visible');
    cy.contains('.task-item__description', editedTaskData.description).should('be.visible');
    cy.contains('.task-item__metadata-item', editedTaskData.priority).should('be.visible');

    // --- ETAPA 3: MARCAR COMO CONCLUÍDA ---
    const taskCard = cy.contains('mat-card', editedTaskData.title);
    // Clica no input nativo dentro do mat-checkbox para maior robustez
    taskCard.find('mat-checkbox input[type="checkbox"]').click({ force: true });
    taskCard.should('have.class', 'task-item--completed');
    // Desmarca
    taskCard.find('mat-checkbox input[type="checkbox"]').click({ force: true });
    taskCard.should('not.have.class', 'task-item--completed');

    // --- ETAPA 4: DELETAR TAREFA ---
    cy.stub(window, 'confirm').returns(true);
    cy.contains('mat-card', editedTaskData.title).find('button[aria-label="Excluir tarefa"]').click();
    cy.contains('mat-card-title', editedTaskData.title).should('not.exist');
    cy.get('.empty-state').should('be.visible');

    cy.log('Jornada completa e detalhada do usuário testada com sucesso!');
  });
});
