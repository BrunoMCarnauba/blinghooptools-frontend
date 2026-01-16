import React, { useState, useEffect } from 'react';
import { criarExcel, lerExcel } from '../../utils/excel';

import Cabecalho from '../../components/cabecalho';
import Loading from '../../components/loading';

import './styles.css';

export default function TelaExtraiItens(){
    const [nomeArquivoExcel, setNomeArquivoExcel] = useState<string>('Itens extraídos');
  
    const [arquivoBase, setArquivosBase] = useState<any>();
    const [arquivosExtracao, setArquivosExtracao] = useState<any>();
  
    const [permitirCodigosRepetidos, setPermitirCodigosRepetidos] = useState<boolean>(false);
    const [manterCodigosBase, setManterCodigosBase] = useState<boolean>(true);
  
    const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
    const [msgErro, setMsgErro] = useState<string>("");
    const [statusCarregando, setStatusCarregando] = useState<string>("");

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
        setStatusCarregando("Lendo tabelas...");
        dadosBase = await lerExcel(arquivoBase[0]);
        for(let i=0; i<arquivosExtracao.length; i++){
          dadosExtracao = dadosExtracao.concat(await lerExcel(arquivosExtracao[i]));  //Junta o array recebido com que já está presente no array dadosExtracao.
        }
      }catch(erro){
        console.log("Erro ao tentar ler a(s) tabela(s) enviadas. Erro: "+erro);
      }
  
      if(dadosBase.length > 0 && dadosExtracao.length > 0){
        setStatusCarregando("Extraindo itens...");
  
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
  
        setStatusCarregando("Criando tabela com os itens extraídos...");
        if(itensExtraidos.length == 0 && manterCodigosBase == true){
          setMsgErro("Nenhum dado da tabela base foi encontrado na tabela 2, então nenhum foi extraído");
        }else if(dadosExtracao.length == 0 && manterCodigosBase == false){
          setMsgErro("Todos os dados da tabela base foram encontrados na tabela 2, então todos foram removidos");
        }else if(manterCodigosBase == true){
          await criarExcel(nomeArquivoExcel, itensExtraidos);
        }else{
          await criarExcel(nomeArquivoExcel, dadosExtracao);
        }
      }
  
      setStatusCarregando("");
    }
  
    const teste = async () => {
  
    }

    return(
        <div id="tela-extrai-itens">
            <Cabecalho titulo="Extração de itens" />

            <div className="conteudo">
                <form>
                    <fieldset>
                        <legend>Identificação</legend>

                        <div className="input-group">
                            <label htmlFor="nome-arquivo-excel">Nome para o arquivo excel</label>
                            <input id="nome-arquivo-excel" type="text" value={nomeArquivoExcel} onChange={(event) => setNomeArquivoExcel(event.target.value)} />
                        </div>
                    </fieldset>

                    <fieldset id="opcoes-extracao">
                        <legend>Opções para extração</legend>

                        <div className="input-group-horizontal">
                            <input id="considerar-codigos-repetidos" type="checkbox" checked={permitirCodigosRepetidos} onChange={(event) => {setPermitirCodigosRepetidos(!permitirCodigosRepetidos)}} />
                            <label htmlFor="considerar-codigos-repetidos">Considerar os códigos repetidos da tabela base (eles também poderão se repetir na tabela 2)</label>
                        </div>

                        <div className="input-group-horizontal">
                            <input id="manter-itens" type="checkbox" checked={manterCodigosBase} onChange={(event) => {setManterCodigosBase(!manterCodigosBase)}}/>
                            <label htmlFor="manter-itens">Mantenha marcado se deseja manter os códigos da tabela base e desmarcado se deseja remover os itens da tabela base</label>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Tabelas</legend>

                        <div className="input-group">
                            <label htmlFor="tabela-busca">Tabela (base) com os códigos a serem buscados (.xls, .xlsx)</label>
                            <input id="tabela-busca" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => {setArquivosBase(event.target.files)}} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="tabela-alvo">Tabela(s) onde os itens serão buscados (.xls, .xlsx)</label>
                            <input id="tabela-alvo" type="file" multiple accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => {setArquivosExtracao(event.target.files)}} />
                        </div>
                    </fieldset>

                    <button type="button" disabled={(nomeArquivoExcel == '' || arquivoBase == null || arquivosExtracao == null || statusCarregando != "")} onClick={() => extrairItens()}>Extrair itens</button>
                </form>
            </div>

            <Loading textoStatus={statusCarregando} />
        </div>
    );

}