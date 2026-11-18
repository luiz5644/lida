import { Animal } from "../../dominio/entidades/Animal.js";
import { Lote } from "../../dominio/entidades/Lote.js";
import { Propriedade } from "../../dominio/entidades/Propriedade.js";
import { EspecieAnimal } from "../../dominio/enumeracoes/EspecieAnimal.js";
import { FinalidadeAnimal } from "../../dominio/enumeracoes/FinalidadeAnimal.js";
import { SexoAnimal } from "../../dominio/enumeracoes/SexoAnimal.js";
import { DetalheAnimalDTO } from "../../aplicacao/dtos/DetalheAnimalDTO.js";
import { EvolucaoPesoDTO } from "../../aplicacao/dtos/EvolucaoPesoDTO.js";
import { badgeStatusAnimal } from "../componentes/badge.js";
import { escaparHtml, icone } from "../componentes/dom.js";
import { estadoVazio } from "../componentes/estado-vazio.js";
import { graficoLinha } from "../componentes/grafico-linha.js";
import { avisoInfo } from "../componentes/aviso-info.js";
import {
  botaoPrimario,
  campoSelect,
  campoTexto,
  rodapeRegistro,
} from "../componentes/formulario.js";
import {
  formatarData,
  rotuloEspecie,
  rotuloFinalidade,
  rotuloSexo,
} from "../utilitarios/formatadores.js";

type AbaRebanho = "animais" | "lotes";

interface DadosLista {
  aba: AbaRebanho;
  busca: string;
  animais: Animal[];
  lotes: Lote[];
  propriedadeSelecionada?: string;
  loteSelecionado?: string;
}

export interface DadosDetalheAnimal {
  detalhe: DetalheAnimalDTO;
  evolucao: EvolucaoPesoDTO;
}

export interface DadosFormularioAnimal {
  propriedades: Propriedade[];
  lotes: Lote[];
  animal?: Animal;
  propriedadeSelecionada?: string;
  loteSelecionado?: string;
}

interface DadosDetalheLote {
  lote: Lote;
  animais: Animal[];
  lotesPorId: Map<string, string>;
}

function cartaoAnimal(
  animal: Animal,
  lotesPorId: Map<string, string>,
): string {
  const loteNome = animal.loteId
    ? lotesPorId.get(animal.loteId) ?? "Sem lote"
    : "Sem lote";
  return `
    <button type="button" class="card-animal" data-animal="${escaparHtml(animal.id)}">
      <div class="card-animal-topo">
        <span class="icone-caixa icone-caixa--verde" style="width: 26px; height: 26px;">${icone("rebanho")}</span>
        <span class="badge badge--ativo">● Ativo</span>
      </div>
      <strong class="card-animal-nome">${escaparHtml(animal.identificacao)}</strong>
      <span class="card-animal-raca">${escaparHtml(animal.raca ?? "Sem raça")} · ${escaparHtml(rotuloSexo(animal.sexo))}</span>
      <div class="card-animal-divisor"></div>
      <div class="card-animal-rodape">
        <div class="card-animal-lote-info">
          ${icone("camadas")}
          <span>${escaparHtml(loteNome)}</span>
        </div>
        <span class="card-animal-chevron">›</span>
      </div>
    </button>
  `;
}

function cartaoLote(lote: Lote, quantidade: number): string {
  return `
    <button type="button" class="card-lote" data-lote="${escaparHtml(lote.id)}">
      <div class="card-lote-topo">
        <span class="icone-caixa icone-caixa--verde" style="width: 26px; height: 26px;">${icone("camadas")}</span>
        <span class="card-animal-chevron">›</span>
      </div>
      <strong class="card-lote-nome">${escaparHtml(lote.nome)}</strong>
      <span class="card-lote-contagem">${quantidade} ${quantidade === 1 ? "animal associado" : "animais associados"}</span>
      <div class="card-lote-divisor"></div>
      <div class="card-lote-rodape">
        <span>${escaparHtml(lote.finalidade ?? "Sem finalidade")}</span>
      </div>
    </button>
  `;
}

