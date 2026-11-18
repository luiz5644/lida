import { ClienteArmazenamentoSessao } from '../armazenamento/ClienteArmazenamentoSessao.js';
import { hojeIso, adicionarDias } from '../../dominio/utilitarios/datas.js';
import { EspecieAnimal } from '../../dominio/enumeracoes/EspecieAnimal.js';
import { FinalidadeAnimal } from '../../dominio/enumeracoes/FinalidadeAnimal.js';
import { SexoAnimal } from '../../dominio/enumeracoes/SexoAnimal.js';
import { StatusAnimal } from '../../dominio/enumeracoes/StatusAnimal.js';
import { TipoManejo } from '../../dominio/enumeracoes/TipoManejo.js';
import { TipoOcorrenciaReproducao } from '../../dominio/enumeracoes/TipoOcorrenciaReproducao.js';
import { UndMedida } from '../../dominio/enumeracoes/UndMedida.js';

export function popularDadosIniciais(): void {
  if (sessionStorage.getItem('seed:executado') === 'true') {
    return;
  }

  const cliente = new ClienteArmazenamentoSessao();
  const hoje = hojeIso();

  // ── Usuário ──────────────────────────────────────────────────────────────
  cliente.escrever('usuarios', [
    {
      id: 'usr-001',
      nome: 'João da Silva',
      telefone: '88912345678',
      aceitouTermos: true,
    },
  ]);

  // ── Sessão ───────────────────────────────────────────────────────────────
  sessionStorage.setItem('sessao:usuarioId', 'usr-001');

  // ── Propriedade ──────────────────────────────────────────────────────────
  cliente.escrever('propriedades', [
    {
      id: 'prop-001',
      nome: 'Fazenda Boa Vista',
      estado: 'CE',
      municipio: 'Sobral',
      usuarioId: 'usr-001',
    },
  ]);

  // ── Lotes ─────────────────────────────────────────────────────────────────
  cliente.escrever('lotes', [
    { id: 'lote-001', nome: 'Lote 01 - Engorda', finalidade: 'Engorda', propriedadeId: 'prop-001' },
    { id: 'lote-002', nome: 'Lote 02 - Reprodução', finalidade: 'Reprodução', propriedadeId: 'prop-001' },
    { id: 'lote-003', nome: 'Lote 03 - Recria', finalidade: 'Recria', propriedadeId: 'prop-001' },
  ]);

  // ── Animais ───────────────────────────────────────────────────────────────
  cliente.escrever('animais', [
    {
      id: 'ani-001',
      identificacao: 'Bovino 001',
      especie: EspecieAnimal.BOVINO,
      raca: 'Nelore',
      sexo: SexoAnimal.MACHO,
      dataNascimento: '2023-04-12',
      finalidade: FinalidadeAnimal.CORTE,
      status: StatusAnimal.ATIVO,
      propriedadeId: 'prop-001',
      loteId: 'lote-001',
    },
    {
      id: 'ani-002',
      identificacao: 'Bovino 002',
      especie: EspecieAnimal.BOVINO,
      raca: 'Angus',
      sexo: SexoAnimal.FEMEA,
      finalidade: FinalidadeAnimal.LEITE,
      status: StatusAnimal.ATIVO,
      propriedadeId: 'prop-001',
      loteId: 'lote-002',
    },
    {
      id: 'ani-003',
      identificacao: 'Bovino 003',
      especie: EspecieAnimal.BOVINO,
      raca: 'Girolando',
      sexo: SexoAnimal.FEMEA,
      finalidade: FinalidadeAnimal.DUPLA_APTIDAO,
      status: StatusAnimal.ATIVO,
      propriedadeId: 'prop-001',
      loteId: 'lote-002',
    },
    {
      id: 'ani-004',
      identificacao: 'Bovino 004',
      especie: EspecieAnimal.BOVINO,
      raca: 'Nelore',
      sexo: SexoAnimal.MACHO,
      finalidade: FinalidadeAnimal.REPRODUCAO,
      status: StatusAnimal.ATIVO,
      propriedadeId: 'prop-001',
      loteId: 'lote-002',
    },
    {
      id: 'ani-005',
      identificacao: 'Bovino 005',
      especie: EspecieAnimal.BOVINO,
      raca: 'Angus',
      sexo: SexoAnimal.MACHO,
      finalidade: FinalidadeAnimal.CORTE,
      status: StatusAnimal.ATIVO,
      propriedadeId: 'prop-001',
      loteId: 'lote-001',
    },
    {
      id: 'ani-006',
      identificacao: 'Bovino 006',
      especie: EspecieAnimal.BOVINO,
      raca: 'Nelore',
      sexo: SexoAnimal.MACHO,
      finalidade: FinalidadeAnimal.CORTE,
      status: StatusAnimal.ATIVO,
      propriedadeId: 'prop-001',
      loteId: 'lote-001',
    },
    {
      id: 'ani-007',
      identificacao: 'Bovino 007',
      especie: EspecieAnimal.OVINO,
      raca: 'Santa Inês',
      sexo: SexoAnimal.FEMEA,
      finalidade: FinalidadeAnimal.CORTE,
      status: StatusAnimal.ATIVO,
      propriedadeId: 'prop-001',
      loteId: 'lote-003',
    },
    {
      id: 'ani-008',
      identificacao: 'Bovino 008',
      especie: EspecieAnimal.BOVINO,
      raca: 'Girolando',
      sexo: SexoAnimal.FEMEA,
      finalidade: FinalidadeAnimal.LEITE,
      status: StatusAnimal.ATIVO,
      propriedadeId: 'prop-001',
      loteId: 'lote-003',
    },
  ]);

  // ── Alimentos ─────────────────────────────────────────────────────────────
  cliente.escrever('alimentos', [
    { id: 'ali-001', nome: 'Ração de engorda', unidade: UndMedida.KG, quantidadeDisponivel: 480 },
    { id: 'ali-002', nome: 'Silagem de milho', unidade: UndMedida.KG, quantidadeDisponivel: 1250 },
    { id: 'ali-003', nome: 'Sal mineral', unidade: UndMedida.KG, quantidadeDisponivel: 85 },
  ]);

  // ── Produtos Sanitários ───────────────────────────────────────────────────
  cliente.escrever('produtos-sanitarios', [
    { id: 'ps-001', nome: 'Ivermectina 1%', carenciaDias: 28 },
    { id: 'ps-002', nome: 'Oxitetraciclina', carenciaDias: 14 },
    { id: 'ps-003', nome: 'Vacina Clostridioses', carenciaDias: 0 },
  ]);

  // ── Pesagens ──────────────────────────────────────────────────────────────
  cliente.escrever('pesagens', [
    { id: 'pes-001', animalId: 'ani-001', data: adicionarDias(hoje, -60), pesoKg: 363 },
    { id: 'pes-002', animalId: 'ani-001', data: adicionarDias(hoje, -45), pesoKg: 370 },
    { id: 'pes-003', animalId: 'ani-001', data: adicionarDias(hoje, -30), pesoKg: 375 },
    { id: 'pes-004', animalId: 'ani-001', data: adicionarDias(hoje, -15), pesoKg: 382 },
  ]);

  // ── Manejos ───────────────────────────────────────────────────────────────
  cliente.escrever('manejos', [
    {
      id: 'man-001',
      tipo: TipoManejo.VACINACAO,
      animalId: 'ani-001',
      data: adicionarDias(hoje, -5),
      nomeProduto: 'Vacina Clostridioses',
      dataReforco: adicionarDias(hoje, 25),
    },
    {
      id: 'man-002',
      tipo: TipoManejo.VACINACAO,
      animalId: 'ani-002',
      data: adicionarDias(hoje, -35),
      nomeProduto: 'Vacina Clostridioses',
      dataReforco: adicionarDias(hoje, -5),
    },
    {
      id: 'man-003',
      tipo: TipoManejo.MEDICAMENTO,
      animalId: 'ani-003',
      data: adicionarDias(hoje, -10),
      nomeProduto: 'Oxitetraciclina',
    },
    {
      id: 'man-004',
      tipo: TipoManejo.REPRODUCAO,
      animalId: 'ani-004',
      data: adicionarDias(hoje, -3),
      tipoOcorrencia: TipoOcorrenciaReproducao.INSEMINACAO,
    },
    {
      id: 'man-005',
      tipo: TipoManejo.NASCIMENTO,
      data: adicionarDias(hoje, -2),
      descricao: 'Nascimento registrado',
    },
  ]);

  // ── Controles de Carência ─────────────────────────────────────────────────
  cliente.escrever('controles-carencia', [
    {
      id: 'cc-001',
      animalId: 'ani-003',
      produtoSanitarioId: 'ps-002',
      dataAplicacao: adicionarDias(hoje, -10),
      dataLiberacao: adicionarDias(hoje, 4),
    },
    {
      id: 'cc-002',
      animalId: 'ani-001',
      produtoSanitarioId: 'ps-001',
      dataAplicacao: adicionarDias(hoje, -30),
      dataLiberacao: adicionarDias(hoje, -2),
    },
  ]);

  // ── Registros Alimentares ─────────────────────────────────────────────────
  cliente.escrever('registros-alimentares', [
    { id: 'ra-001', alimentoId: 'ali-001', data: adicionarDias(hoje, -1), quantidade: 50 },
    { id: 'ra-002', alimentoId: 'ali-002', data: adicionarDias(hoje, -2), quantidade: 200 },
  ]);

  // ── Marcar seed como executado ────────────────────────────────────────────
  sessionStorage.setItem('seed:executado', 'true');
}

export async function semearDadosIniciais(_repositorios?: any): Promise<void> {
  popularDadosIniciais();
}
