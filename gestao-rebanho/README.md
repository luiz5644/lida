# lida.

Protótipo acadêmico **mobile-first** de gestão de rebanho, feito com **TypeScript puro**, HTML e CSS — sem frameworks — e organizado em **Clean Architecture**.

O app simula um celular: em telas com 768 px ou mais ele aparece dentro de uma moldura de 390×844 px; abaixo disso ocupa a viewport inteira. Toda a navegação acontece em uma única página (`publico/index.html`) por rotas de hash.

> **Registro demonstrativo.** Os dados ficam apenas nesta sessão do navegador (`sessionStorage`) e são descartados ao fechar a aba.

## Stack

- TypeScript (strict) compilado para ES Modules
- HTML + CSS + JavaScript, sem framework
- Persistência em `sessionStorage`, atrás de interfaces de repositório
- Build com `tsc`
- Única dependência de desenvolvimento: `typescript`

## Arquitetura

As dependências apontam sempre para dentro:

```
apresentacao -> aplicacao -> dominio <- infraestrutura
```

| Camada | Conteúdo |
| --- | --- |
| `src/dominio` | Entidades, enumerações, erros, utilitários de data, constantes, interfaces de repositório e de serviços. Não conhece DOM nem armazenamento. |
| `src/aplicacao` | Casos de uso (uma classe por ação, com `executar()`) e DTOs. Recebem interfaces por construtor. |
| `src/infraestrutura` | `ClienteArmazenamentoSessao`, repositórios `...Sessao`, serviços simulados de código de acesso e localidades, e o seed demonstrativo. |
| `src/apresentacao` | Componentes, estilos, visões, controladores e utilitários de formatação. Usa `ContextoTela` e não importa nada de `principal`. |
| `src/principal` | `conteiner.ts` (composition root), `roteador.ts` (hash router) e `index.ts` (bootstrap, guardas de sessão e montagem do aparelho). |

## Estrutura

```
gestao-rebanho/
├── package.json
├── tsconfig.json
├── README.md
├── scripts/
│   ├── limpar-publico.mjs      # limpa saídas geradas em publico/
│   └── copiar-estilos.mjs      # copia src/apresentacao/estilos -> publico/estilos
├── publico/
│   ├── index.html              # SPA
│   ├── assets/                 # sprite de ícones, logos e fundo de boas-vindas
│   ├── dados/localidades.json  # UFs e municípios
│   ├── estilos/                # gerado pelo build
│   └── js/                     # gerado pelo build
└── src/
    ├── dominio/
    │   ├── entidades/
    │   ├── enumeracoes/
    │   ├── erros/
    │   ├── repositorios/
    │   ├── servicos/
    │   ├── utilitarios/
    │   └── constantes.ts
    ├── aplicacao/
    │   ├── casos-de-uso/
    │   └── dtos/
    ├── infraestrutura/
    │   ├── armazenamento/
    │   ├── repositorios/
    │   ├── servicos/
    │   └── seed/
    ├── apresentacao/
    │   ├── componentes/
    │   ├── controladores/
    │   ├── estilos/
    │   ├── utilitarios/
    │   ├── visoes/
    │   └── contexto.ts
    └── principal/
        ├── conteiner.ts
        ├── index.ts
        └── roteador.ts
```

## Rotas

Rotas de autenticação não exibem cabeçalho nem navegação inferior.

| Rota | Tela |
| --- | --- |
| `#/boas-vindas` | Apresentação do app |
| `#/entrar` | Telefone para receber o código |
| `#/confirmar-codigo` | Código de 6 dígitos |
| `#/criar-conta` | Cadastro de produtor |
| `#/onboarding` | Propriedade e primeiro rebanho (3 etapas) |
| `#/inicio` | Saudação, atalhos e últimos 5 registros |
| `#/rebanho` | Animais e lotes |
| `#/rebanho/animal/:id` | Detalhe, histórico e evolução de peso |
| `#/rebanho/animal/novo` | Novo animal |
| `#/rebanho/animal/editar/:id` | Editar animal |
| `#/rebanho/lote/:id` | Detalhe do lote |
| `#/rebanho/lote/novo` | Novo lote |
| `#/rebanho/lote/editar/:id` | Editar lote |
| `#/manejos` | Atalhos de manejo |
| `#/manejos/pesagem` | Registrar pesagem |
| `#/manejos/vacinacao` | Vacinação por animal ou lote |
| `#/manejos/medicamento` | Medicamento com carência |
| `#/manejos/produto-sanitario` | Cadastrar produto sanitário |
| `#/manejos/reproducao` | Registrar reprodução |
| `#/manejos/nascimento` | Registrar nascimento |
| `#/manejos/morte` | Registrar morte (com confirmação) |
| `#/alimentacao` | Alimentos, estoque e consumo |
| `#/alimentacao/novo` | Cadastrar alimento |
| `#/alimentacao/editar/:id` | Editar alimento |
| `#/prazos` | Carências e reforços com filtros |

Rotas internas exigem sessão ativa e propriedade cadastrada; sem isso o app redireciona para `#/boas-vindas` ou `#/onboarding`.

## Regras de negócio

