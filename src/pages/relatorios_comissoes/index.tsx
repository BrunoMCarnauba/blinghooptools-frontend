/* eslint-disable */
import React, { useState, useEffect } from 'react';
import HoopProvider from '../../providers/HoopAPI';
import MenuSuperior from '../../components/menu_superior/index';

import './styles.css';

interface Comissionado{
    nomeComissionado: string,
    comissoesNegocios: ComissaoNegocio[],
    totalComissao: number
}

class Comissionado{
    constructor(public nomeComissionado = '', public comissoesNegocios = [new ComissaoNegocio()], public totalComissao = 0) {}
}

interface ComissaoNegocio{
    dataFechamento: string,
    numeroPedido: string,
    nomeCliente: string,
    valorVenda: number,
    valorComissao: number,
    descricaoFormaPagamento: string
}

class ComissaoNegocio{
    constructor(public dataFechamento = '', public numeroPedido = '', public nomeCliente = '', public valorVenda = 0, public valorComissao = 0, public descricaoFormaPagamento = '') {}
}


export default function TelaRelatorioComissoes(){
    const [urlRelatorio, setURLRelatorio] = useState<string>("https://");
    const [taxaCartao, setTaxaCartao] = useState<number>(0);
    const [aliquotaComissao, setAliquotaComissao] = useState<number>(0);
    const [agruparItensDuplicados, setAgruparItensDuplicados] = useState<boolean>(true);

    const [dataRelatorio, setDataRelatorio] = useState<number>(0);
    const [listaComissoes, setListaComissoes] = useState<Comissionado[]>([]);
    const [valorTotalComissoes, setValorTotalComissoes] = useState<number>(0);

    const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
    const [loadingStatus, setLoadingStatus] = useState<string>("");

    useEffect(() => {

    }, []);

    const puxarComissoesArquiteto = async () => {
        setLoadingStatus("Coletando dados do relatório HoopDecor...");
        let hoopProvider = new HoopProvider();
        let dadosRelatorio = await hoopProvider.getDadosRelatorio(urlRelatorio);

        console.log(dadosRelatorio);

        if(dadosRelatorio != null){
            setLoadingStatus("Calculando comissões...");

            let pessoas = dadosRelatorio.users;
            let negociosPessoa;
            let comissionado: Comissionado;
            let listaComissoesAux:Comissionado[] = [];
            let valorComissao = 0;
            let totalComissaoPessoa = 0;
            let totalComissoesAux:number = 0;

            for(let x = 0; x < pessoas.length; x++){
                negociosPessoa = pessoas[x].deals;

                comissionado = new Comissionado();
                comissionado.nomeComissionado = pessoas[x].fullName;
                totalComissaoPessoa = 0;
                
                let listaNegocios:ComissaoNegocio[] = [];

                for(let y = 0; y < negociosPessoa.length; y++){
                    valorComissao = (negociosPessoa[y].final_value* (1 - (taxaCartao/100))* (aliquotaComissao/100));
                    totalComissaoPessoa += valorComissao;

                    let comissao = new ComissaoNegocio(negociosPessoa[y].conversion_date, negociosPessoa[y].visible_number, negociosPessoa[y].clients[0].name, negociosPessoa[y].final_value, valorComissao, "");

                    listaNegocios.push(comissao);
                }
                comissionado.comissoesNegocios = listaNegocios;
                comissionado.totalComissao = totalComissaoPessoa;
                totalComissoesAux += totalComissaoPessoa;

                if(totalComissaoPessoa != 0){
                    listaComissoesAux.push(comissionado);
                }
            }
            setDataRelatorio(dadosRelatorio.date);
            setListaComissoes(listaComissoesAux);
            setValorTotalComissoes(totalComissoesAux);
        }

        setLoadingStatus("");
    }

    const imprimirResultado = async () => {
        window.print();
    }

    const teste = async () => {

    }

    return (
        <div id="tela-puxa-comissoes">
            <MenuSuperior tituloPagina={"Consulta de preços de custo"} ajudaPressionado={() => setVisualizarAjuda(!visualizarAjuda)}/>

            {visualizarAjuda == true && 
                <p className="retangulo">Adicione o link do relatório HoopDecor no campo "URL do relatório". É importante manter o "https://" no começo do link, por exemplo: "https://hoopdecor.com/orcamentos/MzIzMzc3". Depois escolha as opções de configuração, pressione "Puxar comissões" e aguarde a execução da tarefa. No final você poderá imprimir o resultado clicando no botão "Imprimir resultado" que aparecerá no fim da página.</p>
            }

            <fieldset>
                <legend>Configurações</legend>

                <div className="input-group">
                    <label>URL do relatório</label>
                    <input id="urlRelatorio" type="text" size={50} value={urlRelatorio} onChange={(event) => setURLRelatorio(event.target.value)}></input>
                </div>

                <div className="input-group">
                    <label>Taxa do cartão</label>
                    <input id="taxaCartao" type="text" size={50} value={taxaCartao} onChange={(event) => setTaxaCartao(parseFloat(event.target.value))}></input>
                </div>

                <div className="input-group">
                    <label>Alíquota comissão</label>
                    <input id="aliquotaComissao" type="text" size={50} value={aliquotaComissao} onChange={(event) => setAliquotaComissao(parseFloat(event.target.value))}></input>
                </div>

                {/* <div className="input-group">
                    <input type="checkbox" id="agruparItensDuplicados" checked={agruparItensDuplicados} onChange={(event) => {setAgruparItensDuplicados(!agruparItensDuplicados)}} />
                    <label htmlFor="agruparItensDuplicados">Agrupar itens duplicados do orçamento</label>
                </div> */}
            </fieldset>

            <div id="container-botoes-formulario">
                {(urlRelatorio.length > 25 && aliquotaComissao > 0 && loadingStatus=="") ?
                    <button onClick={() => puxarComissoesArquiteto()}>Puxar comissões dos arquitetos</button>
                :
                    <button disabled style={{backgroundColor: '#d3dbde'}}>Puxar custos</button>
                }

                <span>{loadingStatus}</span>
            </div>

            {listaComissoes.length > 0 &&
                <div id="resultado">
                    <header>
                        <p><strong>Relatório de comissões de </strong> {dataRelatorio}</p>
                        <p><strong>Alíquota da comissão: </strong> {aliquotaComissao}%</p>
                        <p><strong>Taxa fixa de cartão: </strong> {taxaCartao}%</p>
                    </header>
                    
                    {listaComissoes.map((item: Comissionado, index: number) => 
                        <div id="container-produto" key={index.toString()}>
                            <div id="linha-descricao">
                                <p><strong>Comissionado:</strong> {item.nomeComissionado}</p>
                            </div>

                            {item.comissoesNegocios.map((item: ComissaoNegocio, index: number) => 
                                <div>
                                    <p><strong>Pedido</strong> {item.numeroPedido}</p>
                                    <p>Cliente: {item.nomeCliente}</p>
                                    <p>Valor da venda: R$:{item.valorVenda.toFixed(2)}</p>
                                    <p>Comissão: R$:{item.valorComissao.toFixed(2)}</p>
                                </div>
                            )}

                            <div id="linha-precos">
                                <p><strong>Total de comissões:</strong> R$:{item.totalComissao.toFixed(2)}</p>
                            </div>
                        </div>
                    )}
                    
                    <footer>
                        <p><strong>Total de comissões:</strong> R$:{valorTotalComissoes.toFixed(2)}</p>
                        <p>Desenvolvido por BrunoMCarnauba</p>
                    </footer>
                </div>
            }

            {listaComissoes.length > 0 && 
                <div id="container-botoes-formulario">
                    <button onClick={() => imprimirResultado()}>Imprimir resultado</button>
                </div>
            }
        </div>
    );
}