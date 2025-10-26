describe('Filtro e Busca de Tarefas', () => {
  const tasks = [
    { title: 'Comprar pão', category: 'Pessoal', priority: 'Média', isComplete: false },
    { title: 'Relatório semanal', category: 'Trabalho', priority: 'Alta', isComplete: false },
    { title: 'Pagar conta de luz', category: 'Casa', priority: 'Alta', isComplete: true },
    { title: 'Revisar documento', category: 'Trabalho', priority: 'Baixa', isComplete: true },
    { title: 'Ligar para o cliente', category: 'Trabalho', priority: 'Alta', isComplete: false },
  ];

  beforeEach(() => {
    const testUser = {
      email: `testuser_${Date.now()}@example.com`,
      password: 'Password123!',
    };

    // Evita que o teste falhe por exceções não capturadas da aplicação
    cy.on('uncaught:exception', (err, runnable) => {
      console.error('Uncaught exception', err);
      return false;
    });

    // 1. Registra e loga o usuário via API
    cy.registerByApi(testUser.email, testUser.password);
    cy.loginByApi(testUser.email, testUser.password).then((authResponse) => {
      const token = authResponse.token;

      // 2. Define o token no localStorage para autenticar a UI
      cy.window().then((win) => {
        win.localStorage.setItem('auth_token', token);
      });

      // 3. Cria as tarefas de teste via API
      tasks.forEach(task => {
        cy.createTaskByApi(task, token).then(createdTask => {
          // Se a tarefa deve ser concluída, faz uma requisição PUT para atualizá-la
          if (task.isComplete) {
            cy.request({
              method: 'PUT',
              url: `${Cypress.env('apiUrl')}/ToDoItems/${createdTask.id}`,
              headers: { Authorization: `Bearer ${token}` },
              body: { ...createdTask, isComplete: true },
            });
          }
        });
      });

      // 4. Visita a página principal após a configuração
      cy.visit('/');
      // 5. ESPERA até que todas as 5 tarefas estejam renderizadas, sincronizando o teste
      cy.get('mat-card.task-item').should('have.length', 5);
    });
  });

  it('deve filtrar as tarefas por status (Todas, Pendentes, Concluídas)', () => {
    // Garante que todas as 5 tarefas são exibidas inicialmente
    cy.get('mat-card.task-item').should('have.length', 5);

    // 1. Filtra por Pendentes
    cy.contains('button', 'Pendentes').click();
    cy.get('mat-card.task-item').should('have.length', 3);
    cy.get('mat-card.task-item').should('not.have.class', 'task-item--completed');

    // 2. Filtra por Concluídas
    cy.contains('button', 'Concluídas').click();
    cy.get('mat-card.task-item').should('have.length', 2);
    cy.get('mat-card.task-item').should('have.class', 'task-item--completed');

    // 3. Volta para Todas
    cy.contains('button', 'Todas').click();
    cy.get('mat-card.task-item').should('have.length', 5);
  });

  it('deve buscar tarefas pelo título', () => {
    const searchTerm = 'Relatório';

    // Usa um seletor robusto para encontrar o input pelo seu label
    const searchInput = cy.contains('mat-form-field', 'Buscar tarefa').find('input');
    searchInput.should('be.visible');

    // Digita no campo de busca
    searchInput.type(searchTerm);

    // Verifica se apenas 1 tarefa é exibida
    cy.get('mat-card.task-item').should('have.length', 1);
    cy.get('mat-card.task-item').should('contain.text', 'Relatório semanal');

    // Limpa o campo de busca
    cy.contains('mat-form-field', 'Buscar tarefa').find('input').clear();

    // Verifica se todas as tarefas são exibidas novamente
    cy.get('mat-card.task-item').should('have.length', 5);
  });

  it('deve filtrar as tarefas por categoria', () => {
    // Adiciona uma espera explícita para garantir que os filtros estejam prontos
    cy.contains('mat-form-field', 'Buscar tarefa').find('input').should('be.visible');

    // Clica no mat-select para abrir as opções
    cy.get('mat-select[formcontrolname="category"]').click();
    // Clica na opção 'Trabalho'
    cy.get('mat-option').contains('Trabalho').click();

    // Verifica se apenas as 3 tarefas de 'Trabalho' são exibidas
    cy.get('mat-card.task-item').should('have.length', 3);
    cy.get('mat-card.task-item').each(($card) => {
      cy.wrap($card).should('contain.text', 'Trabalho');
    });
  });
});