export class RebanhoView {
  lista(dados: DadosLista): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "pagina";
    const lotesPorId = new Map(
      dados.lotes.map((lote) => [lote.id, lote.nome]),
    );
    const busca = dados.busca.trim().toLowerCase();

    const animais = dados.animais.filter((animal) => {
      if (!busca) return true;
      const lote = animal.loteId ? lotesPorId.get(animal.loteId) ?? "" : "";
      return [animal.identificacao, animal.raca ?? "", lote]
        .join(" ")
        .toLowerCase()
        .includes(busca);
    });

    const lotes = dados.lotes.filter((lote) =>
      !busca ? true : lote.nome.toLowerCase().includes(busca),
    );

    const contagem = dados.aba === "animais" ? animais.length : lotes.length;
    const rotuloContagem = `${contagem} ${
      dados.aba === "animais"
        ? contagem === 1 ? "animal encontrado" : "animais encontrados"
        : contagem === 1 ? "lote encontrado" : "lotes encontrados"
    }`;

    const conteudoLista =
      dados.aba === "animais"
        ? animais.length === 0
          ? estadoVazio({
              icone: "rebanho",
              titulo: "Nenhum animal encontrado",
              descricao: busca
                ? "Tente buscar por outra identificação, raça ou lote."
                : "Cadastre o primeiro animal para começar o rebanho.",
            })
          : `<div class="grade-cards">${animais
              .map((animal) => cartaoAnimal(animal, lotesPorId))
              .join("")}</div>`
        : lotes.length === 0
          ? estadoVazio({
              icone: "camadas",
              titulo: "Nenhum lote encontrado",
              descricao: busca
                ? "Tente buscar por outro nome de lote."
                : "Crie o primeiro lote para agrupar seus animais.",
            })
          : `<div class="grade-cards">${lotes
              .map((lote) => {
                const total = dados.animais.filter(
                  (a) => a.loteId === lote.id,
                ).length;
                return cartaoLote(lote, total);
              })
              .join("")}</div>`;

    const textoBotaoAdicionar =
      dados.aba === "animais" ? "+ Adicionar animal" : "+ Cadastrar lote";

    elemento.innerHTML = `
      <div class="pagina-cabecalho">
        <h1 class="pagina-titulo">Rebanho</h1>
        <p class="pagina-subtitulo">Cada animal, sua história. Tudo no mesmo lugar.</p>
      </div>

      <div class="rebanho-topo">
        <button type="button" class="botao botao--primario" id="btn-adicionar-principal">
          ${textoBotaoAdicionar}
        </button>

        <div class="seletor-segmentado" id="seletor-rebanho">
          <button type="button" class="seletor-segmentado-opcao ${dados.aba === 'animais' ? 'ativa' : ''}" data-aba="animais">
            Animais <span class="mini-badge ${dados.aba === 'animais' ? 'mini-badge--ativo' : ''}">${dados.animais.length}</span>
          </button>
          <button type="button" class="seletor-segmentado-opcao ${dados.aba === 'lotes' ? 'ativa' : ''}" data-aba="lotes">
            Lotes <span class="mini-badge ${dados.aba === 'lotes' ? 'mini-badge--ativo' : ''}">${dados.lotes.length}</span>
          </button>
        </div>

        <div class="rebanho-busca-container">
          <span class="rebanho-busca-icone">${icone("busca")}</span>
          <input
            type="search"
            class="rebanho-busca-input"
            id="campo-busca-rebanho"
            placeholder="${dados.aba === 'animais' ? 'Buscar por identificação...' : 'Buscar lote...'}"
            value="${escaparHtml(dados.busca)}"
            aria-label="Buscar no rebanho"
          />
        </div>

        <p class="rebanho-contagem">${rotuloContagem}</p>
      </div>

      ${conteudoLista}
    `;

