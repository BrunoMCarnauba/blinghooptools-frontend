/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { criarExcel, lerExcel } from '../../utils/excel';

import './styles.css';
import MenuSuperior from '../../components/menu_superior';

export default function TelaFerramentasDiversas() {
  const [nomeArquivoExcel, setNomeArquivoExcel] = useState<string>('');

  // const [substituicaoTributaria, setSubstituicaoTributaria] = useState<number | null>(null);
  // const [desconto, setDesconto] = useState<number | null>(null);
  // const [fator, setFator] = useState<number | null>(null);
  // const [acrescimo, setAcrescimo] = useState<number | null>(null);

  const [arquivosExcel, setArquivosExcel] = useState<any>();
  const [juntarTudoEmUm, setJuntarTudoEmUm] = useState<boolean>(true);
  const [qtdMaximaLinhasPorTabela, setQtdMaximaLinhasPorTabela] = useState<number>(500);

  const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>("");

  useEffect(() => {
  }, []);

  /**
   * Cria um novo excel com as tabelas importadas agrupadas de acordo com as opções escolhidas.
   */
  const agruparTabelasExcel = async () => {
    let dadosExcel:any[] = [];

    try{
      setLoadingStatus("Lendo tabelas...");
      for(let i=0; i<arquivosExcel.length; i++){
        dadosExcel = dadosExcel.concat(await lerExcel(arquivosExcel[i]));  //Junta o array recebido com que já está presente no array dadosERP.
      }
    }catch(erro){
      console.log("Erro ao tentar ler o arquivo exportado do ERP. Erro: "+erro);
    }

    setLoadingStatus("Criando nova(s) tabela(s)...");
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

    setLoadingStatus("");
  }

  const teste = async () => {

  }

  return (
    <div id="tela-ferramentas-diversas">
      <MenuSuperior tituloPagina={"Ferramentas diversas"} ajudaPressionado={() => setVisualizarAjuda(!visualizarAjuda)}/>

      {visualizarAjuda == true &&
        <p className="retangulo">Não informado</p>
      }

      <fieldset>
        <legend>Agrupar tabelas</legend>

        <div className="input-group">
          <label htmlFor="nomeArquivoExcel">Nome para o arquivo excel</label>
          <input id="nomeArquivoExcel" type="text" value={nomeArquivoExcel} onChange={(event) => setNomeArquivoExcel(event.target.value)} />
        </div>

        <div className="input-group">
          <label>Planilha(s) excel</label>
          <input type="file" multiple onChange={(event) => {setArquivosExcel(event.target.files)}}/> 
        </div>

        {juntarTudoEmUm==false && 
          <div className="input-group">
            <label htmlFor="qtdMaximaLinhasPorTabela">Quantidade máxima de linhas por tabela</label>
            <input id="qtdMaximaLinhasPorTabela" type="number" onChange={(event) => setQtdMaximaLinhasPorTabela(parseFloat(event.target.value))} />
          </div>
        }

        <div className="input-group">
          <input type="checkbox" id="juntarTudoEmUm" checked={juntarTudoEmUm} onChange={(event) => {setJuntarTudoEmUm(!juntarTudoEmUm)}} />
          <label htmlFor="juntarTudoEmUm">Juntar todo conteúdo em uma só tabela</label>
        </div>

        <div id="container-botoes-formulario">
          {nomeArquivoExcel != '' && arquivosExcel != null && qtdMaximaLinhasPorTabela > 10 && loadingStatus == "" ?
            <button onClick={() => agruparTabelasExcel()}>Agrupar tabelas</button>
          :
            <button disabled style={{backgroundColor: '#d3dbde'}}>Agrupar tabelas</button>
          }

          {/* <button onClick={() => teste()}>TESTE</button> */}

          <span>{loadingStatus}</span>
        </div>
      </fieldset>

      {/* <fieldset>
        <legend>Variáveis para cálculo dos preços</legend>

        <div className="input-group">
          <label>% Substituição tributária (ST)</label>
          <input type="number" onChange={(event) => setSubstituicaoTributaria(parseFloat(event.target.value))} />
        </div>

        <div className="input-group">
          <label>% Desconto</label>
          <input type="number" onChange={(event) => setDesconto(parseFloat(event.target.value))} />
        </div>

        <div className="input-group">
          <label>Fator</label>
          <input type="number" onChange={(event) => setFator(parseFloat(event.target.value))} />
        </div>

        <div className="input-group">
          <label htmlFor="acrescimo">% Acréscimo</label>
          <input id="acrescimo" type="number" onChange={(event) => setAcrescimo(parseFloat(event.target.value))}/>
        </div>
      </fieldset> */}
    </div>
  );
}