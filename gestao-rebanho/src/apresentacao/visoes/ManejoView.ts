import { Animal } from "../../dominio/entidades/Animal.js";
import { Lote } from "../../dominio/entidades/Lote.js";
import { ProdutoSanitario } from "../../dominio/entidades/ProdutoSanitario.js";
import { TipoOcorrenciaReproducao } from "../../dominio/enumeracoes/TipoOcorrenciaReproducao.js";
import { hojeIso } from "../../dominio/utilitarios/datas.js";
import { avisoInfo } from "../componentes/aviso-info.js";
import { escaparHtml, icone } from "../componentes/dom.js";
import { estadoVazio } from "../componentes/estado-vazio.js";
import {
  botaoPrimario,
  campoSelect,
  campoTextarea,
  campoTexto,
  rodapeRegistro,
} from "../componentes/formulario.js";
import { seletorSegmentado } from "../componentes/seletor-segmentado.js";
import { rotuloOcorrencia } from "../utilitarios/formatadores.js";

function opcoesAnimais(animais: Animal[]): { valor: string; texto: string }[] {
  return animais.map((animal) => ({
    valor: animal.id,
    texto: animal.identificacao,
  }));
}

function opcoesLotes(lotes: Lote[]): { valor: string; texto: string }[] {
  return lotes.map((lote) => ({ valor: lote.id, texto: lote.nome }));
}

function opcoesProdutos(
  produtos: ProdutoSanitario[],
): { valor: string; texto: string }[] {
  return produtos.map((produto) => ({
    valor: produto.id,
    texto: `${produto.nome} · ${produto.carenciaDias} dias de carência`,
  }));
}

const CORES_MANEJO: Record<string, string> = {
  pesagem: "icone-caixa--azul",
  vacinacao: "icone-caixa--verde",
  medicamento: "icone-caixa--creme",
  reproducao: "icone-caixa--verde",
  nascimento: "icone-caixa--verde",
  morte: "icone-caixa--rosa",
};

export class ManejoView {
  hub(): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "pagina";
    const opcoes = [
      {
        rota: "pesagem",
        icone: "balanca",
        titulo: "Pesagem",
        descricao: "Registrar peso",
      },
      {
        rota: "vacinacao",
        icone: "seringa",
        titulo: "Vacinação",
        descricao: "Aplicar vacina",
      },
      {
        rota: "medicamento",
        icone: "comprimido",
        titulo: "Medicamento",
        descricao: "Registrar tratamento",
      },
      {
        rota: "reproducao",
        icone: "coracao",
        titulo: "Reprodução",
        descricao: "Registrar ocorrência",
      },
      {
        rota: "nascimento",
        icone: "carinha",
        titulo: "Nascimento",
        descricao: "Novo nascimento",
      },
      {
        rota: "morte",
        icone: "coracao-quebrado",
        titulo: "Morte",
        descricao: "Registrar óbito",
        perigo: true,
      },
    ];

