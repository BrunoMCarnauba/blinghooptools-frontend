import ClienteBling from "./ClienteBling";

export default class PedidoBling{

    public data:string = new Date().toLocaleDateString('pt-BR', {timeZone: 'UTC'}); public data_saida: string = new Date().toLocaleDateString('pt-BR', {timeZone: 'UTC'}); public data_prevista?:string;
    public numero?: string; public numero_loja?: string; public loja?:number; public nat_operacao?:string; public vendedor?:string; public cliente:ClienteBling = new ClienteBling();
    public itens?: ItemPedidoBlingContainer[]; public idFormaPagamento?:number; public parcelas?:ParcelaPedidoBlingContainer[]; public vlr_frete?: number;
    public vlr_desconto?:string; public obs?:string; public obs_internas?:string; public outrasDespesas?:number; public intermediador?:IntermediadorPedidoBling;

    constructor(){
    }

}

export class ItemPedidoBlingContainer{
    constructor(public item: ItemPedidoBling){
        
    }
}

export class ItemPedidoBling{
    public codigo?: string = ''; public descricao?: string; public un?:string; public qtde:number=1; public vlr_unit:number=0;
    public vlr_desconto?: number;

    constructor(){

    }
}

export class ParcelaPedidoBlingContainer{
    constructor(public parcela: ParcelaPedidoBling){

    }
}

export class ParcelaPedidoBling{
    public dias?: number; public data?: string; public vlr:number=0; public obs?:string; public forma_pagamento?:FormaPagamentoPedidoBling;
}

export class FormaPagamentoPedidoBling{
    public id?: number;
}

export class IntermediadorPedidoBling{
    public cnpj?:string; public nomeUsuario?:string; public cnpjInstituicaoPagamento?: string;
}