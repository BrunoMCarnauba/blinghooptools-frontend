/* eslint-disable */
import React, { useState, useEffect } from 'react';
import HoopProvider from '../../providers/HoopAPI';
import TinyProvider from '../../providers/TinyAPI';
import BlingProvider from '../../providers/BlingAPI';
import MenuSuperior from '../../components/menu_superior/index';

import './styles.css';

interface ProdutoAtualizado {
    codigoSKU: string,
    descricao: string,
    quantidade: number,
    unidade: string,
    fabricante: string,
    ambiente: string,
    precoVenda: number,
    precoCusto: number,
    precoTotalVenda: number,
    precoTotalCusto: number
}

class ProdutoAtualizado{
    constructor(public codigoSKU:string='', public descricao: string='', public quantidade:number=0, public unidade: string='', public fabricante: string='', public ambiente: string='', public precoVenda: number=0, public precoCusto: number=0, public precoTotalVenda: number=0, public precoTotalCusto: number=0) {}
}

export default function TelaEnviaOrdemDeCompra(){
    const [urlOrdemDeCompra, setURLOrdemDeCompra] = useState<string>("https://");
    const [agruparItensDuplicados, setAgruparItensDuplicados] = useState<boolean>(true);
    const [blingERP, setBlingERP] = useState<boolean>(true);

    const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
    const [msgErro, setMsgErro] = useState<string>("");
    const [loadingStatus, setLoadingStatus] = useState<string>("");

    useEffect(() => {

    }, []);

    const enviarOrdemDeCompra = async () => {
        setMsgErro("");
        setLoadingStatus("Coletando dados da ordem de compra HoopDecor...");

        try{
            let hoopProvider = new HoopProvider();
            let dadosOrdemDeCompra = await hoopProvider.getDadosOrdemDeCompra(urlOrdemDeCompra);
            console.log(dadosOrdemDeCompra);

            // if(dadosOrcamento.purchase_orders != undefined){
            //     setNumeroOrcamento(dadosOrcamento.visible_number);
            //     setNomeCliente(dadosOrcamento.clients[0].name);
            //     setTotalFrete(dadosOrcamento.shipping_fare);
            //     setNomeVendedor(dadosOrcamento.users[0].fullName);
            //     let itensPorAmbiente = dadosOrcamento.quotation.items;
            //     let produtosAtualizados: ProdutoAtualizado[] = [];
            //     let produtoAtualizado: ProdutoAtualizado;

            //     // Pegando todos os produtos da ordem de compra HoopDecor
            //     for(let x = 0; x<itensPorAmbiente.length; x++){
            //         let itensDoAmbiente = itensPorAmbiente[x].items;

            //         for(let y = 0; y<itensDoAmbiente.length; y++){
            //             produtoAtualizado = new ProdutoAtualizado();
            //             produtoAtualizado.codigoSKU = itensDoAmbiente[y].reference;
            //             produtoAtualizado.descricao = itensDoAmbiente[y].description+" ["+itensDoAmbiente[y].manufacturer.trade+"]";
            //             produtoAtualizado.quantidade = parseFloat(itensDoAmbiente[y].quantity);
            //             produtoAtualizado.unidade = itensDoAmbiente[y].unit;
            //             produtoAtualizado.fabricante = itensDoAmbiente[y].manufacturer.trade;
            //             produtoAtualizado.ambiente = itensDoAmbiente[y].section;
            //             produtosAtualizados.push(produtoAtualizado);
            //         }
            //     }

            //     if(agruparItensDuplicados == true){
            //         setLoadingStatus("Agrupando itens repetidos...");
            //         // Agrupando itens duplicados em um só item
            //         for(let x = 0; x<produtosAtualizados.length; x++){
            //             for(let y = x+1; y<produtosAtualizados.length; y++){
            //                 if(produtosAtualizados[x].codigoSKU == produtosAtualizados[y].codigoSKU){
            //                     produtosAtualizados[x].quantidade = produtosAtualizados[x].quantidade+produtosAtualizados[y].quantidade;
            //                     produtosAtualizados.splice(y,1);    //Apagando produto duplicado
            //                 }
            //             }
            //         }
            //     }

            //     let tinyProvider = new TinyProvider();
            //     let blingProvider = new BlingProvider();
            //     let produtoERP;
            //     let precoTotalVenda:number = 0;
            //     let precoTotalCusto:number = 0;
            //     setLoadingStatus("Consultando preços no ERP...");
            //     //Consultando produtos no ERP e pegando os preços de custo e de venda
            //     for(let x = 0; x<produtosAtualizados.length; x++){
            //         if(blingERP == true){   //Se a consulta for no Bling
            //             produtoERP = await blingProvider.getProdutoPorCodigo(produtosAtualizados[x].codigoSKU);
            //             produtosAtualizados[x].precoVenda = parseFloat(produtoERP.preco);
            //             produtosAtualizados[x].precoCusto = parseFloat(produtoERP.precoCusto);
            //         }else{  //Se a consulta for no Tiny
            //             produtoERP = await tinyProvider.getProdutoPorCodigoSKU(produtosAtualizados[x].codigoSKU);
            //             produtosAtualizados[x].precoVenda = produtoERP.preco;
            //             produtosAtualizados[x].precoCusto = produtoERP.preco_custo;
            //         }

            //         produtosAtualizados[x].precoTotalVenda = produtosAtualizados[x].quantidade*produtosAtualizados[x].precoVenda;
            //         produtosAtualizados[x].precoTotalCusto = produtosAtualizados[x].quantidade*produtosAtualizados[x].precoCusto;

            //         precoTotalVenda = precoTotalVenda + produtosAtualizados[x].precoTotalVenda;
            //         precoTotalCusto = precoTotalCusto + produtosAtualizados[x].precoTotalCusto;
            //     }

            //     setProdutosAtualizados(produtosAtualizados);
            //     setTotalVendaSemFrete(precoTotalVenda);
            //     setTotalCusto(precoTotalCusto);

                // console.log(dadosOrcamento);
                // console.log(produtosAtualizados);
            // }
        }catch(erro){
            setMsgErro(erro.toString());
        }

        setLoadingStatus("");
    }

    const imprimirResultado = async () => {
        window.print();
    }

    const teste = async () => {

    }

    return (
        <div id="tela-puxa-custos">
            <MenuSuperior tituloPagina={"Envio de ordem de compra para o ERP"} ajudaPressionado={() => setVisualizarAjuda(!visualizarAjuda)}/>

            {visualizarAjuda == true && 
                <p className="retangulo">Adicione o link de impressão da ordem e compra HoopDecor no campo "URL da ordem de compra". É importante manter o "https://" no começo do link, por exemplo: "https://hoopdecor.com/orcamentos/MzIzMzc3". Depois pressione "Enviar ordem de compra" e aguarde a execução da tarefa.</p>
            }

            <fieldset>
                <legend>Configurações</legend>

                <div className="input-group">
                    <label>URL da ordem de compra</label>
                    <input id="urlOrdemDeCompra" type="text" size={50} value={urlOrdemDeCompra} onChange={(event) => setURLOrdemDeCompra(event.target.value)}></input>
                </div>

                <div className="input-group">
                    <input type="checkbox" id="agruparItensDuplicados" checked={agruparItensDuplicados} onChange={(event) => {setAgruparItensDuplicados(!agruparItensDuplicados)}} />
                    <label htmlFor="agruparItensDuplicados">Agrupar itens duplicados da ordem de compra</label>
                </div>

                <div className="input-group">
                    <input type="checkbox" id="blingERP" checked={true} onChange={(event) => {setBlingERP(true)}} />
                    <label htmlFor="blingERP">Matenha marcado se deseja enviar para o Bling e desmarcado se deseja enviar para o Tiny</label>
                </div>
            </fieldset>

            <div className="container-botoes-formulario">
                {(urlOrdemDeCompra.length > 25 && loadingStatus=="") ?
                    <button onClick={() => enviarOrdemDeCompra()}>Enviar ordem de compra</button>
                :
                    <button disabled style={{backgroundColor: '#d3dbde'}}>Enviar ordem de compra</button>
                }

                <span>{loadingStatus}</span>
                <span className="texto-erro">{msgErro}</span>
            </div>
        </div>
    );
}