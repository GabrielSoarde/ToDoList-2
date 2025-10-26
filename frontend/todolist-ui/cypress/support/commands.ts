// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
Cypress.Commands.add('loginByUI', (email, password) => {
  cy.visit('/');
  // Garante que está no modo de login (o padrão)
  cy.get('h2').contains('Login');
  cy.get('input[formcontrolname="email"]').type(email);
  cy.get('input[formcontrolname="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('registerByApi', (email, password) => {
  return cy.request('POST', `${Cypress.env('apiUrl')}/Auth/register`, {
    email,
    password,
    confirmPassword: password, // A confirmação é a mesma senha
  });
});

Cypress.Commands.add('loginByApi', (email, password) => {
  return cy.request('POST', `${Cypress.env('apiUrl')}/Auth/login`, {
    email,
    password,
  }).then((response) => {
    expect(response.status).to.eq(200);
    // Retorna o corpo da resposta para que o token possa ser acessado
    return response.body;
  });
});

Cypress.Commands.add('createTaskByApi', (task, token) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/ToDoItems`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: task,
  }).then((response) => {
    expect(response.status).to.eq(201); // 201 Created
    return response.body;
  });
});

Cypress.Commands.add('registerByUI', (email, password) => {
  cy.visit('/');
  // Clica para mudar para o modo de registro
  cy.contains('a', 'Crie uma agora').click();
  cy.get('h2').contains('Registrar');

  // Preenche o formulário de registro
  cy.get('input[formcontrolname="email"]').type(email);
  cy.get('input[formcontrolname="password"]').type(password);
  cy.get('input[formcontrolname="confirmPassword"]').type(password); // Usa a mesma senha para confirmar
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('registerByApi', (email, password) => {
  cy.request('POST', '/api/Auth/register', {
    email,
    password,
    confirmPassword: password,
  });
});
