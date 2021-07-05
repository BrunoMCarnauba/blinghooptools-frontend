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
    const [urlRelatorio, setURLRelatorio] = useState<string>("");
    const [taxaCartao, setTaxaCartao] = useState<number>(0);
    const [aliquotaComissaoArquiteto, setAliquotaComissaoArquiteto] = useState<number>(5);
    const [aliquotaComissaoVendedor, setAliquotaComissaoVendedor] = useState<number>(0);
    const [relatorioComissoesVendedores, setRelatorioComissoesVendedores] = useState<boolean>(false);

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
                    valorComissao = (negociosPessoa[y].final_value* (1 - (taxaCartao/100))* (aliquotaComissaoArquiteto/100));   //Valor de comissão do arquiteto
                    
                    if(relatorioComissoesVendedores == true){  //Se for relatório dos vendedores
                        valorComissao = negociosPessoa[y].final_value - valorComissao;  //Retira o valor da comissão do arquiteto do valor total para chegar no valor da comissão do vendedor
                    }

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
            <MenuSuperior tituloPagina={"Relatório de comissões"} ajudaPressionado={() => setVisualizarAjuda(!visualizarAjuda)}/>

            {visualizarAjuda == true && 
                <p className="retangulo">Adicione o link do relatório HoopDecor no campo "URL do relatório". É importante manter o "https://" no começo do link, por exemplo: "https://hoopdecor.com/orcamentos/MzIzMzc3". Depois escolha as opções de configuração, pressione "Puxar comissões" e aguarde a execução da tarefa. No final você poderá imprimir o resultado clicando no botão "Imprimir resultado" que aparecerá no fim da página.</p>
            }

            <fieldset>
                <legend>Comissões dos arquitetos</legend>

                <div className="input-group">
                    <label>URL do relatório</label>
                    <input id="urlRelatorio" type="text" size={50} value={urlRelatorio} onChange={(event) => setURLRelatorio(event.target.value)}></input>
                </div>

                <div className="input-group">
                    <label>Alíquota de comissão do arquiteto</label>
                    <input id="aliquotaComissaoArquiteto" type="number" size={50} value={aliquotaComissaoArquiteto} onChange={(event) => setAliquotaComissaoArquiteto(parseFloat(event.target.value))}></input>
                </div>

                <div className="input-group">
                    <label>Alíquota de comissão do vendedor</label>
                    <input id="aliquotaComissaoVendedor" type="number" size={50} value={aliquotaComissaoVendedor} onChange={(event) => setAliquotaComissaoVendedor(parseFloat(event.target.value))}></input>
                </div>

                <div className="input-group">
                    <label>Taxa fixa do cartão de crédito</label>
                    <input id="taxaCartao" type="number" size={50} value={taxaCartao} onChange={(event) => setTaxaCartao(parseFloat(event.target.value))}></input>
                </div>

                <div className="input-group">
                    <input type="checkbox" id="relatorioComissoesVendedores" checked={relatorioComissoesVendedores} onChange={(event) => {setRelatorioComissoesVendedores(!relatorioComissoesVendedores)}} />
                    <label htmlFor="relatorioComissoesVendedores">Mantenha marcado se deseja gerar o relatório dos vendedores e desmarcado se for para especificadores</label>
                </div>
            </fieldset>

            <div className="container-botoes-formulario">
                {(urlRelatorio.length > 25 && aliquotaComissaoArquiteto > 0 && aliquotaComissaoVendedor > 0 && loadingStatus=="") ?
                    <button onClick={() => puxarComissoesArquiteto()}>Puxar comissões</button>
                :
                    <button disabled style={{backgroundColor: '#d3dbde'}}>Puxar comissões</button>
                }

                <span>{loadingStatus}</span>
            </div>

            {listaComissoes.length > 0 &&
                <div id="resultado">
                    <header>
                        <p><strong>Relatório de comissões de </strong> {dataRelatorio}</p>
                        <p><strong>Alíquota da comissão dos arquitetos: </strong> {aliquotaComissaoArquiteto}%</p>
                        <p><strong>Alíquota da comissão dos vendedores: </strong> {aliquotaComissaoVendedor}%</p>
                        <p><strong>Taxa fixa de cartão: </strong> {taxaCartao}%</p>
                    </header>
                    
                    {listaComissoes.map((item: Comissionado, index: number) => 
                        <div id="container-produto" key={index.toString()}>
                            <div id="dados-comissionado">
                                <p><strong>Comissionado:</strong> {item.nomeComissionado}</p>
                            </div>

                            {item.comissoesNegocios.map((item: ComissaoNegocio, index: number) => 
                                <div className="pedido" key={index.toString()}>
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
                        <p><strong>Soma das comissões:</strong> R$:{valorTotalComissoes.toFixed(2)}</p>
                        <p>Desenvolvido por BrunoMCarnauba</p>
                    </footer>
                </div>
            }

            {listaComissoes.length > 0 && 
                <div className="container-botoes-formulario">
                    <button onClick={() => imprimirResultado()}>Imprimir resultado</button>
                </div>
            }
        </div>
    );
}