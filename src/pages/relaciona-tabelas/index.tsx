import React, { useState, useEffect } from 'react';
import { criarExcel, lerExcel } from '../../utils/excel';

import Cabecalho from '../../components/cabecalho';
import BotaoFlutuante from '../../components/botao-flutuante';
import Loading from '../../components/loading';

import './styles.css';
import Modal from '../../components/modal';

/**
 * Inicia com os dados do Bling
 * Obs.: Falta desenvolver: Aplicar padrão de projeto
 */
 class NomesColunasERP {
    constructor(public id:string = 'ID', public codigo: string='', public descricao:string = 'Descrição', public unidade: string='Unidade', public classificacaoFiscal: string='',
    public origem: string = 'Origem', public precoVenda: string='Preço', public situacao: string = 'Situação', public estoque: string = 'Estoque', public precoCusto: string = 'Preço de custo', public codFornecedor: string = '',
    public fornecedor: string = '', public pesoLiquido: string = 'Peso líquido (Kg)', public pesoBruto: string = 'Peso bruto (Kg)', public gtinEAN: string = 'GTIN/EAN', public comprimentoProduto: string = '', public larguraProduto: string = '', public alturaProduto: string = '',
    public descricaoComplementar: string = '', public unidadePorCaixa: string = '', public tipoProduto = '', public cest: string = 'CEST', public unidadeMedida: string = '', public precoCompra: string = '') {
      this.configurarParaBling();
    }
  
     public configurarParaBling(){
      this.codigo ='Código'; this.codFornecedor = 'Cód no fornecedor'; this.fornecedor = 'Fornecedor'; this.larguraProduto = 'Largura do Produto'; this.alturaProduto = 'Altura do Produto';
      this.comprimentoProduto = 'Profundidade do produto'; this.descricaoComplementar = 'Descrição Complementar'; this.unidadePorCaixa = 'Unidade por Caixa'; this.tipoProduto = 'Produto Variação';
      this.unidadeMedida = 'Unidade de medida'; this.precoCompra = 'Preço de compra'; this.classificacaoFiscal = 'NCM';
     }
  
     public configurarParaTiny(){
      this.codigo ='Código (SKU)'; this.codFornecedor = 'Cód do fabricante'; this.fornecedor = 'Fabricante'; this.larguraProduto = 'Largura embalagem'; this.alturaProduto = 'Altura embalagem';
      this.comprimentoProduto = 'Comprimento embalagem'; this.descricaoComplementar = 'Descrição complementar'; this.unidadePorCaixa = 'Unidade por caixa'; this.tipoProduto = 'Tipo do produto';
      this.classificacaoFiscal = 'Classificação fiscal';
     }
}

