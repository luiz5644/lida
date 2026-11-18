# Gestão de Rebanho

Aplicativo web **mobile-first** de gestão de rebanho construído com **TypeScript puro**, **HTML** e **CSS**, sem frameworks, seguindo os princípios da **Clean Architecture**.

## Stack

- TypeScript (strict) compilado para ES Modules e executado no navegador
- HTML + CSS + JavaScript (sem framework)
- Persistência em `localStorage`, isolada atrás de interfaces de repositório
- Build com `tsc`
- Única dependência de desenvolvimento: `typescript`

## Arquitetura

As dependências apontam sempre para dentro:

```
apresentacao -> aplicacao -> dominio <- infraestrutura
```

- `src/dominio/`: entidades, enumerações, erros e interfaces de repositório. Não conhece DOM, `localStorage` nem nenhuma outra camada.
- `src/aplicacao/casos-de-uso/`: uma classe por caso de uso, com o método `executar()`. Recebe as interfaces de repositório por construtor (injeção de dependência).
- `src/infraestrutura/`: `ClienteLocalStorage` (wrapper genérico de JSON) e as implementações dos repositórios.
- `src/apresentacao/`: MVC simples adaptado a uma SPA.
  - `visoes/`: montam o DOM de cada tela dentro de um `ContextoTela` (`cabecalho`, `conteudo`, `flutuantes`).
  - `controladores/`: ligam eventos da tela aos casos de uso.
  - `componentes/`: aparelho, barra de navegação, cabeçalho, cards, bottom sheet, toast, FAB, campos segmentados, confirmação e utilitários de DOM.
  - `utilitarios/`: formatadores de data, moeda, peso, unidades e status.
  - `estilos/`: `global.css` (tokens e reset) e `app.css` (shell do aparelho e componentes).
- `src/principal/conteiner.ts`: composition root. Instancia repositórios e casos de uso.
- `src/principal/roteador.ts`: roteador por hash (`#/animais`, `#/pesagens`...).
- `src/principal/index.ts`: ponto de entrada. Monta o shell do aparelho e renderiza a rota atual.
- `publico/index.html`: única página da aplicação (SPA).

## Interface mobile-first

- Em telas com **768px ou mais**, a aplicação aparece dentro de um aparelho simulado de **390×844**, com moldura escura, cantos arredondados, sombra e ilha da câmera.
- Em telas menores que **768px**, o app ocupa toda a viewport (`100dvh`), sem moldura.
- Barra de status simulada (hora, sinal, Wi-Fi e bateria).
- Cabeçalho de tela com título/subtítulo e botão de voltar quando aplicável.
- Navegação inferior fixa: **Início, Animais, Pesagens, Manejos, Mais**.
- Listas em cards; tocar em um card abre os detalhes em uma bottom sheet com **Editar** e **Excluir**.
- O botão flutuante (**FAB**) abre o formulário de criação em bottom sheet de tela cheia.
- Feedback por **toast**; nenhuma ação usa `alert()`.
- Alvos de toque com pelo menos 44×44px e campos com fonte mínima de 16px (evita zoom automático no iOS).

## Rotas

| Rota | Tela |
| --- | --- |
| `#/inicio` | Painel com resumo do rebanho e atalhos |
| `#/animais` | Lista de animais |
| `#/pesagens` | Lista de pesagens |
| `#/manejos` | Lista de manejos |
| `#/mais` | Menu com Propriedades, Alimentação e Carência |
| `#/propriedades` | Lista de propriedades |
| `#/alimentacao` | Alimentos e registros alimentares (abas) |
| `#/carencia` | Produtos sanitários e controles de carência (abas) |

A navegação não recarrega a página: o roteador por hash troca a tela, atualiza o título e o estado ativo da barra inferior.

## Regras de negócio

- `dataLiberacao = dataAplicacao + carenciaDias`; o status do controle de carência é calculado automaticamente (`EM_CARENCIA` ou `LIBERADO`).
- Não é permitido registrar pesagem com peso menor ou igual a zero.
- Não é permitido remover uma propriedade que possua animais.
- O brinco é único por propriedade.
- Quantidade de alimento registrada deve ser maior que zero.
- Área da propriedade deve ser maior que zero.
- Custo unitário e dias de carência não podem ser negativos.
- Datas de nascimento não podem estar no futuro.
- Validações ficam nas entidades e nos casos de uso, nunca nas views.
- Erros de domínio são exceções tipadas (`ErroDeDominio`) e são exibidos ao usuário pelos controladores em formato de toast.

## Como compilar e executar

```bash
# instalar dependências
npm install

# compilar TypeScript para a pasta dist/
npm run build

# servir o projeto a partir da raiz (obrigatório por causa dos ES Modules)
npm start
```

`npm start` usa `npx serve .`. Abra o endereço exibido (normalmente `http://localhost:3000`) e acesse `publico/index.html`.

Para desenvolvimento com recompilação automática:

```bash
npm run watch
```

> Observação: abrir o HTML diretamente via `file://` não funciona, pois os módulos ES precisam de um servidor HTTP.

## Estrutura

```
gestao-rebanho/
├── package.json
├── tsconfig.json
├── README.md
├── publico/
│   └── index.html              # SPA
└── src/
    ├── dominio/
    │   ├── entidades/
    │   ├── enumeracoes/
    │   ├── erros/
    │   └── repositorios/
    ├── aplicacao/
    │   └── casos-de-uso/
    ├── infraestrutura/
    │   ├── armazenamento/
    │   └── repositorios/
    ├── apresentacao/
    │   ├── componentes/
    │   ├── controladores/
    │   ├── estilos/
    │   │   ├── global.css
    │   │   └── app.css
    │   ├── utilitarios/
    │   └── visoes/
    └── principal/
        ├── conteiner.ts
        ├── index.ts
        └── roteador.ts
```

## Limpar os dados

Tudo fica no `localStorage` do navegador, sob o prefixo `gestao-rebanho:`.
Para reiniciar do zero, abra o DevTools (F12) → Console e execute:

```javascript
Object.keys(localStorage)
  .filter((chave) => chave.startsWith("gestao-rebanho:"))
  .forEach((chave) => localStorage.removeItem(chave));
```

Depois recarregue a página: o usuário padrão será criado novamente.

## Fluxo de teste manual

1. Rode `npm install`, `npm run build` e `npm start`.
2. Abra `publico/index.html`. Um usuário padrão (`Administrador`) é criado automaticamente no primeiro acesso.
3. Confira a moldura do aparelho em uma janela larga e a tela cheia ao estreitar para menos de 768px.
4. **Mais → Propriedades**: crie uma propriedade (nome, localização, área e usuário responsável). Tocar no card deve abrir os detalhes.
5. **Animais**: crie um animal vinculado à propriedade. Tente repetir o mesmo brinco na mesma propriedade e confirme que o sistema bloqueia.
6. **Pesagens**: registre uma pesagem para o animal. Tente peso `0` e confirme o toast de erro.
7. **Manejos**: registre um manejo (vacinação, vermifugação, etc.).
8. **Mais → Alimentação**: cadastre um alimento e depois um registro alimentar vinculando animal + alimento.
9. **Mais → Carência**: cadastre um produto sanitário com dias de carência e aplique no animal. Confira a data de liberação calculada e o status (`EM_CARENCIA`/`LIBERADO`).
10. Tente excluir a propriedade que possui animais: o sistema deve impedir.
11. Recarregue a página: os dados permanecem salvos no `localStorage` e a rota atual é restaurada pelo hash.
12. Teste a busca de cada tela, a troca de abas em Alimentação/Carência e a navegação inferior.
