/* eslint-disable */
import React, { useState, useEffect } from 'react';

import TinyProvider from '../../providers/TinyAPI';
import BlingProvider from '../../providers/BlingAPI';

//Migrar pedidos
import PedidoBling, { ItemPedidoBling, ItemPedidoBlingContainer, ParcelaPedidoBling, ParcelaPedidoBlingContainer } from '../../models/PedidoBling';
import ClienteBling from '../../models/ClienteBling';

import MenuSuperior from '../../components/menu_superior/index';

import './styles.css';

export default function TelaMigraPedidos(){
    const [dataInicial, setDataInicial] = useState<string>("");
    const [dataFinal, setDataFinal] = useState<string>("");

    const [enviarClienteComCodigo, setEnviarClienteComCodigo] = useState<boolean>(false);
    const [enviarTodasSituacoesPedido, setEnviarTodasSituacoesPedido] = useState<boolean>(false);

    const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
    const [loadingStatus, setLoadingStatus] = useState<string>("");

    useEffect(() => {

    }, []);

    const migrarPedidos = async () => {
        let dataInicialFormatada = new Date(dataInicial).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
        let dataFinalFormatada = new Date(dataFinal).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

        setLoadingStatus("Coletando pedidos no Tiny ERP...");
        let tinyProvider = new TinyProvider();
        let blingProvider = new BlingProvider();

        let pedidosTiny:any[] = await tinyProvider.getListaPedidosCompletos(dataInicialFormatada, dataFinalFormatada);

        let pedidoTiny: any;
        let pedidoBling: PedidoBling;
        let clienteBling: ClienteBling;
        let itemBling: ItemPedidoBling;
        let itensBling: ItemPedidoBlingContainer[];
        let parcelaBling: ParcelaPedidoBling;
        let parcelasBling: ParcelaPedidoBlingContainer[];

        console.log(pedidosTiny);

        setLoadingStatus("Incluindo pedidos coletados no Bling...");
        for(let x = 0; x < pedidosTiny.length; x++){
            pedidoTiny = pedidosTiny[x];
            console.log(pedidoTiny.situacao);

            if(enviarTodasSituacoesPedido || pedidoTiny.situacao == "Em aberto" || pedidoTiny.situacao == "Aprovado" || pedidoTiny.situacao == "Faturado"){
                pedidoBling = new PedidoBling();

                pedidoBling.data = pedidoTiny.data_pedido;
                pedidoBling.data_prevista = pedidoTiny.data_prevista;
                pedidoBling.data_saida = pedidoTiny.data_faturamento;
                pedidoBling.numero_loja = pedidoTiny.numero_ecommerce;
                
                clienteBling = new ClienteBling();
                if(enviarClienteComCodigo == true){
                    clienteBling.id = pedidoTiny.cliente.codigo;
                    delete pedidoTiny.cliente.codigo;
                }
                clienteBling.tipoPessoa = pedidoTiny.cliente.tipo_pessoa;
                delete pedidoTiny.cliente.tipo_pessoa;
                clienteBling = {...clienteBling, ...pedidoTiny.cliente};
                pedidoBling.cliente = clienteBling;

                itensBling = [];
                for(let y = 0; y < pedidoTiny.itens.length; y++){
                    itemBling = new ItemPedidoBling();
                    itemBling.codigo = pedidoTiny.itens[y].item.codigo;
                    itemBling.descricao = pedidoTiny.itens[y].item.descricao;
                    itemBling.un = pedidoTiny.itens[y].item.unidade;
                    itemBling.qtde = pedidoTiny.itens[y].item.quantidade;
                    itemBling.vlr_unit = pedidoTiny.itens[y].item.valor_unitario;

                    itensBling.push(new ItemPedidoBlingContainer(itemBling));
                }
                pedidoBling.itens = itensBling;

                parcelasBling = [];
                for(let y = 0; y < pedidoTiny.parcelas.length; y++){
                    parcelaBling = new ParcelaPedidoBling();
                    parcelaBling.dias = pedidoTiny.parcelas[y].parcela.dias;
                    parcelaBling.data = pedidoTiny.parcelas[y].parcela.data;
                    parcelaBling.vlr = pedidoTiny.parcelas[y].parcela.valor;
                    parcelaBling.obs = pedidoTiny.parcelas[y].parcela.obs;
                    parcelaBling.forma_pagamento = pedidoTiny.parcelas[y].parcela.forma_pagamento;

                    parcelasBling.push(new ParcelaPedidoBlingContainer(parcelaBling));
                }
                pedidoBling.parcelas = parcelasBling;

                pedidoBling.vlr_frete = pedidoTiny.valor_frete;
                pedidoBling.vlr_desconto = pedidoTiny.valor_desconto;
                pedidoBling.outrasDespesas = pedidoTiny.outras_despesas;
                pedidoBling.obs = pedidoTiny.obs;
                pedidoBling.obs_internas = pedidoTiny.obs_interna;

                await blingProvider.incluirPedido(pedidoBling);
                // console.log(pedidoBling);
                console.log("Pedido "+(x+1)+" enviado");
            }
        }

        setLoadingStatus("");
    }

    const teste = async () => {

    }

    return (
        <div id="tela-migrar-pedidos">
            <MenuSuperior tituloPagina={"Migração de pedidos do Tiny para o Bling"} ajudaPressionado={() => setVisualizarAjuda(!visualizarAjuda)}/>

            {visualizarAjuda == true && 
                <p className="retangulo">Adicione a data inicial e a data final em que foram feitos os pedidos que deseja migrar para o Bling. A API do Tiny tem um limite de requisições por minuto que deve ser respeitado, ou seja, a quantidade de pedidos do período de tempo informado não pode ser maior que a quantidade de requisições disponibilizadas. Confira no link a seguir a quantidade correspondente ao seu plano contratado: https://www.bling.com.br/b/preferencias.php#cadastro/cadastros-configuracoes-contatos</p>
            }

            <fieldset>
                <legend>Configurações do migrador de pedidos</legend>

                <div className="input-group">
                    <label htmlFor="dataInicial">Data inicial</label>
                    <input id="dataIncial" type="date" size={10} value={dataInicial} onChange={(event) => setDataInicial(event.target.value)}></input>
                </div>

                <div className="input-group">
                    <label htmlFor="dataFinal">Data final</label>
                    <input id="dataFinal" type="date" size={10} value={dataFinal} onChange={(event) => setDataFinal(event.target.value)}></input>
                </div>

                <div className="input-group">
                    <input type="checkbox" id="enviarClienteComCodigo" checked={enviarClienteComCodigo} onChange={(event) => {setEnviarClienteComCodigo(!enviarClienteComCodigo)}} />
                    <label htmlFor="enviarClienteComCodigo">Enviar cliente com o código</label>
                </div>

                <div className="input-group">
                    <input type="checkbox" id="enviarTodasSituacoesPedido" checked={enviarTodasSituacoesPedido} onChange={(event) => {setEnviarTodasSituacoesPedido(!enviarTodasSituacoesPedido)}} />
                    <label htmlFor="enviarTodasSituacoesPedido">Enviar pedidos em qualquer situação</label>
                </div>
            </fieldset>

            <div id="container-botoes-formulario">
                {(dataInicial.length > 0 && dataFinal.length > 0 && loadingStatus=="") ?
                    <button onClick={() => migrarPedidos()}>Migrar pedidos</button>
                :
                    <button disabled style={{backgroundColor: '#d3dbde'}}>Migrar pedidos</button>
                }

                <span>{loadingStatus}</span>
            </div>
        </div>
    );
}