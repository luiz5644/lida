export interface IServicoCodigoAcesso {
  enviar(telefone: string): Promise<void>;
  validar(telefone: string, codigo: string): Promise<boolean>;
}
