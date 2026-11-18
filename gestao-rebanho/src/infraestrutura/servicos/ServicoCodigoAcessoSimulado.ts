import { IServicoCodigoAcesso } from '../../dominio/servicos/IServicoCodigoAcesso.js';

export class ServicoCodigoAcessoSimulado implements IServicoCodigoAcesso {
  async enviar(telefone: string): Promise<void> {
    console.log('Código enviado para ' + telefone);
  }

  async validar(telefone: string, codigo: string): Promise<boolean> {
    return /^\d{6}$/.test(codigo);
  }
}
