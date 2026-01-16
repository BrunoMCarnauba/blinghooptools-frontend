import React, { useState, useEffect } from 'react';
import { criarExcel, lerExcel } from '../../utils/excel';

import Cabecalho from '../../components/cabecalho';
import BotaoFlutuante from '../../components/botao-flutuante';
import Loading from '../../components/loading';
import Modal from '../../components/modal';

import HoopProvider from '../../providers/HoopAPI';
import PedidoCompraBling, { ItemPedidoCompraBling, ItemPedidoCompraBlingContainer } from '../../models/PedidoCompraBling';
import FornecedorBling from '../../models/FornecedorBling';
import TinyProvider from '../../providers/TinyAPI';
import BlingProvider from '../../providers/BlingAPI';

import './styles.css';

interface ProdutoAtualizado {
    codigoSKU: string,
    codigoFabricante: string,
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
    constructor(public codigoSKU:string='', public codigoFabricante: string = " - ", public descricao: string='', public quantidade:number=0, public unidade: string='', public fabricante: string='', public ambiente: string='', public precoVenda: number=0, public precoCusto: number=0, public precoTotalVenda: number=0, public precoTotalCusto: number=0) {}
}

export default function TelaPuxaCustos(){
    const [urlOrcamento, setURLOrcamento] = useState<string>("https://");
    const [agruparItensDuplicados, setAgruparItensDuplicados] = useState<boolean>(true);
    const [blingERP, setBlingERP] = useState<boolean>(true);

    const [numeroOrcamento, setNumeroOrcamento] = useState<string>("");
    const [nomeCliente, setNomeCliente] = useState<string>("");
    const [nomeVendedor, setNomeVendedor] = useState<string>("");
    const [totalVendaSemFrete, setTotalVendaSemFrete] = useState<number>(0);
    const [totalCusto, setTotalCusto] = useState<number>(0);
    const [frete, setTotalFrete] = useState<number>(0);
    const [produtosAtualizados, setProdutosAtualizados] = useState<ProdutoAtualizado[]>([]);

    const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
    const [msgErro, setMsgErro] = useState<string>("");
    const [loadingStatus, setLoadingStatus] = useState<string>("");

    useEffect(() => {

    }, []);

    const puxarCustos = async () => {
        let erroRetornado = "";
        let codigosComErro = "";
        setMsgErro("");
        setLoadingStatus("Coletando dados do orçamento HoopDecor...");

        try{
            let hoopProvider = new HoopProvider();
            let dadosOrcamento = await hoopProvider.getDadosOrcamento(urlOrcamento);

            if(dadosOrcamento.visible_number != undefined){
                setNumeroOrcamento(dadosOrcamento.visible_number);
                if(dadosOrcamento.client != undefined){
                    setNomeCliente(dadosOrcamento.client.name);
                }else{
                    setNomeCliente("Não informado");
                }
                setTotalFrete(dadosOrcamento.shipping_fare);
                setNomeVendedor(dadosOrcamento.user.fullName);
                let itensPorAmbiente = dadosOrcamento.quotation.items;
                let produtosAtualizados: ProdutoAtualizado[] = [];
                let produtoAtualizado: ProdutoAtualizado;

                // Pegando todos os produtos do orçamento HoopDecor
                for(let x = 0; x<itensPorAmbiente.length; x++){
                    let itensDoAmbiente = itensPorAmbiente[x].items;

                    for(let y = 0; y<itensDoAmbiente.length; y++){
                        produtoAtualizado = new ProdutoAtualizado();
                        produtoAtualizado.codigoSKU = itensDoAmbiente[y].reference;
                        produtoAtualizado.codigoFabricante = itensDoAmbiente[y].sku;
                        produtoAtualizado.descricao = itensDoAmbiente[y].description+" ["+itensDoAmbiente[y].manufacturer.trade+"]";
                        produtoAtualizado.quantidade = parseFloat(itensDoAmbiente[y].quantity);
                        produtoAtualizado.unidade = itensDoAmbiente[y].unit;
                        produtoAtualizado.fabricante = itensDoAmbiente[y].manufacturer.trade;
                        produtoAtualizado.ambiente = itensDoAmbiente[y].section;
                        produtosAtualizados.push(produtoAtualizado);
                    }
                }

                if(agruparItensDuplicados == true){
                    setLoadingStatus("Agrupando itens repetidos...");
                    // Agrupando itens duplicados em um só item
                    for(let x = 0; x<produtosAtualizados.length; x++){
                        for(let y = x+1; y<produtosAtualizados.length; y++){
                            if(produtosAtualizados[x].codigoSKU == produtosAtualizados[y].codigoSKU){
                                produtosAtualizados[x].quantidade = produtosAtualizados[x].quantidade+produtosAtualizados[y].quantidade;
                                produtosAtualizados.splice(y,1);    //Apagando produto duplicado e ajustando posições do vetor
                                y = y-1;    //Para que seja conferido novamente a mesma posição checada anteriormente. Já que o item que estava na posição após o do item que foi apagado voltou uma posição.
                            }
                        }
                    }
                }

                let tinyProvider = new TinyProvider();
                let blingProvider = new BlingProvider();
                let produtoERP;
                let precoTotalVenda:number = 0;
                let precoTotalCusto:number = 0;
                setLoadingStatus("Consultando preços no ERP...");
                //Consultando produtos no ERP e pegando os preços de custo e de venda
                for(let x = 0; x<produtosAtualizados.length; x++){
                    if(blingERP == true){   //Se a consulta for no Bling
                        await blingProvider.getProdutoPorCodigo(produtosAtualizados[x].codigoSKU).then((produtoERP) => {
                            produtosAtualizados[x].precoVenda = parseFloat(produtoERP.preco);
                            produtosAtualizados[x].precoCusto = parseFloat(produtoERP.precoCusto);
                        }).catch((erro) => {
                            erroRetornado = erro;
                            codigosComErro += produtosAtualizados[x].codigoSKU+", ";
                        });
                    }else{  //Se a consulta for no Tiny
                        produtoERP = await tinyProvider.getProdutoPorCodigoSKU(produtosAtualizados[x].codigoSKU);
                        produtosAtualizados[x].precoVenda = produtoERP.preco;
                        produtosAtualizados[x].precoCusto = produtoERP.preco_custo;
                    }

                    produtosAtualizados[x].precoTotalVenda = produtosAtualizados[x].quantidade*produtosAtualizados[x].precoVenda;
                    produtosAtualizados[x].precoTotalCusto = produtosAtualizados[x].quantidade*produtosAtualizados[x].precoCusto;

                    precoTotalVenda = precoTotalVenda + produtosAtualizados[x].precoTotalVenda;
                    precoTotalCusto = precoTotalCusto + produtosAtualizados[x].precoTotalCusto;
                }

                setProdutosAtualizados(produtosAtualizados);
                setTotalVendaSemFrete(precoTotalVenda);
                setTotalCusto(precoTotalCusto);

                if(erroRetornado != ""){
                    setMsgErro(erroRetornado+" - Códigos afetados: "+codigosComErro);
                }
                // console.log(dadosOrcamento);
                // console.log(produtosAtualizados);
            }
        }catch(erro: any){
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
            <Cabecalho titulo="Consulta de preços de custo" />

            <div className="conteudo">
                <form>
                    <fieldset>
                        <legend>Configurações</legend>

                        <div className="input-group">
                            <label htmlFor="urlOrcamento">URL do orçamento</label>
                            <input id="urlOrcamento" type="text" size={50} value={urlOrcamento} onChange={(event) => setURLOrcamento(event.target.value)} />
                        </div>

                        <div className="input-group-horizontal">
                            <input id="agruparItensDuplicados" type="checkbox" checked={agruparItensDuplicados} onChange={(event) => {setAgruparItensDuplicados(!agruparItensDuplicados)}} />
                            <label htmlFor="agruparItensDuplicados">Agrupar itens duplicados do orçamento</label>
                        </div>

                        <div className="input-group-horizontal">
                            <input id="blingERP" type="checkbox" checked={blingERP} onChange={(event) => {setBlingERP(!blingERP)}} />
                            <label htmlFor="blingERP">Matenha marcado se deseja buscar no Bling e desmarcado se deseja buscar no Tiny</label>
                        </div>
                    </fieldset>

                    <div id="botoes-opcoes">
                        <button type="button" onClick={() => puxarCustos()} disabled={!(urlOrcamento.length > 25 && loadingStatus=="")}>Puxar custos</button>
                    </div>
                </form>

                {produtosAtualizados.length > 0 &&
                    <div id="resultado">
                        <header>
                            <p><strong>Número do orçamento: </strong>{numeroOrcamento}</p>
                            <p><strong>Nome do consultor: </strong>{nomeVendedor}</p>
                            <p><strong>Nome do cliente: </strong>{nomeCliente}</p>
                        </header>
                        
                        {produtosAtualizados.map((item: ProdutoAtualizado, index: number) => 
                            <div id="container-produto" key={index.toString()}>
                                {agruparItensDuplicados == false &&
                                    <div>
                                        <p><strong>Ambiente:</strong> {item.ambiente}</p> 
                                    </div>
                                }

                                <div id="linha-descricao">
                                    <p><strong>Código SKU:</strong> {item.codigoSKU} ({item.codigoFabricante})</p>
                                    <p><strong>Descrição:</strong> {item.descricao}</p>
                                    <p>{item.quantidade}{item.unidade}</p>
                                </div>

                                <div id="linha-precos">
                                    <p><strong>Preço de custo:</strong> R$:{item.precoCusto.toFixed(2)}</p>
                                    <p><strong>Preço de venda:</strong> R$:{item.precoVenda.toFixed(2)}</p>
                                    <p><strong>Total de custo:</strong> R$:{item.precoTotalCusto.toFixed(2)}</p>
                                    <p><strong>Total de venda:</strong> R$:{item.precoTotalVenda.toFixed(2)}</p>
                                </div>
                            </div>
                        )}
                        
                        <footer>
                            <div>
                                <p><strong>Valor do frete:</strong> R$:{frete.toFixed(2)}</p>
                                <p><strong>Total de custo sem o frete:</strong> R$:{totalCusto.toFixed(2)}</p>
                                <p><strong>Total de venda sem o frete:</strong> R$:{totalVendaSemFrete.toFixed(2)}</p>
                                <p>Desenvolvido por BrunoMCarnauba</p>
                            </div>
                            
                            {msgErro != "" &&
                                <p>Erro encontrado: {msgErro}</p>
                            }
                        </footer>
                    </div>
                }

                {produtosAtualizados.length > 0 && 
                    <div className="container-botoes-formulario">
                        <button onClick={() => imprimirResultado()}>Imprimir resultado</button>
                    </div>
                }

                <Modal titulo="Ajuda" visivel={visualizarAjuda} aoPressionarFechar={() => setVisualizarAjuda(false)}>
                  <div id="modal-ajuda">
                      <p>Adicione o link de compartilhamento ou de impressão do orçamento HoopDecor no campo "URL do orçamento".</p>
                      <p>É importante manter o "https://" no começo do link, por exemplo: "https://hoopdecor.com/orcamentos/MzIzMzc3".</p>
                      <p>Depois escolha as opções de configuração, pressione "Puxar custos" e aguarde a execução da tarefa. No final você poderá imprimir o resultado clicando no botão "Imprimir resultado" que aparecerá no fim da página.</p>
                      <button type="button" onClick={() => setVisualizarAjuda(false)}>Ok</button>
                  </div>
                </Modal>

                <BotaoFlutuante onClick={() => setVisualizarAjuda(!visualizarAjuda)} />
                <Loading textoStatus={loadingStatus} />
            </div>
        </div>
    );
}