    elemento.innerHTML = `
      <div class="pagina-cabecalho">
        <h1 class="pagina-titulo">Manejos</h1>
        <p class="pagina-subtitulo">O que deseja registrar?</p>
      </div>
      <div class="grade-manejos">
        ${opcoes
          .map((opcao) => {
            const cor = opcao.perigo
              ? "icone-caixa--rosa"
              : CORES_MANEJO[opcao.rota] ?? "icone-caixa--verde";
            return `
              <button type="button" class="manejo-opcao" data-manejo="${opcao.rota}">
                <div class="manejo-opcao-topo">
                  <span class="icone-caixa ${cor}">${icone(opcao.icone)}</span>
                  <span class="manejo-opcao-chevron">›</span>
                </div>
                <div class="manejo-opcao-texto">
                  <strong class="manejo-rotulo">${opcao.titulo}</strong>
                  <small class="manejo-descricao">${opcao.descricao}</small>
                </div>
              </button>
            `;
          })
          .join("")}
      </div>
      <p class="manejo-rodape-hub">Registros simples para cuidar de cada etapa do seu rebanho.</p>
    `;
    return elemento;
  }

  formularioVacinacao(animais: Animal[], lotes: Lote[]): HTMLElement {
    const corpo = `
      ${seletorSegmentado(
        [
          { valor: "animal", texto: "Animal" },
          { valor: "lote", texto: "Lote" },
        ],
        "animal",
        "seletor-vacinacao",
      )}
      <div id="grupo-animal">
        ${campoSelect({
          id: "animal-vacinacao",
          label: "Animal",
          obrigatorio: true,
          placeholder: "Selecione o animal",
          opcoes: opcoesAnimais(animais),
        })}
      </div>
      <div id="grupo-lote" hidden>
        ${campoSelect({
          id: "lote-vacinacao",
          label: "Lote",
          obrigatorio: true,
          placeholder: "Selecione o lote",
          opcoes: opcoesLotes(lotes),
        })}
        <div style="margin-bottom: 16px;">
          ${avisoInfo(
            "A vacinação será registrada para todos os animais ativos do lote selecionado.",
          )}
        </div>
      </div>
      ${campoTexto({
        id: "vacina",
        label: "Vacina aplicada",
        obrigatorio: true,
        placeholder: "Ex.: Vacina contra febre aftosa",
      })}
      ${campoTexto({
        id: "data-vacinacao",
        label: "Data da aplicação",
        tipo: "date",
        obrigatorio: true,
        valor: hojeIso(),
      })}
    `;
    return this.moldura(
      "Registrar vacinação",
      "Informe os dados da aplicação.",
      corpo,
      "Registrar vacinação",
    );
  }

  formularioMedicamento(
    animais: Animal[],
    produtos: ProdutoSanitario[],
  ): HTMLElement {
    const corpo = `
      ${campoSelect({
        id: "animal-medicamento",
        label: "Animal",
        obrigatorio: true,
        placeholder: "Selecione o animal",
        opcoes: opcoesAnimais(animais),
      })}
      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
        <span class="campo-rotulo">Medicamento <span class="campo-obrigatorio">*</span></span>
        <button type="button" class="link-acao" id="btn-novo-produto">+ Cadastrar produto</button>
      </div>
      ${campoSelect({
        id: "produto-sanitario",
        label: "",
        obrigatorio: true,
        placeholder: "Selecione o medicamento",
        opcoes: opcoesProdutos(produtos),
      })}
      ${campoTexto({
        id: "data-medicamento",
        label: "Data da aplicação",
        tipo: "date",
        obrigatorio: true,
        valor: hojeIso(),
      })}
      ${campoTextarea({
        id: "observacao-medicamento",
        label: "Informações do tratamento (opcional)",
        placeholder: "Ex.: aplicação para controle de carrapatos",
      })}
    `;
    return this.moldura(
      "Registrar medicamento",
      "Registre o tratamento e acompanhe a carência do produto.",
      corpo,
      "Registrar medicamento",
    );
  }

  formularioProdutoSanitario(): HTMLElement {
    const corpo = `
      ${campoTexto({
        id: "nome-produto",
        label: "Nome do produto",
        obrigatorio: true,
        placeholder: "Ex.: Ivermectina 1%",
      })}
      ${campoTexto({
        id: "carencia-produto",
        label: "Dias de carência",
        tipo: "number",
        inputmode: "numeric",
        min: 0,
        step: 1,
        obrigatorio: true,
        placeholder: "Ex.: 28",
        ajuda: "Informe 0 quando não houver carência.",
      })}
    `;
    return this.moldura(
      "Cadastrar produto sanitário",
      "Informe o nome e os dias de carência do produto.",
      corpo,
      "Salvar produto",
    );
  }

  formularioReproducao(animais: Animal[]): HTMLElement {
    const corpo = `
      ${campoSelect({
        id: "animal-reproducao",
        label: "Animal",
        obrigatorio: true,
        placeholder: "Selecione o animal",
        opcoes: opcoesAnimais(animais),
      })}
      ${campoSelect({
        id: "tipo-ocorrencia",
        label: "Tipo de ocorrência",
        obrigatorio: true,
        placeholder: "Selecione",
        opcoes: Object.values(TipoOcorrenciaReproducao).map((tipo) => ({
          valor: tipo,
          texto: rotuloOcorrencia(tipo),
        })),
      })}
      ${campoTexto({
        id: "data-reproducao",
        label: "Data",
        tipo: "date",
        obrigatorio: true,
        valor: hojeIso(),
      })}
      ${campoTextarea({
        id: "descricao-reproducao",
        label: "Descrição (opcional)",
        placeholder: "Escreva uma observação, se necessário...",
      })}
    `;
    return this.moldura(
      "Registrar reprodução",
      "Informe os dados da ocorrência.",
      corpo,
      "Registrar ocorrência",
    );
  }

  formularioNascimento(animais: Animal[]): HTMLElement {
    const corpo = `
      ${campoSelect({
        id: "animal-nascimento",
        label: "Animal relacionado (opcional)",
        placeholder: "Sem animal relacionado",
        opcoes: opcoesAnimais(animais),
      })}
      ${campoTexto({
        id: "data-nascimento-manejo",
        label: "Data do nascimento",
        tipo: "date",
        obrigatorio: true,
        valor: hojeIso(),
      })}
      ${campoTextarea({
        id: "descricao-nascimento",
        label: "Descrição (opcional)",
        placeholder: "Escreva uma observação, se necessário...",
      })}
    `;
    const elemento = this.moldura(
      "Registrar nascimento",
      "Registre uma nova vida no rebanho.",
      corpo,
      "Registrar nascimento",
    );
    const aux = document.createElement("div");
    aux.className = "nascimento-cadastro-aux";
    aux.innerHTML = `
      <span>Precisa cadastrar o recém-nascido?</span>
      <button type="button" class="link-acao" id="btn-cadastrar-novo-animal">+ Cadastrar animal</button>
    `;
    elemento.appendChild(aux);
    return elemento;
  }

  formularioMorte(animais: Animal[]): HTMLElement {
    const corpo = `
      ${campoSelect({
        id: "animal-morte",
        label: "Animal",
        obrigatorio: true,
        placeholder: "Selecione o animal",
        opcoes: opcoesAnimais(animais),
      })}
      ${campoTexto({
        id: "data-morte",
        label: "Data da morte",
        tipo: "date",
        obrigatorio: true,
        valor: hojeIso(),
      })}
      ${campoTextarea({
        id: "observacao-morte",
        label: "Observação (opcional)",
        placeholder: "Descreva a ocorrência, se necessário...",
      })}
      <div style="margin-bottom: 16px;">
        ${avisoInfo(
          "Ao registrar a morte, o animal terá seu status alterado para MORTO e a ocorrência aparecerá em seu histórico.",
        )}
      </div>
    `;
    return this.moldura(
      "Registrar morte",
      "Informe os dados da ocorrência.",
      corpo,
      "Registrar morte",
      true,
    );
  }

  semAnimais(titulo: string): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "pagina";
    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">← Voltar</button>
      <div class="pagina-cabecalho">
        <h1 class="pagina-titulo">${escaparHtml(titulo)}</h1>
      </div>
      ${estadoVazio({
        icone: "rebanho",
        titulo: "Nenhum animal ativo",
        descricao:
          "Cadastre um animal ativo na propriedade para registrar este manejo.",
        acaoHtml: `<button type="button" class="botao botao--primario" id="btn-adicionar-animal" style="margin-top: 8px;">+ Adicionar animal</button>`,
      })}
    `;
    return elemento;
  }

  private moldura(
    titulo: string,
    subtitulo: string,
    corpo: string,
    textoBotao: string,
    perigo = false,
  ): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "pagina";
    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">← Voltar</button>
      <div class="pagina-cabecalho">
        <h1 class="pagina-titulo">${escaparHtml(titulo)}</h1>
        <p class="pagina-subtitulo">${escaparHtml(subtitulo)}</p>
      </div>
      <form class="cartao" id="form-manejo" novalidate>
        <div id="erro-form" hidden></div>
        ${corpo}
        ${botaoPrimario(textoBotao, { perigo })}
        ${rodapeRegistro()}
      </form>
    `;
    return elemento;
  }

  exibirErro(mensagem: string): void {
    const container = document.getElementById("erro-form");
    if (container) {
      container.innerHTML = `<div class="campo-erro" style="margin-bottom: 12px;">${escaparHtml(
        mensagem,
      )}</div>`;
      container.hidden = false;
      container.scrollIntoView({ block: "nearest" });
    }
  }

  exibirExito(mensagem: string): void {
    const container = document.getElementById("erro-form");
    if (container) {
      container.innerHTML = `<div class="aviso-info" style="margin-bottom: 12px;">${escaparHtml(
        mensagem,
      )}</div>`;
      container.hidden = false;
    }
  }
}