    return elemento;
  }

  formularioAnimal(
    dadosOuPropriedades: DadosFormularioAnimal | Propriedade[],
    lotesParam?: Lote[],
    animalParam?: Animal,
  ): HTMLElement {
    const dados: DadosFormularioAnimal = Array.isArray(dadosOuPropriedades)
      ? {
          propriedades: dadosOuPropriedades,
          lotes: lotesParam ?? [],
          animal: animalParam,
        }
      : dadosOuPropriedades;

    const { propriedades, lotes, animal } = dados;
    const editando = Boolean(animal);
    const elemento = document.createElement("div");
    elemento.className = "pagina";

    const propriedadeAtiva =
      dados.propriedadeSelecionada ??
      animal?.propriedadeId ??
      propriedades[0]?.id ??
      "";
    const loteAtivo = dados.loteSelecionado ?? animal?.loteId ?? "";

    const opcoesPropriedade = propriedades.map((p) => ({
      valor: p.id,
      texto: p.nome,
    }));
    const opcoesLotes = [
      { valor: "", texto: "Sem lote" },
      ...lotes.map((l) => ({ valor: l.id, texto: l.nome })),
    ];

    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">← Voltar</button>
      <div class="pagina-cabecalho">
        <h1 class="pagina-titulo">${editando ? "Editar animal" : "Cadastrar animal"}</h1>
        <p class="pagina-subtitulo">As informações essenciais do seu rebanho.</p>
      </div>
      <form class="cartao" id="form-animal" novalidate>
        <div id="erro-form" hidden></div>
        ${campoTexto({
          id: "identificacao",
          label: "Identificação do animal",
          obrigatorio: true,
          placeholder: "Ex.: Bovino 009",
          valor: animal?.identificacao ?? "",
        })}
        ${campoSelect({
          id: "propriedade",
          label: "Propriedade",
          obrigatorio: true,
          placeholder: "Selecione a propriedade",
          opcoes: opcoesPropriedade,
          valor: propriedadeAtiva,
          desabilitado: editando,
        })}
        ${campoSelect({
          id: "especie",
          label: "Espécie",
          obrigatorio: true,
          placeholder: "Selecione a espécie",
          opcoes: Object.values(EspecieAnimal).map((e) => ({
            valor: e,
            texto: rotuloEspecie(e),
          })),
          valor: animal?.especie ?? EspecieAnimal.BOVINO,
        })}
        ${campoSelect({
          id: "sexo",
          label: "Sexo",
          obrigatorio: true,
          placeholder: "Selecione o sexo",
          opcoes: Object.values(SexoAnimal).map((s) => ({
            valor: s,
            texto: rotuloSexo(s),
          })),
          valor: animal?.sexo ?? "",
        })}
        ${campoTexto({
          id: "raca",
          label: "Raça",
          placeholder: "Ex.: Nelore",
          valor: animal?.raca ?? "",
        })}
        ${campoTexto({
          id: "data-nascimento",
          label: "Data de nascimento",
          tipo: "date",
          placeholder: "dd/mm/aaaa",
          valor: animal?.dataNascimento ?? "",
        })}
        ${campoSelect({
          id: "finalidade",
          label: "Finalidade",
          obrigatorio: true,
          placeholder: "Selecione a finalidade",
          opcoes: Object.values(FinalidadeAnimal).map((f) => ({
            valor: f,
            texto: rotuloFinalidade(f),
          })),
          valor: animal?.finalidade ?? "",
        })}
        ${campoSelect({
          id: "lote",
          label: "Lote (opcional)",
          placeholder: "Sem lote",
          opcoes: opcoesLotes,
          valor: loteAtivo,
        })}
        ${botaoPrimario("Salvar animal")}
        <p class="rodape-registro">Campos com * são obrigatórios.</p>
      </form>
    `;

    return elemento;
  }

  atualizarLotesDoFormulario(
    elemento: HTMLElement,
    lotes: Lote[],
    loteSelecionado?: string,
  ): void {
    const selectLote = elemento.querySelector<HTMLSelectElement>("#lote");
    if (!selectLote) return;
    const opcoes = [
      '<option value="">Sem lote</option>',
      ...lotes.map(
        (l) =>
          `<option value="${l.id}" ${l.id === loteSelecionado ? "selected" : ""}>${escaparHtml(l.nome)}</option>`,
      ),
    ];
    selectLote.innerHTML = opcoes.join("");
  }

  formularioLote(lote?: Lote): HTMLElement {
    const editando = Boolean(lote);
    const elemento = document.createElement("div");
    elemento.className = "pagina";

    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">← Voltar</button>
      <div class="pagina-cabecalho">
        <h1 class="pagina-titulo">${editando ? "Editar lote" : "Cadastrar lote"}</h1>
        <p class="pagina-subtitulo">Organize seus animais de um jeito simples.</p>
      </div>
      <form class="cartao" id="form-lote" novalidate>
        <div id="erro-form" hidden></div>
        ${campoTexto({
          id: "nome-lote",
          label: "Nome do lote",
          obrigatorio: true,
          placeholder: "Ex.: Lote 04",
          valor: lote?.nome ?? "",
        })}
        ${campoTexto({
          id: "finalidade-lote",
          label: "Finalidade",
          placeholder: "Ex.: Engorda",
          valor: lote?.finalidade ?? "",
        })}
        ${botaoPrimario("Salvar lote")}
      </form>
    `;

    return elemento;
  }

  detalheAnimal(dados: DadosDetalheAnimal): HTMLElement {
    const { animal } = dados.detalhe;
    const elemento = document.createElement("div");
    elemento.className = "pagina";

    const variacao = dados.evolucao.variacao;
    const classeVariacao =
      variacao == null
        ? ""
        : variacao >= 0
          ? "variacao-positiva"
          : "variacao-negativa";
    const textoVariacao =
      variacao == null
        ? "—"
        : `${variacao > 0 ? "+" : ""}${variacao}`;

    const historico = dados.detalhe.historico ?? [];
    const historicoLinhasHtml =
      historico.length === 0
        ? estadoVazio({
            icone: "prancheta",
            titulo: "Histórico vazio",
            descricao: "Os registros deste animal aparecerão aqui.",
          })
        : historico
            .map(
              (item) => `
                <div class="item-lista">
                  <span class="icone-caixa icone-caixa--lista icone-caixa--azul">${icone(item.icone ?? "prancheta")}</span>
                  <div class="item-lista-texto">
                    <strong>${escaparHtml(item.titulo ?? item.tipo)}</strong>
                    <small>${escaparHtml(item.descricao ?? "")}</small>
                  </div>
                  <div class="item-lista-detalhe">
                    <span>${formatarData(item.data)}</span>
                  </div>
                </div>
              `,
            )
            .join("");

    const pontosGrafico = (dados.evolucao.pontos ?? []).map((p) => ({
      data: p.data,
      pesoKg: p.pesoKg ?? p.peso ?? 0,
    }));

    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">← Voltar</button>
      <div class="detalhe-topo-linha">
        <div>
          <h1 class="pagina-titulo">${escaparHtml(animal.identificacao)}</h1>
          <p class="pagina-subtitulo">Informações e cuidados ao longo do tempo.</p>
        </div>
        <button type="button" class="botao botao--secundario" id="btn-editar">
          ${icone("lapis")} Editar animal
        </button>
      </div>

      <section class="cartao">
        <div class="detalhe-cartao-cabecalho">
          <div class="detalhe-cartao-titulo-grupo">
            ${icone("rebanho")}
            <span>Informações básicas</span>
          </div>
          <span class="badge badge--ativo">● Ativo</span>
        </div>
        <div class="info-grade">
          <div class="info-item">
            <small>Espécie</small>
            <strong>${escaparHtml(rotuloEspecie(animal.especie))}</strong>
          </div>
          <div class="info-item">
            <small>Raça</small>
            <strong>${escaparHtml(animal.raca ?? "—")}</strong>
          </div>
          <div class="info-item">
            <small>Sexo</small>
            <strong>${escaparHtml(rotuloSexo(animal.sexo))}</strong>
          </div>
          <div class="info-item">
            <small>Nascimento</small>
            <strong>${formatarData(animal.dataNascimento ?? "") || "—"}</strong>
          </div>
          <div class="info-item">
            <small>Lote</small>
            <strong>${escaparHtml(dados.detalhe.loteNome ?? "Sem lote")}</strong>
          </div>
          <div class="info-item">
            <small>Propriedade</small>
            <strong>${escaparHtml(dados.detalhe.propriedadeNome)}</strong>
          </div>
          <div class="info-item">
            <small>Finalidade</small>
            <strong>${escaparHtml(rotuloFinalidade(animal.finalidade))}</strong>
          </div>
        </div>
      </section>

      <section class="cartao">
        <div class="detalhe-cartao-cabecalho">
          <span class="secao-titulo">Evolução do peso</span>
          <button type="button" class="link-acao" id="btn-pesagem">+ Registrar pesagem</button>
        </div>
        <div class="metricas-grade">
          <div class="metrica-caixa">
            <span class="metrica-rotulo">Último peso</span>
            <div class="metrica-valor-grupo">
              <span class="metrica-valor">${dados.evolucao.pesoAtual ?? "—"}</span>
              <span class="metrica-unidade">kg</span>
            </div>
          </div>
          <div class="metrica-caixa">
            <span class="metrica-rotulo">Peso anterior</span>
            <div class="metrica-valor-grupo">
              <span class="metrica-valor">${dados.evolucao.pesoAnterior ?? "—"}</span>
              <span class="metrica-unidade">kg</span>
            </div>
          </div>
          <div class="metrica-caixa">
            <span class="metrica-rotulo">Variação</span>
            <div class="metrica-valor-grupo">
              <span class="metrica-valor ${classeVariacao}">${textoVariacao}</span>
              <span class="metrica-unidade">kg</span>
            </div>
          </div>
        </div>
        <div class="grafico-wrapper">
          ${graficoLinha(pontosGrafico)}
        </div>
        <div class="link-historico-pesagens">
          <span>Histórico de pesagens</span>
          <span>${pontosGrafico.length} registros ›</span>
        </div>
      </section>

      <section class="cartao" style="padding: 0; overflow: hidden;">
        <div style="padding: 14px 14px 10px; display: flex; justify-content: space-between; align-items: center;">
          <span class="secao-titulo">Histórico do animal</span>
          <small style="font-size: 10px; color: var(--texto-suave);">${historico.length} registros</small>
        </div>
        <div class="lista-cartao" style="border: none; border-radius: 0;">
          ${historicoLinhasHtml}
        </div>
      </section>
    `;

    return elemento;
  }

  detalheLote(dados: DadosDetalheLote): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "pagina";

    const animaisHtml =
      dados.animais.length === 0
        ? estadoVazio({
            icone: "rebanho",
            titulo: "Lote vazio",
            descricao: "Edite um animal e selecione este lote para associá-lo.",
          })
        : `<div class="grade-cards">${dados.animais
            .map((animal) => cartaoAnimal(animal, dados.lotesPorId))
            .join("")}</div>`;

    elemento.innerHTML = `
      <button type="button" class="voltar" id="btn-voltar">← Voltar</button>
      <div class="detalhe-topo-linha">
        <div>
          <h1 class="pagina-titulo">${escaparHtml(dados.lote.nome)}</h1>
          <p class="pagina-subtitulo">${escaparHtml(dados.lote.finalidade ?? "Sem finalidade")} · ${dados.animais.length} ${dados.animais.length === 1 ? 'animal associado' : 'animais associados'}</p>
        </div>
        <button type="button" class="botao botao--secundario" id="btn-editar-lote">
          ${icone("lapis")} Editar lote
        </button>
      </div>

      <div style="margin-bottom: 4px;">
        ${avisoInfo(
          "Para associar um animal a este lote, selecione o lote no cadastro ou na edição do animal.",
        )}
      </div>

      <div class="lote-secao-animais-topo">
        <h2 class="secao-titulo">Animais do lote</h2>
        <button type="button" class="link-acao" id="btn-adicionar-animal-lote">+ Adicionar animal</button>
      </div>

      ${animaisHtml}
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
    }
  }
}
