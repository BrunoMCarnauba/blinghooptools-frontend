/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { criarExcel, lerExcel } from '../../utils/excel';

import './styles.css';
import MenuSuperior from '../../components/menu_superior';

export default function TelaExtraiItens() {
  const [nomeArquivoExcel, setNomeArquivoExcel] = useState<string>('Itens extraídos');
  
  const [arquivoBase, setArquivosBase] = useState<any>();
  const [arquivosExtracao, setArquivosExtracao] = useState<any>();

  const [permitirCodigosRepetidos, setPermitirCodigosRepetidos] = useState<boolean>(false);
  const [manterCodigosBase, setManterCodigosBase] = useState<boolean>(true);

  const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
  const [msgErro, setMsgErro] = useState<string>("");
  const [loadingStatus, setLoadingStatus] = useState<string>("");

  useEffect(() => {
  }, []);

  /**
   * Cria um novo excel com as tabelas importadas agrupadas de acordo com as opções escolhidas.
   */
  const extrairItens = async () => {
    setMsgErro("");
    let dadosBase:any[] = [];
    let dadosExtracao:any[] = [];
    let itensExtraidos:any[] = [];
    let itensJaVerificados: any[] = [];
    let colunaChaveDadosBase: string = "Código";
    let colunaChaveDadosExtracao: string = "Cód do fabricante";

    try{
      setLoadingStatus("Lendo tabelas...");
      dadosBase = await lerExcel(arquivoBase[0]);
      for(let i=0; i<arquivosExtracao.length; i++){
        dadosExtracao = dadosExtracao.concat(await lerExcel(arquivosExtracao[i]));  //Junta o array recebido com que já está presente no array dadosExtracao.
      }
    }catch(erro){
      console.log("Erro ao tentar ler a(s) tabela(s) enviadas. Erro: "+erro);
    }

    if(dadosBase.length > 0 && dadosExtracao.length > 0){
      setLoadingStatus("Extraindo itens...");

      for(let x = 0; x < dadosBase.length; x++){
        if(typeof dadosBase[x][colunaChaveDadosBase] === 'string'){
          dadosBase[x][colunaChaveDadosBase] = dadosBase[x][colunaChaveDadosBase].trim();  //Retira espaços extras que podem estar presentes no código
        }

        //Se for permitido código ou descrição repetida ou se o código ainda não tiver sido acessado, busque ele na tabela 2
        if(permitirCodigosRepetidos == true || itensJaVerificados.indexOf(dadosBase[x][colunaChaveDadosBase]) === -1){
          for(let y = 0; y < dadosExtracao.length; y++){
            if(typeof dadosExtracao[y][colunaChaveDadosExtracao] === 'string'){
              dadosExtracao[y][colunaChaveDadosExtracao] = dadosExtracao[y][colunaChaveDadosExtracao].trim(); //Retira espaços que o código exportado do bling contém.
            }

            // Se encontrar o código da tabela do base na tabela 2, então adicionar em uma nova tabela ou remover o item da tabela 2, conforme solicitado pelo usuário.
            if(dadosBase[x][colunaChaveDadosBase] == dadosExtracao[y][colunaChaveDadosExtracao]){
              console.log(dadosExtracao[y]);
              if(manterCodigosBase == true){  //Se for para manter apenas os dados da tabela base na tabela 2
                itensExtraidos.push(JSON.parse(JSON.stringify(dadosExtracao[y])));  //Adiciona um clone do objeto encontrado
              }
              dadosExtracao.splice(y,1);  //Remove o item encontrado. Se manterCodigosBase for igual a false, então a ideia é que no final fique nesse array apenas os itens que não foram encontrados na tabela base.

              break;  //Para pular a verificação do X para as próximas posições Y, já que o valor já foi encontrado.
            }
          }
        }

        itensJaVerificados.push(dadosBase[x][colunaChaveDadosBase]);
      }

      setLoadingStatus("Criando tabela com os itens extraídos...");
      if(itensExtraidos.length == 0 && manterCodigosBase == true){
        setMsgErro("Nenhum dado da tabela base foi encontrado na tabela 2, então nenhum foi extraído");
      }else if(itensExtraidos.length == 0 && manterCodigosBase == false){
        setMsgErro("Todos os dados da tabela base foram encontrados na tabela 2, então todos foram removidos");
      }else if(manterCodigosBase == true){
        await criarExcel(nomeArquivoExcel, itensExtraidos);
      }else{
        await criarExcel(nomeArquivoExcel, dadosExtracao);
      }
    }

    setLoadingStatus("");
  }

  const teste = async () => {

  }

  return (
    <div id="tela-extrai-itens">
      <MenuSuperior tituloPagina={"Extração de itens"} ajudaPressionado={() => setVisualizarAjuda(!visualizarAjuda)}/>

      {visualizarAjuda == true &&
        <p className="retangulo">Mantenha ou remova itens que tem o mesmo código que está na tabela base. Para isso, digite o nome que deseja dar para o novo arquivo e adicione a tabela base (coluna obrigatória: "Código") e a tabela onde vai ser buscado os itens (coluna obrigatória: "Cód do fabricante"). No final, pressione o botão "Extrair itens" e aguarde o processo ser concluído. A aplicação fará download do novo arquivo para o seu computador.</p>
      }

      <fieldset>
        <legend>Identificação</legend>

        <div className="input-group">
          <label htmlFor="nomeArquivoExcel">Nome para o arquivo excel</label>
          <input id="nomeArquivoExcel" type="text" value={nomeArquivoExcel} onChange={(event) => setNomeArquivoExcel(event.target.value)} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Opções para extração</legend>

        <div className="input-group">
            <input type="checkbox" id="permitirCodigosRepetidos" checked={permitirCodigosRepetidos} onChange={(event) => {setPermitirCodigosRepetidos(!permitirCodigosRepetidos)}} />
            <label htmlFor="permitirCodigosRepetidos">Considerar os códigos repetidos da tabela base (eles também poderão se repetir na tabela 2)</label>
        </div>

        <div className="input-group">
            <input type="checkbox" id="manterCodigosBase" checked={manterCodigosBase} onChange={(event) => {setManterCodigosBase(!manterCodigosBase)}} />
            <label htmlFor="manterCodigosBase">Matenha marcardo se deseja manter os códigos da tabela base e desmarcado se deseja remover os itens da tabela base</label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Planilhas</legend>

        <div className="input-group">
          <label>Planilha (base) com os códigos a serem buscados (.xls, .xlsx)</label>
          <input type="file" onChange={(event) => {setArquivosBase(event.target.files)}} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" /> 
        </div>

        <div className="input-group">
          <label>Planilha(s) onde os itens serão buscados (.xls, xlsx)</label>
          <input type="file" multiple onChange={(event) => {setArquivosExtracao(event.target.files)}} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" /> 
        </div>
      </fieldset>

      <div className="container-botoes-formulario">
          {nomeArquivoExcel != '' && arquivoBase != null && arquivosExtracao != null && loadingStatus == "" ?
            <button onClick={() => extrairItens()}>Extrair itens</button>
          :
            <button disabled style={{backgroundColor: '#d3dbde'}}>Extrair itens</button>
          }

          {/* <button onClick={() => teste()}>TESTE</button> */}

          <span>{loadingStatus}</span>
      </div>
    </div>
  );
}