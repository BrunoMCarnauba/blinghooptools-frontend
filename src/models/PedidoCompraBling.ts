import FornecedorBling from "./FornecedorBling";

/**
 * https://ajuda.bling.com.br/hc/pt-br/articles/360047012593-POST-pedidocompra
 */
export default class PedidoCompraBling{

    public numeropedido?: string; datacompra: string = new Date().toLocaleDateString('pt-BR', {timeZone: 'UTC'}); public dataprevista?:string;
    public ordemcompra?: string; public desconto?: string; public observacoes?: string; public observacaointerna?: string; public idcategoria?: number;
    public fornecedor:FornecedorBling = new FornecedorBling(); public transporte?: TransportadoraBling; public itens?: ItemPedidoCompraBlingContainer[];
    public parcelas?:ParcelaPedidoCompraBlingContainer[];

    constructor(){
    }

}

export class TransportadoraBling{
    public transportador?: string; public freteporconta?: string; public qtdvolumes?: number; public frete?: number;
}

export class ItemPedidoCompraBlingContainer{
    constructor(public item: ItemPedidoCompraBling){
        
    }
}

export class ItemPedidoCompraBling{
    public codigo?: string = ''; public descricao: string = ''; public un?:string; public qtde:number=1; public valor:number=0;

    constructor(){

    }
}

export class ParcelaPedidoCompraBlingContainer{
    constructor(public parcela: ParcelaPedidoCompraBling){

    }
}

export class ParcelaPedidoCompraBling{
    public nrdias: number = 0; public valor:number=0; public obs?:string; public idformapagamento:number = 1;
}