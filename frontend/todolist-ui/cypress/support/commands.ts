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
