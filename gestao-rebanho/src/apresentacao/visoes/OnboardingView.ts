import {
  botaoPrimario,
  botaoSecundario,
  campoSelect,
  campoTexto,
  rodapeRegistro,
} from "../componentes/formulario.js";
import { icone } from "../componentes/dom.js";
import { seletorSegmentado } from "../componentes/seletor-segmentado.js";
import { stepper } from "../componentes/stepper.js";
import { avisoInfo } from "../componentes/aviso-info.js";
import { escaparHtml } from "../componentes/dom.js";
import { EspecieAnimal } from "../../dominio/enumeracoes/EspecieAnimal.js";
import { FinalidadeAnimal } from "../../dominio/enumeracoes/FinalidadeAnimal.js";
import { SexoAnimal } from "../../dominio/enumeracoes/SexoAnimal.js";
import { Estado } from "../../dominio/servicos/IServicoLocalidades.js";
import {
  rotuloEspecie,
  rotuloFinalidade,
} from "../utilitarios/formatadores.js";

export class OnboardingView {
  etapa1(estados: Estado[]): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "auth auth-simples";
    elemento.innerHTML = `
      <div class="auth-stepper-topo">
        <img class="auth-simples-logo" src="assets/logo-completa.svg" alt="lida." />
        ${stepper(1)}
        <div>
          <h1 class="auth-titulo">Crie sua propriedade</h1>
          <p class="auth-descricao">Comece pelo lugar onde o rebanho vive. Você poderá cadastrar mais propriedades depois.</p>
        </div>
      </div>
      <form class="auth-formulario" id="form-propriedade" novalidate>
        <div id="erro-onboarding" hidden></div>
        ${campoTexto({
          id: "nome-propriedade",
          label: "Nome da propriedade",
          obrigatorio: true,
          placeholder: "Ex.: Fazenda Boa Vista",
          autocomplete: "organization",
        })}
        ${campoSelect({
          id: "estado",
          label: "Estado",
          obrigatorio: true,
          placeholder: "Selecione o estado",
          opcoes: estados.map((estado) => ({
            valor: estado.uf,
            texto: `${estado.nome} (${estado.uf})`,
          })),
        })}
        ${campoSelect({
          id: "municipio",
          label: "Município",
          obrigatorio: true,
          placeholder: "Selecione o estado primeiro",
          opcoes: [],
        })}
        ${botaoPrimario("Continuar")}
      </form>
      <div class="auth-rodape-form">
        ${rodapeRegistro()}
        <div class="auth-rodape">Precisa de ajuda? <a class="link" href="mailto:contato@lida.app">Fale com a gente</a></div>
      </div>
    `;
    return elemento;
  }

  preencherMunicipios(
    raiz: ParentNode,
    municipios: string[],
    valorAtual = "",
  ): void {
    const select = raiz.querySelector<HTMLSelectElement>("#municipio");
    if (!select) {
      return;
    }
    select.innerHTML = `
      <option value="">${
        municipios.length ? "Selecione o município" : "Nenhum município encontrado"
      }</option>
      ${municipios
        .map(
          (municipio) =>
            `<option value="${escaparHtml(municipio)}"${
              municipio === valorAtual ? " selected" : ""
            }>${escaparHtml(municipio)}</option>`,
        )
        .join("")}
    `;
  }

  etapa2(lotes: { id: string; nome: string }[]): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "auth auth-simples";
    elemento.innerHTML = `
      <div class="auth-stepper-topo">
        <img class="auth-simples-logo" src="assets/logo-completa.svg" alt="lida." />
        ${stepper(2)}
        <div>
          <h1 class="auth-titulo">Monte o primeiro rebanho</h1>
          <p class="auth-descricao">Cadastre um animal ou crie um lote para organizar os animais da propriedade.</p>
        </div>
      </div>
      <div id="erro-onboarding" hidden></div>
      ${seletorSegmentado(
        [
          { valor: "animal", texto: "Animal" },
          { valor: "lote", texto: "Lote" },
        ],
        "animal",
        "seletor-onboarding",
      )}
      <form class="auth-formulario" id="form-onboarding-animal" novalidate>
        <div class="linha-dupla">
          ${campoTexto({
            id: "identificacao",
            label: "Identificação do animal",
            obrigatorio: true,
            placeholder: "Ex.: Bovino 001",
          })}
          ${campoTexto({
            id: "raca",
            label: "Raça",
            placeholder: "Ex.: Nelore",
          })}
        </div>
        <div class="linha-dupla">
          ${campoSelect({
            id: "especie",
            label: "Espécie",
            obrigatorio: true,
            placeholder: "Selecione",
            valor: EspecieAnimal.BOVINO,
            opcoes: Object.values(EspecieAnimal).map((especie) => ({
              valor: especie,
              texto: rotuloEspecie(especie),
            })),
          })}
          ${campoSelect({
            id: "sexo",
            label: "Sexo",
            obrigatorio: true,
            placeholder: "Selecione",
            opcoes: [
              { valor: SexoAnimal.FEMEA, texto: "Fêmea" },
              { valor: SexoAnimal.MACHO, texto: "Macho" },
            ],
          })}
        </div>
        <div class="linha-dupla">
          ${campoTexto({
            id: "data-nascimento",
            label: "Data de nascimento",
            tipo: "date",
          })}
          ${campoSelect({
            id: "finalidade",
            label: "Finalidade",
            obrigatorio: true,
            placeholder: "Selecione",
            opcoes: Object.values(FinalidadeAnimal).map((finalidade) => ({
              valor: finalidade,
              texto: rotuloFinalidade(finalidade),
            })),
          })}
        </div>
        ${campoSelect({
          id: "lote",
          label: "Lote (opcional)",
          placeholder: "Sem lote",
          opcoes: lotes.map((lote) => ({
            valor: lote.id,
            texto: lote.nome,
          })),
        })}
        ${botaoPrimario("Cadastrar animal")}
      </form>
      <form class="auth-formulario" id="form-onboarding-lote" hidden novalidate>
        ${campoTexto({
          id: "nome-lote",
          label: "Nome do lote",
          obrigatorio: true,
          placeholder: "Ex.: Lote 01",
        })}
        ${campoTexto({
          id: "finalidade-lote",
          label: "Finalidade",
          placeholder: "Ex.: Engorda, Reprodução, Recria",
        })}
        ${botaoPrimario("Cadastrar lote")}
      </form>
      <div style="margin-top: 18px; display: flex; flex-direction: column; gap: 10px;">
        ${botaoSecundario("Agora não, ir para a conclusão", {
          id: "btn-pular",
        })}
        ${avisoInfo(
          "Você pode cadastrar mais animais e lotes a qualquer momento na aba Rebanho.",
        )}
      </div>
      <div class="auth-rodape-form">
        ${rodapeRegistro()}
      </div>
    `;
    return elemento;
  }

  etapa3(nomePropriedade: string): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "auth auth-simples";
    elemento.innerHTML = `
      <div class="auth-stepper-topo">
        <img class="auth-simples-logo" src="assets/logo-completa.svg" alt="lida." />
        ${stepper(3)}
      </div>
      <div class="auth-conclusao">
        <span class="auth-conclusao-icone">${icone("vaca")}</span>
        <h1 class="auth-titulo">Tudo pronto por aqui!</h1>
        <p>
          A propriedade <strong>${escaparHtml(
            nomePropriedade,
          )}</strong> já pode receber animais, manejos e prazos. Vamos começar?
        </p>
        <div style="width: 100%; margin-top: 10px;">
          ${botaoPrimario("Ir para o Início", { id: "btn-concluir" })}
        </div>
      </div>
      <div class="auth-rodape-form">
        ${rodapeRegistro()}
      </div>
    `;
    return elemento;
  }

  obterNomePropriedade(raiz: ParentNode): string {
    return (
      raiz.querySelector<HTMLInputElement>("#nome-propriedade")?.value ??
      ""
    );
  }
}
