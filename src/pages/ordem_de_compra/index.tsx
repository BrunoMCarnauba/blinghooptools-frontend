/* eslint-disable */
import React, { useState, useEffect } from 'react';
import HoopProvider from '../../providers/HoopAPI';
import TinyProvider from '../../providers/TinyAPI';
import BlingProvider from '../../providers/BlingAPI';
import MenuSuperior from '../../components/menu_superior/index';

import PedidoCompraBling, { ItemPedidoCompraBling, ItemPedidoCompraBlingContainer } from '../../models/PedidoCompraBling';
import FornecedorBling from '../../models/FornecedorBling';

import './styles.css';

export default function TelaEnviaOrdemDeCompra(){
    const [urlOrdemDeCompra, setURLOrdemDeCompra] = useState<string>("");
    const [agruparItensDuplicados, setAgruparItensDuplicados] = useState<boolean>(true);
    const [blingERP, setBlingERP] = useState<boolean>(true);

    const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
    const [msgSucesso, setMsgSucesso] = useState<string>("");
    const [msgErro, setMsgErro] = useState<string>("");
    const [loadingStatus, setLoadingStatus] = useState<string>("");

    useEffect(() => {

    }, []);

    const enviarOrdemDeCompra = async () => {
        setMsgSucesso("");
        setMsgErro("");
        setLoadingStatus("Coletando dados da ordem de compra HoopDecor...");

        try{
            let hoopProvider = new HoopProvider();
            let dadosOrdemDeCompra = await hoopProvider.getDadosOrdemDeCompra(urlOrdemDeCompra);
            // console.log(dadosOrdemDeCompra);

            if(dadosOrdemDeCompra.purchase_orders != undefined){
                let pedidoCompraBling = new PedidoCompraBling();
                let dataFechamento = new Date(dadosOrdemDeCompra.conversion_date.replace(/-/g, "/"));   //.replace substitui cada traço da data por uma barra
                pedidoCompraBling.datacompra = dataFechamento.toLocaleDateString('pt-BR', {timeZone: 'UTC'});

                pedidoCompraBling.ordemcompra = dadosOrdemDeCompra.visible_number;
                pedidoCompraBling.observacoes = dadosOrdemDeCompra.order.obs;
                pedidoCompraBling.observacaointerna = "Referente ao pedido HoopDecor de nº "+dadosOrdemDeCompra.visible_number;

                let fornecedorHoop = dadosOrdemDeCompra.purchase_orders[0].company;
                let fornecedorBling: FornecedorBling = new FornecedorBling();
                fornecedorBling.nome = fornecedorHoop.name;
                fornecedorBling.cpfcnpj = fornecedorHoop.cnpj.replace(/[^\d]+/g,'');    //.replace fazendo uso de expressões regulares para remover os caracteres que não for número
                pedidoCompraBling.fornecedor = fornecedorBling;

                let itensHoop = dadosOrdemDeCompra.purchase_orders[0].items;
                let itensBling: ItemPedidoCompraBlingContainer[] = [];
                let itemBling: ItemPedidoCompraBling;

                // Pegando todos os produtos da ordem de compra HoopDecor
                for(let x = 0; x<itensHoop.length; x++){
                    itemBling = new ItemPedidoCompraBling();
                    itemBling.codigo = itensHoop[x].reference;
                    itemBling.descricao = itensHoop[x].description;
                    itemBling.qtde = parseFloat(itensHoop[x].quantity);
                    itemBling.un = itensHoop[x].unit;
                    itemBling.valor = parseFloat(itensHoop[x].prices[0].price.cost);
                    itensBling.push(new ItemPedidoCompraBlingContainer(itemBling));
                }

                if(agruparItensDuplicados == true){
                    setLoadingStatus("Agrupando itens repetidos...");
                    // Agrupando itens duplicados em um só item
                    for(let x = 0; x<itensBling.length; x++){
                        for(let y = x+1; y<itensBling.length; y++){
                            if(itensBling[x].item.codigo == itensBling[y].item.codigo){
                                itensBling[x].item.qtde = itensBling[x].item.qtde + itensBling[y].item.qtde;
                                itensBling.splice(y,1);    //Apagando produto duplicado e ajustando posições do vetor
                                y = y-1;    //Para que seja conferido novamente a mesma posição checada anteriormente. Já que o item que estava na posição após o do item que foi apagado voltou uma posição.
                            }
                        }
                    }
                }

                pedidoCompraBling.itens = itensBling;
                // console.log(pedidoCompraBling);

                let tinyProvider = new TinyProvider();
                let blingProvider = new BlingProvider();
                setLoadingStatus("Cadastrando ordem de compra no ERP...");
                //Cadastrando ordem de compra no ERP
                if(blingERP == true){   //Se o cadastro for no Bling
                    await blingProvider.incluirPedidoCompra(pedidoCompraBling);
                }else{  //Se o cadastro for no Tiny
                    
                }

                setMsgSucesso("Pedido de compra enviado com sucesso!");  //Se chegou aqui então não deu erro nos passos acima (não caiu no catch)
            }
        }catch(erro){
            setMsgErro(erro.toString());
        }

        setLoadingStatus("");
    }

    const teste = async () => {

    }

    return (
        <div id="tela-puxa-custos">
            <MenuSuperior tituloPagina={"Envio de ordem de compra para o ERP"} ajudaPressionado={() => setVisualizarAjuda(!visualizarAjuda)}/>

            {visualizarAjuda == true && 
                <p className="retangulo">Adicione o link de impressão da ordem de compra HoopDecor no campo "URL da ordem de compra". É importante manter o "https://" no começo do link, por exemplo: "https://hoopdecor.com/orcamentos/MzIzMzc3". Depois pressione "Enviar ordem de compra" e aguarde a execução da tarefa.</p>
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
                    <input type="checkbox" id="blingERP" checked={true} onChange={(event) => {alert("O cadastro no Tiny ERP ainda não está disponível")}} />
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
                <span className="texto-sucesso">{msgSucesso}</span>
                <span className="texto-erro">{msgErro}</span>
            </div>
        </div>
    );
}