export default function TelaRelacionaTabelas(){
    const [nomeFabricanteERP, setNomeFabricanteERP] = useState<string>('');
    const [nomeFantasiaFabricante, setNomeFantasiaFabricante] = useState<string>('');
  
    const [substituicaoTributaria, setSubstituicaoTributaria] = useState<number | null>(null);
    const [desconto, setDesconto] = useState<number | null>(null);
    const [fator, setFator] = useState<number | null>(null);
    const [acrescimo, setAcrescimo] = useState<number | null>(null);
  
    const [blingERP, setBlingERP] = useState<boolean>(true);
    const [relacionarPelaDescricao, setRelacionarPelaDescricao] = useState<boolean>(false);
    const [atualizarApenasPrecos, setAtualizarApenasPrecos] = useState<boolean>(false);
    const [inativarProdutos, setInativarProdutos] = useState<boolean>(true);
    const [permitirCodigosRepetidos, setPermitirCodigosRepetidos] = useState<boolean>(false);
    const [atualizarNCMCest, setAtualizarNCMCEST] = useState<boolean>(true);
    const [atualizarDimensoes, setAtualizarDimensoes] = useState<boolean>(true);
    const [converterDimensoesParaCm, setConverterDimensoesParaCm] = useState<boolean>(false);
    const [atualizarPeso, setAtualizarPeso] = useState<boolean>(true);
    const [atualizarUnidadePorCaixa, setAtualizarUnidadePorCaixa] = useState<boolean>(true);
    const [adicionarNomeFantasiaNaDescricao, setAdicionarNomeFantasiaNaDescricao] = useState<boolean>(false);
  
    const [nomesColunasERP, setNomesColunasERP] = useState<NomesColunasERP>(new NomesColunasERP());
    const [arquivosERP, setArquivosERP] = useState<any>();
    const [arquivoFabricante, setArquivoFabricante] = useState<any>();
  
    const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
    const [statusCarregando, setStatusCarregando] = useState<string>("");

    useEffect(() => {
    }, []);
  
    /**
     * Se vai atualizar apenas os preços, então não vai ser atualizar NCM, CEST e as dimensões.
     */
    const onClickAtualizarApenasPrecos = () => {
      if(!atualizarApenasPrecos === true){
        setAtualizarNCMCEST(false);
        setAtualizarDimensoes(false);
        setAtualizarPeso(false);
        setAtualizarUnidadePorCaixa(false);
      }else{
        setAtualizarNCMCEST(true);
        setAtualizarDimensoes(true);
        setAtualizarPeso(true);
        setAtualizarUnidadePorCaixa(true);
      }
  
      setAtualizarApenasPrecos(!atualizarApenasPrecos);
    }
  
    /**
     * Relaciona as duas tabelas (exportada do ERP e a do fabricante) através do código do fabricante e atualiza os dados da primeira com os da segunda.
     * Os produtos que são encontrados na segunda mas não são encontrados na primeira são salvos separadamente para que um novo excel seja gerado com eles.
     */
    const relacionarTabelas = async () => {
      setStatusCarregando("Lendo tabelas...");
      let dadosERP:any[] = [];
      let dadosFabricante: any[] = [];
      let novosProdutos: any[] = [];
      let itensJaRelacionados: any[] = [];
  
      if(blingERP == true){
        nomesColunasERP.configurarParaBling();
      }else{
        nomesColunasERP.configurarParaTiny();
      }
  
      try{
        //O usuário pode enviar mais de uma tabela do ERP de uma vez só, esse loop juntará todas as tabelas em um só array
        for(let i=0; i<arquivosERP.length; i++){
          dadosERP = dadosERP.concat(await lerExcel(arquivosERP[i]));  //Junta o array recebido com que já está presente no array dadosERP.
        }
        dadosFabricante = await lerExcel(arquivoFabricante[0]);
      }catch(erro){
        console.log("Erro ao tentar ler o arquivo excel. Erro: "+erro);
      }
  
      if(dadosERP!=null && dadosFabricante!=null && desconto != null && substituicaoTributaria != null && fator != null && acrescimo != null){
        let colunaRelacionamentoFabricante = "Cód do fabricante";
        let colunaRelacionamentoERP = nomesColunasERP.codFornecedor;
  
        if(relacionarPelaDescricao == true){
          colunaRelacionamentoFabricante = "Descrição";
          colunaRelacionamentoERP = nomesColunasERP.descricaoComplementar;
        }
  
        //Inativa todos os produtos da tabela do ERP, para que depois deixe ativos apenas os que estiverem na tabela do fabricante (se essa opção tiver sido marcada) e
        //Altera o fabricante de todos os itens da tabela do ERP, até dos que ficarão inativados por não estarem na tabela do fabricante
          setStatusCarregando("Adicionando nome do fabricante aos produtos...");
          for(let i = 0; i < dadosERP.length; i++){
            dadosERP[i][nomesColunasERP.fornecedor] = nomeFabricanteERP;
            
            if(inativarProdutos == true){
              dadosERP[i][nomesColunasERP.situacao] = "Inativo";
            }
          }
  
        setStatusCarregando("Relacionando tabelas...");
        //Faz o relacionamento das tabelas
        for(let x = 0; x < dadosFabricante.length; x++){
          let itemEncontrado:boolean = false;

          if(dadosFabricante[x]["%IPI"] == undefined){
            dadosFabricante[x]["%IPI"] = 0;
          }

          if(dadosFabricante[x]["%ST"] == undefined){
            dadosFabricante[x]["%ST"] = substituicaoTributaria;
          }

          let precoCustoNovo = (((dadosFabricante[x]["Preço de tabela"] * (1 - (desconto/100)))*(1 + (dadosFabricante[x]["%ST"]/100)))*(1 + (dadosFabricante[x]["%IPI"]/100)));
          let precoVendaNovo = (precoCustoNovo * fator)*(1 + (acrescimo/100));
          let cloneObjERP;
  
          // console.log("\n\nLINHA "+(0+x)+"/"+dadosFabricante.length);
          // console.log("Preço de tabela = "+dadosFabricante[x]["Preço de tabela"]);
          // console.log("Preço de custo = R$"+precoCustoNovo+" | Preço de venda = R$"+precoVendaNovo);
          if(typeof dadosFabricante[x][colunaRelacionamentoFabricante] === 'string'){
            dadosFabricante[x][colunaRelacionamentoFabricante] = dadosFabricante[x][colunaRelacionamentoFabricante].trim();  //Retira espaços extras que podem estar presentes no código
          }
  
          //Se for permitido código ou descrição repetida ou se o código ou descrição ainda não tiver sido acessado, busque ele na tabela do ERP
          if(permitirCodigosRepetidos == true || itensJaRelacionados.indexOf(dadosFabricante[x][colunaRelacionamentoFabricante]) === -1){
            for(let y = 0; y < dadosERP.length; y++){
              if(typeof dadosERP[y][colunaRelacionamentoERP] === 'string'){
                dadosERP[y][colunaRelacionamentoERP] = dadosERP[y][colunaRelacionamentoERP].trim(); //Retira espaços que o código exportado do bling contém.
              }
  
              //Se encontrar o código ou descrição da tabela do Fabricante na tabela do Tiny, então atualizar os dados:
              if(dadosERP[y][colunaRelacionamentoERP] == dadosFabricante[x][colunaRelacionamentoFabricante]){
                dadosERP[y] = atualizarDados('Atualizacao', dadosERP[y], dadosFabricante[x]["Preço de tabela"], precoVendaNovo, precoCustoNovo, dadosFabricante[x]["Descrição"], dadosFabricante[x]["Unidade"], dadosFabricante[x]["Unidade por caixa"], nomeFabricanteERP, dadosFabricante[x]["Classificação fiscal"], dadosFabricante[x]["CEST"], dadosFabricante[x]["Peso bruto (Kg)"], dadosFabricante[x]["Comprimento embalagem"], dadosFabricante[x]["Largura embalagem"], dadosFabricante[x]["Altura embalagem"], dadosFabricante[x]["GTIN/EAN"], dadosFabricante[x]["Origem"]);
                itemEncontrado = true;
                break;
              }else if (y === (dadosERP.length-1)){ //Se chegou na última posição e não foi encontrado o dado na tabela do ERP
                cloneObjERP = JSON.parse(JSON.stringify(dadosERP[y]));  //Clona o obj (https://stackoverflow.com/questions/10932584/array-push-makes-all-elements-the-same-when-pushing-an-object) com a estrutura do ERP, para que ao criar a tabela com os novos dados, ela siga a mesma estrutura (atributos e ordem das colunas)
              }
            }
    
            //Salvar produto em outro array, para que posteriormente seja gerada uma tabela com os produtos novos
            if(itemEncontrado == false){
              cloneObjERP[nomesColunasERP.id] = '';
              cloneObjERP[nomesColunasERP.codigo] = '';
              cloneObjERP[nomesColunasERP.descricao] = '';
              cloneObjERP[nomesColunasERP.descricaoComplementar] = '';
              cloneObjERP[nomesColunasERP.unidade] = 'UN';
              cloneObjERP[nomesColunasERP.classificacaoFiscal] = '';
              cloneObjERP[nomesColunasERP.codFornecedor] = dadosFabricante[x]["Cód do fabricante"];
              cloneObjERP[nomesColunasERP.origem] = '0';
              cloneObjERP[nomesColunasERP.estoque] = 0;
              cloneObjERP[nomesColunasERP.pesoLiquido] = 0;
              cloneObjERP[nomesColunasERP.pesoBruto] = 0;
              cloneObjERP[nomesColunasERP.cest] = '';
              cloneObjERP[nomesColunasERP.comprimentoProduto] = 0;
              cloneObjERP[nomesColunasERP.larguraProduto] = 0;
              cloneObjERP[nomesColunasERP.alturaProduto] = 0;
              cloneObjERP[nomesColunasERP.gtinEAN] = '';
              cloneObjERP[nomesColunasERP.unidadePorCaixa] = 0;
              
              novosProdutos.push(atualizarDados('Novo', cloneObjERP, dadosFabricante[x]["Preço de tabela"], precoVendaNovo, precoCustoNovo, dadosFabricante[x]["Descrição"], dadosFabricante[x]["Unidade"], dadosFabricante[x]["Unidade por caixa"], nomeFabricanteERP, dadosFabricante[x]["Classificação fiscal"], dadosFabricante[x]["CEST"], dadosFabricante[x]["Peso bruto (Kg)"], dadosFabricante[x]["Comprimento embalagem"], dadosFabricante[x]["Largura embalagem"], dadosFabricante[x]["Altura embalagem"], dadosFabricante[x]["GTIN/EAN"], dadosFabricante[x]["Origem"]));
            }
    
            itensJaRelacionados.push(dadosFabricante[x][colunaRelacionamentoFabricante]);
          }
        }
  
          setStatusCarregando("Gerando tabelas excel...");
          //Montar nova tabela com os dados relacionados
          if(dadosERP.length > 0){
            await criarExcel("Itens atualizados "+nomeFantasiaFabricante, dadosERP);
          }
          //Montar nova tabela com os novos dados
          if(novosProdutos.length > 0){
            await criarExcel("Novos itens "+nomeFantasiaFabricante, novosProdutos);
          }
      }
  
      setStatusCarregando("");
    }
  
    /**
     * Adiciona ao objeto que tem as colunas da planilha do ERP os dados da planilha do fabricante, de acordo com as opções configuradas (se deseja atualizar NCM, CEST, Dimensões, Unidade por caixa ou apenas os preços). Se for um novo produto, atualiza todos os dados que forem encontrados na tabela do fabricante.
     * @param atualizacaoOuNovo : 'Novo' se for um produto que não foi encontrado na planilha do ERP ou 'Atualizacao' se for um produto que já estava presente na planilha do ERP
     * @param cloneObjERP 
     * @param precoTabela
     * @param precoVenda 
     * @param precoCusto 
     * @param descricao 
     * @param unidade 
     * @param unidadePorCaixa 
     * @param fabricante 
     * @param classificacaoFiscal 
     * @param CEST
     * @param pesoBrutoKG 
     * @param comprimentoEmbalagem 
     * @param larguraEmbalagem 
     * @param alturaEmbalagem 
     * @param gtinEAN 
     * @param origem
     * @returns 
     */
    const atualizarDados = (atualizacaoOuNovo: string, cloneObjERP: any, precoTabela: number, precoVenda: number, precoCusto: number, descricao: string, unidade: string, unidadePorCaixa: number, fabricante: string, classificacaoFiscal: string, CEST: string, pesoBrutoKG: number, comprimentoEmbalagem: number, larguraEmbalagem: number, alturaEmbalagem: number, gtinEAN: string, origem: string) => {
      cloneObjERP[nomesColunasERP.precoVenda] = precoVenda;
      cloneObjERP[nomesColunasERP.precoCusto] = precoCusto;
      cloneObjERP[nomesColunasERP.fornecedor] = fabricante;
      cloneObjERP[nomesColunasERP.situacao] = "Ativo";
  
      if(descricao != undefined){
        descricao = descricao.trim(); //É retornada uma nova string sem espaços desnecessários.
  
        if(adicionarNomeFantasiaNaDescricao==true && nomeFantasiaFabricante != ''){
          //Adiciona o nome fantasia do fabricante à descrição do produto. Caso a descrição original tenha mais de 120 caracteres (máximo do Tiny), apaga dela o equivalente a quantidade de caracteres do nome fantasia, para que ele caiba na descrição.
          cloneObjERP[nomesColunasERP.descricao] = descricao.substr(0,(120-nomeFantasiaFabricante.length-5))+" [*"+nomeFantasiaFabricante+"*]";
        }else{
          cloneObjERP[nomesColunasERP.descricao] = descricao;
        }
        cloneObjERP[nomesColunasERP.descricaoComplementar] = descricao;
      }
  
      if(atualizarApenasPrecos === false){
        cloneObjERP[nomesColunasERP.unidade] = unidade;
        cloneObjERP[nomesColunasERP.unidadePorCaixa] = unidadePorCaixa;
  
        if(gtinEAN != undefined){
          cloneObjERP[nomesColunasERP.gtinEAN] = gtinEAN;
        }
  
        if(classificacaoFiscal != undefined && (atualizarNCMCest === true || atualizacaoOuNovo === 'Novo')){
          cloneObjERP[nomesColunasERP.classificacaoFiscal] = classificacaoFiscal;
          cloneObjERP[nomesColunasERP.cest] = CEST;
        }
  
        if(comprimentoEmbalagem != undefined && (atualizarDimensoes === true || atualizacaoOuNovo === 'Novo')){
          if(converterDimensoesParaCm === true){
            comprimentoEmbalagem = comprimentoEmbalagem*0.1;
            larguraEmbalagem = larguraEmbalagem*0.1;
            alturaEmbalagem = alturaEmbalagem*0.1;
          }
  
          cloneObjERP[nomesColunasERP.comprimentoProduto] = comprimentoEmbalagem;
          cloneObjERP[nomesColunasERP.larguraProduto] = larguraEmbalagem;
          cloneObjERP[nomesColunasERP.alturaProduto] = alturaEmbalagem;
        }
  
        if(pesoBrutoKG != undefined && (atualizarPeso === true || atualizacaoOuNovo === 'Novo')){
          cloneObjERP[nomesColunasERP.pesoBruto] = pesoBrutoKG;
        }
  
        if(origem != undefined){
          if(origem == '1'){ //Se importação direta (que é usada pelo importador (fornecedor))
            origem = '2'; //Alterar para adquirida no mercado interno
          }else if(origem == '6'){ //Se importação direta
            origem = '7'; //Alterar para adquirida no mercado interno
          }
  
          cloneObjERP[nomesColunasERP.origem] = origem;
        }
  
        //Se não tiver sido informado a unidade na tabela do fabricante, mas a opção atualizar unidade por caixa estiver ativa
        if(atualizarUnidadePorCaixa === true || atualizacaoOuNovo === 'Novo'){
          let unidadeAux = cloneObjERP[nomesColunasERP.unidade];
          if(unidade == '' && (unidadeAux == 'ML' || unidadeAux == 'M2' || unidadeAux == 'm²' || unidadeAux == "M²" || unidadeAux == "M" || unidadeAux == "m"))  
            cloneObjERP[nomesColunasERP.unidadePorCaixa] = parseFloat('0,001');
          else if (unidadeAux == '')
            cloneObjERP[nomesColunasERP.unidadePorCaixa] = 1;
        }
  
        if(blingERP == true){
          cloneObjERP[nomesColunasERP.precoCompra] = precoTabela;
          cloneObjERP[nomesColunasERP.unidadeMedida] = "Centímetro";
        }
        
      }
  
      return cloneObjERP;
    }
  
    /**
     * Baixa o modelo em xlsx (excel) da tabela do fabricante
     */
    const baixarModeloTabelaFabricante = async () => {
      let tabelaFabricante: any[] = [{"Cód do fabricante": "", "Descrição": "", "Preço de tabela": "", "%IPI": "", "Unidade": "",
       "Unidade por caixa": "", "Classificação fiscal": "", "CEST": "", "Origem": "", "GTIN/EAN": "", "Peso bruto (Kg)": "", 
       "Comprimento embalagem": "", "Largura embalagem": "", "Altura embalagem": ""}];
  
      criarExcel("Modelo de tabela do fabricante - UtilitáriosBlingHoop", tabelaFabricante);
    }
  
    /**
     * Corrige as descrições que estão com [*Nome do fabricante*] na descrição complementar e deixa esse nome apenas na descrição original.
     */
    const corrigirDescricoes = async () => {
      let dadosERP:any[] = [];
  
      try{
        //O usuário pode enviar mais de uma tabela do ERP de uma vez só, esse loop juntará todas as tabelas em um só array
        for(let x=0; x<arquivosERP.length; x++){
          dadosERP = dadosERP.concat(await lerExcel(arquivosERP[x]));  //Junta o array recebido com que já está presente no array dadosERP.
  
          //Altera a descrição e descriçao complementar
          for(let y=0; y<dadosERP.length; y++){
            let auxSplit = dadosERP[y]["Descrição"].split("[",1);
            dadosERP[y]["Descrição complementar"] = auxSplit[0];
          }
  
          //Para que sejam juntadas 2 tabelas em 1
          if(x%2 === 0 || x === arquivosERP.length-1){
            criarExcel("Novas descricoes 0"+(x), dadosERP);
            dadosERP = [];
          }
        }
      }catch(erro){
        console.log("Erro ao tentar ler o arquivo exportado do ERP. Erro: "+erro);
      }
    }

    const teste = async () => {
  
    }

    return (
        <div id="tela-relaciona-tabelas">
            <Cabecalho titulo="Relacionamento de tabelas" />

            <div className="conteudo">
                <form>
                    <fieldset>
                        <legend>Identificação</legend>

                        <div className="input-group">
                            <label htmlFor="nome-fabricante-erp">Nome do fabricante no ERP</label>
                            <input id="nome-fabricante-erp" type="text" value={nomeFabricanteERP} onChange={(event) => setNomeFabricanteERP(event.target.value)} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="nome-fantasia-fabricante">Nome fantasia</label>
                            <input id="nome-fantasia-fabricante" type="text" value={nomeFantasiaFabricante} onChange={(event) => setNomeFantasiaFabricante(event.target.value.toUpperCase())} />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Variáveis para cálculo dos preços</legend>

                        <div className="input-group">
                            <label htmlFor="substituicao-tributaria">% Substituição tributária (ST)</label>
                            <input id="substituicao-tributaria" type="number" onChange={(event) => setSubstituicaoTributaria(parseFloat(event.target.value))} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="desconto">% Desconto</label>
                            <input id="desconto" type="number" onChange={(event) => setDesconto(parseFloat(event.target.value))} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="fator">Fator</label>
                            <input id="fator" type="number" min={1} onChange={(event) => setFator(parseFloat(event.target.value))} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="acrescimo">% Acréscimo</label>
                            <input id="acrescimo" type="number" onChange={(event) => setAcrescimo(parseFloat(event.target.value))} />
                        </div>
                    </fieldset>

                    <fieldset id="opcoes-atualizacao">
                        <legend>Opções para atualização</legend>

                        <div className="input-group-horizontal">
                            <input id="qual-erp" type="checkbox" checked={blingERP} onChange={(event) => {setBlingERP(!blingERP)}} />
                            <label htmlFor="qual-erp">Deixe marcado caso a saída seja para o Bling e desmarcado se for para o Tiny ERP</label>
                        </div>

                        <div className="input-group-horizontal">
                            <input id="relacionar-pela-descricao" type="checkbox" checked={relacionarPelaDescricao} onChange={(event) => {setRelacionarPelaDescricao(!relacionarPelaDescricao)}} />
                            <label htmlFor="relacionar-pela-descricao">Relacionar tabelas pela descrição complementar</label>
                        </div>

                        <div className="input-group-horizontal">
                            <input id="atualizar-apenas-precos" type="checkbox" checked={atualizarApenasPrecos} onChange={(event) => {onClickAtualizarApenasPrecos()}} />
                            <label htmlFor="atualizar-apenas-precos">Atualizar apenas os preços de tabela, de custo e de venda</label>
                        </div>

                        <div className="input-group-horizontal">
                            <input id="inativar-produtos" type="checkbox" checked={inativarProdutos} onChange={(event) => {setInativarProdutos(!inativarProdutos)}} />
                            <label htmlFor="inativar-produtos">Inativar produtos do ERP que não existem na tabela do fabricante</label>
                        </div>

                        {/* Atualmente essa função de códigos repetidos não está funcionando porque para funcionar precisa remover o item encontrado do vetor dadosERP. Mas no momento esse vetor é usado para criar os itens atualizados, por isso não tá podendo ser apenas removido. */}  
                        {/* <div className="input-group">
                            <input id="permitir-codigos-repetidos" type="checkbox" checked={permitirCodigosRepetidos} onChange={(event) => {setPermitirCodigosRepetidos(!permitirCodigosRepetidos)}} />
                            <label htmlFor="permitir-codigos-repetidos">Considerar os códigos repetidos da tabela do fabricante (eles também se repetirão na tabela do ERP)</label>
                        </div> */}

                        <div className="input-group-horizontal">
                            <input id="adicionar-nome-fantasia" type="checkbox" />
                            <label htmlFor="adicionar-nome-fantasia">Adicionar nome fantasia do fabricante na descrição do produto</label>
                        </div>

                        {atualizarApenasPrecos === false &&
                        <>
                            <div className="input-group-horizontal">
                                <input id="atualizar-ncm-cest" type="checkbox" checked={atualizarNCMCest} onChange={(event) => {setAtualizarNCMCEST(!atualizarNCMCest)}} />
                                <label htmlFor="atualizar-ncm-cest">Atualizar classificação fiscal (NCM) e CEST</label>
                            </div>

                            <div className="input-group-horizontal">
                                <input id="atualizar-medidas" type="checkbox" checked={atualizarDimensoes} onChange={(event) => {setAtualizarDimensoes(!atualizarDimensoes)}} />
                                <label htmlFor="atualizar-medidas">Atualizar comprimento, largura e altura</label>
                            </div>

                            <div className="input-group-horizontal">
                                <input id="converter-dimensoes-medidas" type="checkbox" checked={converterDimensoesParaCm} onChange={(event) => {setConverterDimensoesParaCm(!converterDimensoesParaCm)}} />
                                <label htmlFor="converter-dimensoes-medidas">Converter dimensões das medidas de milímetros para centímetros</label>
                            </div>

                            <div className="input-group-horizontal">
                                <input id="atualizar-peso" type="checkbox" checked={atualizarPeso} onChange={(event) => {setAtualizarPeso(!atualizarPeso)}} />
                                <label htmlFor="atualizar-peso">Atualizar peso</label>
                            </div>

                            <div className="input-group-horizontal">
                                <input id="atualizar-unidade-por-caixa" type="checkbox" checked={atualizarUnidadePorCaixa} onChange={(event) => {setAtualizarUnidadePorCaixa(!atualizarUnidadePorCaixa)}} />
                                <label htmlFor="atualizar-unidade-por-caixa">Atualizar unidade por caixa</label>
                            </div>
                        </>
                        }
                    </fieldset>

                    <fieldset>
                        <legend>Tabelas</legend>

                        <div className="input-group">
                            <label htmlFor="tabelas-erp">Tabela(s) exportada(s) do ERP (.xls, .xlsx)</label>
                            <input id="tabelas-erp" type="file" multiple accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => {setArquivosERP(event.target.files)}} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="tabela-fabricante">Tabela do fabricante (.xls, .xlsx)</label>
                            <input id="tabela-fabricante" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => {setArquivoFabricante(event.target.files)}} />
                        </div>
                    </fieldset>

                    <div id="botoes-opcoes">
                        <button type="button" onClick={() => relacionarTabelas()} disabled={(nomeFabricanteERP == '' || substituicaoTributaria == null || fator == null || fator < 1 || acrescimo == null || desconto == null || arquivosERP == null || arquivoFabricante == null || statusCarregando != "")}>Carregar</button>
                        <button type="button" onClick={() => baixarModeloTabelaFabricante()}>Baixar modelo da tabela do fabricante</button>
                    </div>
                </form>

                <Modal titulo="Ajuda" visivel={visualizarAjuda} aoPressionarFechar={() => setVisualizarAjuda(false)}>
                  <div id="modal-ajuda">
                      <p>Com essa ferramenta você pode atualizar os itens do ERP (Bling ou Tiny ERP) através do relacionamento das tabelas por código de fábrica ou descrição complementar.</p>
                      <p>Para isso, primeiro você exporta do ERP os produtos do fabricante no qual deseja atualizar.</p>
                      <p>Segundo, cria uma tabela com todos os produtos recebidos do fabricante seguindo o padrão pedido pela aplicação. No qual as colunas obrigatórias são: "Preço de tabela" e "Cód do fabricante" ou "Preço de tabela" e "Descrição". E as colunas opcionais são: "%IPI", "%ST", "Unidade", "Unidade por caixa", "Classificação fiscal", "CEST", "Origem", "GTIN/EAN", "Peso bruto (Kg)", "Comprimento embalagem", "Largura embalagem" e "Altura embalagem". A tabela padrão pode ser baixada no botão "Baixar tabela do fabricante" no final dessa página.</p>
                      <p>Obs.: O valor informado na coluna %IPI deve ser sem a %, por exemplo, 5% é apenas 5, e na origem é informado o número que a representa, que pode ser de 0 a 8. Normalmente é 0 para nacional e 2 para importado.</p>
                      <p>Terceiro, informe nos campos desse sistema o nome do fabricante cadastrado no ERP, os valores para o cálculo de preço (será considerado o %ST digitado no campo, caso a coluna não esteja presente na tabela), se necessário personalize a atualização com as opções disponíveis, adicione as tabelas exportadas do ERP e a do fabricante e aperte em carregar para que a aplicação gere para você uma tabela com os produtos atualizados e outra tabela com os novos produtos encontrados (se houver), para que possa importá-las no ERP.</p>
                      <p>Antes de importar, abra cada uma, confira se está ok e exclua a última coluna chamada "EMPTY_" (se houver). Se não desejar que o preço seja calculado, basta deixar o fator com o valor 1 e os demais campos com o valor 0. A fórmula usada para cálculo do preço de custo é: "((PrecoTabela*(1-%Desconto))*(1+%ST))*(1+%IPI)" e para o preço de venda é: "(PrecoCusto*Fator)*(1+%Adicao)".</p>

                      <button type="button" onClick={() => setVisualizarAjuda(false)}>Ok</button>
                  </div>
                </Modal>

                <BotaoFlutuante onClick={() => setVisualizarAjuda(!visualizarAjuda)} />
                <Loading textoStatus={statusCarregando} />
            </div>
        </div>
    );
}