- Carência: `dataLiberacao = dataAplicacao + carenciaDias`; status calculado a partir da data atual (`EM_ANDAMENTO`, `VENCIDO`, `LIBERADO`).
- Vacinação agenda reforço para **+30 dias**.
- Vacinação por lote cria **um manejo por animal ativo** e falha se o lote não tiver animais ativos.
- Medicamento cria o manejo e o controle de carência do produto escolhido.
- Morte cria o manejo e marca o animal como `MORTO`; animais mortos saem dos seletores e dos novos registros.
- Consumo de alimento deve ser maior que zero e menor ou igual ao estoque disponível.
- Peso deve ser maior que zero; nenhuma data pode estar no futuro.
- Identificação de animal é única por propriedade.
- Não é possível excluir propriedade ou lote que possuam animais.
- Validações ficam no domínio e nos casos de uso; os controladores apenas exibem o erro em toast ou no formulário.

## Dados de demonstração

Na primeira carga da sessão, o seed cria:

- usuária **Maria** — telefone `(88) 99999-0001`;
- propriedade **Fazenda Boa Vista** (Quixadá/CE);
- animais **Bovino 001–008** nos lotes 01 Engorda, 02 Reprodução e 03 Recria;
- histórico de peso do Bovino 001 (363 kg → 382 kg);
- alimentos Ração (480 kg), Silagem (1.250 kg) e Sal (85 kg);
- produtos Ivermectina 1% (28 dias), Oxitetraciclina (21 dias) e Vacina contra clostridioses (0 dia);
- carências e reforços em datas relativas, para que Prazos mostre os três status.

Datas do seed são calculadas a partir do dia atual, então os prazos continuam coerentes em qualquer execução.

**Entrar com a conta demo:** telefone `(88) 99999-0001` e qualquer código de 6 dígitos. Um telefone novo cria um produtor e leva ao onboarding.

## Como compilar e executar

```bash
npm install
npm run build
npx serve publico
```

Abra o endereço exibido (normalmente `http://localhost:3000`). Não abra o HTML por `file://`: os módulos ES precisam de um servidor HTTP.

`npm run build` limpa `publico/js` e `publico/estilos`, compila o TypeScript direto para `publico/js` e copia os CSS de `src/apresentacao/estilos` para `publico/estilos`. Assim a pasta `publico/` já fica pronta para ser servida.

Para recompilar durante o desenvolvimento:

```bash
npm run watch
```

`npm start` é um atalho para `npx serve publico`.

## Roteiro de teste manual

1. `npm install`, `npm run build`, `npx serve publico` e abra o endereço no navegador.
2. Em janela larga, confirme a moldura de celular centralizada (390×844). Estreite para menos de 768 px e confirme tela cheia sem moldura.
3. **Boas-vindas → Entrar**: informe `(88) 99999-0001`, toque em continuar e use qualquer código de 6 dígitos. Você deve cair em **Início**.
4. Confira em Início: saudação com o nome, data atual por extenso e 5 registros recentes cobrindo pesagem, alimentação e vacinação.
5. **Criar conta** (em outra aba ou após sair): preencha nome, telefone novo e aceite os termos. Deve abrir o **onboarding**.
6. Onboarding: crie a propriedade escolhendo estado e município (ex.: CE / Quixadá), cadastre um animal e conclua. O app abre Início com o nome do novo produtor.
7. **Rebanho**: busque "Bovino 001" e confirme o filtro; abra o detalhe e confira o gráfico de evolução do peso. Edite o animal e veja que a propriedade fica desabilitada.
8. **Pesagem**: registre um peso maior que zero. O app abre o detalhe do animal com o novo peso no gráfico.
9. **Vacinação**: escolha o modo **Lote**, selecione o Lote 01 e confirme o toast "Vacinação registrada para 3 animais".
10. **Medicamento**: escolha animal e produto com carência e confirme o toast com a data de liberação calculada.
11. **Produto sanitário**: cadastre um produto com carência 0 e confirme que a carência libera no mesmo dia ao aplicá-lo.
12. **Reprodução**, **Nascimento** e **Morte**: registre cada um. Em Morte deve aparecer a confirmação; depois o animal fica com status **Morto** e some dos seletores.
13. **Alimentação**: registre o consumo de 10 kg de ração e confirme o estoque caindo de 480 kg para 470 kg. Tente consumir mais que o estoque e confirme o erro.
14. **Prazos**: confira a lista com carências e reforços; use os filtros Todos, Em andamento, Vencidos e Liberados.
15. **Navegação inferior**: alterne entre Início, Rebanho, Manejos e Prazos e confirme a aba ativa (pílula verde e linha superior).
16. Recarregue a página: a sessão e os dados permanecem. Feche a aba e abra de novo: a sessão é descartada (comportamento esperado do `sessionStorage`).

## Limpar os dados

Os dados vivem no `sessionStorage` sob o prefixo `lida:`. Para reiniciar a demonstração, feche a aba ou execute no console:

```javascript
Object.keys(sessionStorage)
  .filter((chave) => chave.startsWith("lida:"))
  .forEach((chave) => sessionStorage.removeItem(chave));
location.reload();
```
