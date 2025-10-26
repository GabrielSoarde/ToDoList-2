# 3. Fluxo de Git

Este documento descreve as convenções para branches, commits e Pull Requests (PRs) para manter o histórico do Git limpo e organizado.

## Branches

-   **`main`**: Branch principal. Contém o código de produção estável. Ninguém deve commitar diretamente na `main`.
-   **`develop`**: Branch de desenvolvimento. Contém as features mais recentes que serão incluídas na próxima release. É a base para a criação de novas branches de features.

### Nomenclatura de Branches

Crie novas branches a partir da `develop` seguindo o padrão:

```
<tipo>/<descricao-curta>
```

-   **`tipo`**: Tipo da tarefa que está sendo executada.
    -   `feat`: Para novas funcionalidades.
    -   `fix`: Para correção de bugs.
    -   `docs`: Para alterações na documentação.
    -   `style`: Para ajustes de formatação e estilo.
    -   `refactor`: Para refatorações de código que não alteram a funcionalidade.
    -   `test`: Para adição ou modificação de testes.

-   **Exemplos**:
    -   `feat/user-authentication`
    -   `fix/login-button-bug`
    -   `docs/update-readme`

## Commits

Siga o padrão **Conventional Commits**. Isso torna o histórico mais legível e permite a automação de changelogs.

### Formato da Mensagem de Commit

```
<tipo>(<escopo>): <assunto>

[corpo opcional]

[rodapé opcional]
```

-   **`tipo`**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore` (para tarefas de build, etc.).
-   **`escopo`** (opcional): A parte do código que está sendo alterada (ex: `auth`, `todo-list`, `api`).
-   **`assunto`**: Descrição concisa da alteração em letra minúscula e no imperativo (ex: "add login feature" em vez de "added login feature").

-   **Exemplos**:
    -   `feat(auth): add jwt authentication`
    -   `fix(todo-list): correct task deletion bug`
    -   `docs: update project structure documentation`

## Pull Requests (PRs)

1.  **Criação**: Ao concluir uma tarefa, crie um PR da sua branch para a `develop`.
2.  **Descrição**: O PR deve ter um título claro e uma descrição que explique **o que** foi feito e **por que** foi feito. Se o PR resolve uma `Issue`, mencione-a na descrição (ex: `Closes #42`).
3.  **Revisão**: Pelo menos **um** outro desenvolvedor deve revisar e aprovar o PR antes do merge.
4.  **Merge**: Após a aprovação, o merge deve ser feito usando **"Squash and merge"** para manter o histórico da `develop` limpo, com um único commit por feature/fix.
