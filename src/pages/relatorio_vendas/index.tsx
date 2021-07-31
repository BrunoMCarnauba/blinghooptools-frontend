/* eslint-disable */
import React, { useState, useEffect } from 'react';
import HoopProvider from '../../providers/HoopAPI';
import MenuSuperior from '../../components/menu_superior/index';

import './styles.css';
import { criarExcel } from '../../utils/excel';

interface Venda{
    dataFechamento: string,
    numeroPedido: string,
    nomeCliente: string,
    cpfCliente: string,
    telefoneCliente: string,
    emailCliente: string,
    nomeResponsavel: string,
    cpfResponsavel: string,
    telefoneResponsavel: string,
    emailResponsavel: string,
    nomeArquiteto: string,
    valorItens: number,
    valorFrete: number,
    descricaoFormaPagamento: string
}

class Venda{
    constructor(public dataFechamento = '', public numeroPedido = '', public nomeCliente = '', public cpfCliente = '', public telefoneCliente = '', public emailCliente = '', 
    public nomeResponsavel = '', public cpfResponsavel = '', public telefoneResponsavel = '', public emailResponsavel = '',
    public valorItens = 0, public valorFrete = 0, public descricaoFormaPagamento = '') {}
}


export default function TelaRelatorioVendas(){
    const [urlRelatorio, setURLRelatorio] = useState<string>("");

    const [listaVendas, setListaVendas] = useState<Venda[]>([]);

    const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
    const [msgSucesso, setMsgSucesso] = useState<string>("");
    const [msgErro, setMsgErro] = useState<string>("");
    const [loadingStatus, setLoadingStatus] = useState<string>("");

    useEffect(() => {

    }, []);

    const gerarRelatorio = async () => {
        setMsgSucesso("");
        setMsgErro("");
        setLoadingStatus("Coletando dados do relatório HoopDecor...");

        try{
            let hoopProvider = new HoopProvider();
            let dadosRelatorio = await hoopProvider.getDadosRelatorio(urlRelatorio);
            // console.log(dadosRelatorio);

            if(dadosRelatorio.allDeals != undefined){
                let pessoas = dadosRelatorio.users;
                let negociosPessoa;
                let listaVendas: Venda[] = [];

                for(let x = 0; x < pessoas.length; x++){
                    negociosPessoa = pessoas[x].deals;

                    for(let y = 0; y < negociosPessoa.length; y++){
                        let venda = new Venda();
                        venda.dataFechamento = negociosPessoa[y].conversion_date;
                        venda.numeroPedido = negociosPessoa[y].visible_number;
                        venda.nomeResponsavel = pessoas[x].fullName;
                        if(pessoas[x].extradata != null){
                            venda.telefoneResponsavel = pessoas[x].extradata.whats;
                        }
                        venda.emailResponsavel = pessoas[x].email;
                        // venda.cpfResponsavel = pessoas[x].cpf;
                        if(negociosPessoa[y].clients.length > 0){
                            venda.nomeCliente = negociosPessoa[y].clients[0].name;
                            venda.cpfCliente = negociosPessoa[y].clients[0].cpf || negociosPessoa[y].clients[0].cnpj;
                            // venda.telefoneCliente = negociosPessoa[y].clients[0].extradata.whats;
                            venda.emailCliente = negociosPessoa[y].clients[0].email;
                        }
                        venda.valorItens = negociosPessoa[y].final_value;
                        venda.valorFrete = negociosPessoa[y].shipping_fare;

                        listaVendas.push(venda);
                    }
                }

                setLoadingStatus("Gerando planilha excel...");
                await criarExcel("Relatório de vendas", listaVendas);
                setMsgSucesso("Relatório gerado com sucesso!");
            }
        }catch(erro){
            setMsgErro(erro);
        }

        setLoadingStatus("");
    }

    const imprimirResultado = async () => {
        window.print();
    }

    const teste = async () => {

    }

    return (
        <div id="tela-relatorio-vendas">
            <MenuSuperior tituloPagina={"Relatório de vendas"} ajudaPressionado={() => setVisualizarAjuda(!visualizarAjuda)}/>

            {visualizarAjuda == true && 
                <p className="retangulo">Adicione o link do relatório HoopDecor no campo "URL do relatório". É importante manter o "https://" no começo do link, por exemplo: "https://hoopdecor.com/orcamentos/MzIzMzc3". Depois escolha as opções de configuração, pressione "Gerar relatório" e aguarde a execução da tarefa. No final será baixado para o computador o arquivo excel com os dados do relatório.</p>
            }

            <fieldset>
                <legend>Relatório de vendas</legend>

                <div className="input-group">
                    <label htmlFor="urlRelatorio">URL do relatório PDF</label>
                    <input id="urlRelatorio" type="text" size={50} value={urlRelatorio} onChange={(event) => setURLRelatorio(event.target.value)}></input>
                </div>

                {/* <div className="input-group">
                    <label htmlFor="aliquotaComissaoArquiteto">Alíquota de comissão do arquiteto</label>
                    <input id="aliquotaComissaoArquiteto" type="number" size={50} value={aliquotaComissaoArquiteto} onChange={(event) => setAliquotaComissaoArquiteto(parseFloat(event.target.value))}></input>
                </div> */}
            </fieldset>

            <div className="container-botoes-formulario">
                {(urlRelatorio.length > 25 && loadingStatus=="") ?
                    <button onClick={() => gerarRelatorio()}>Gerar relatório</button>
                :
                    <button disabled style={{backgroundColor: '#d3dbde'}}>Gerar relatório</button>
                }

                <span>{loadingStatus}</span>
                <span className="texto-erro">{msgErro}</span>
                <span className="texto-sucesso">{msgSucesso}</span>
            </div>
        </div>
    );
}