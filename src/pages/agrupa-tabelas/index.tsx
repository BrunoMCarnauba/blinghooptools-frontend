import React, { useState, useEffect } from 'react';
import { criarExcel, lerExcel } from '../../utils/excel';

import Cabecalho from '../../components/cabecalho';
import Loading from '../../components/loading';

import './styles.css';

export default function TelaAgrupaTabelas(){

    const [nomeArquivoExcel, setNomeArquivoExcel] = useState<string>('');

    const [arquivosExcel, setArquivosExcel] = useState<any>();
    const [juntarTudoEmUm, setJuntarTudoEmUm] = useState<boolean>(true);
    const [qtdMaximaLinhasPorTabela, setQtdMaximaLinhasPorTabela] = useState<number>(500);
  
    const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
    const [statusCarregando, setStatusCarregando] = useState<string>("");

    useEffect(() => {
    }, []);
  
    /**
     * Cria um novo excel com as tabelas importadas agrupadas de acordo com as opções escolhidas.
     */
    const agruparTabelasExcel = async () => {
      let dadosExcel:any[] = [];
  
      try{
        setStatusCarregando("Lendo tabelas...");
        for(let i=0; i<arquivosExcel.length; i++){
          dadosExcel = dadosExcel.concat(await lerExcel(arquivosExcel[i]));  //Junta o array recebido com que já está presente no array dadosERP.
        }
      }catch(erro){
        console.log("Erro ao tentar ler o arquivo exportado do ERP. Erro: "+erro);
      }
  
      setStatusCarregando("Criando nova(s) tabela(s)...");
      if(juntarTudoEmUm == false && dadosExcel.length > 0){ //Cria tabelas com a quantidade máxima de linhas definida pelo usuário
        let contador = 1;
        let dadosNovaTabela:any[] = [];
        for(let i = 0; i < dadosExcel.length; i++){
          contador++;
          dadosNovaTabela.push(dadosExcel[i]);
  
          if(contador == qtdMaximaLinhasPorTabela || (i+1) == dadosExcel.length){
            await criarExcel(nomeArquivoExcel+" "+(i+1), dadosNovaTabela);
            dadosNovaTabela = [];
            contador = 1;
          }
        }
      }else if (dadosExcel.length>0){ //Cria apenas um novo excel com tudo unido em uma só tabela
        await criarExcel(nomeArquivoExcel, dadosExcel);
      }
  
      setStatusCarregando("");
    }
  
    const teste = async () => {
  
    }

    return(
        <div id="tela-agrupa-tabelas">
            <Cabecalho titulo="Agrupamento de tabelas" />

            <div className="conteudo">
                <form>
                    <fieldset>
                        <legend>Agrupar tabelas</legend>

                        <div className="input-group">
                            <label htmlFor="nome-arquivo-excel">Nome para o arquivo excel</label>
                            <input id="nome-arquivo-excel" type="text" value={nomeArquivoExcel} onChange={(event) => setNomeArquivoExcel(event.target.value)} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="arquivo-excel">Tabela(s) excel (.xls, .xlsx)</label>
                            <input id="arquivo-excel" type="file" multiple accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => {setArquivosExcel(event.target.files)}} />
                        </div>

                        {juntarTudoEmUm==false && 
                            <div className="input-group">
                                <label htmlFor="linhas-por-tabela">Quantidade máxima de linhas por tabela</label>
                                <input id="linhas-por-tabela" type="number" onChange={(event) => setQtdMaximaLinhasPorTabela(parseInt(event.target.value))} />
                            </div>
                        }

                        <div className="input-group-horizontal">
                            <input id="agrupar-tudo" type="checkbox" checked={juntarTudoEmUm} onChange={(event) => {setJuntarTudoEmUm(!juntarTudoEmUm)}} />
                            <label htmlFor="agrupar-tudo">Juntar todo conteúdo em uma só tabela</label>
                        </div>
                    </fieldset>

                    <button type="button" onClick={() => agruparTabelasExcel()} disabled={(nomeArquivoExcel == '' || arquivosExcel == null || qtdMaximaLinhasPorTabela < 11 || statusCarregando != "")}>Agrupar tabelas</button>
                </form>
            </div>

            <Loading textoStatus={statusCarregando} />
        </div>
    );
}