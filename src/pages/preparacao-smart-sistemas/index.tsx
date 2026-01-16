import React, { useState, useEffect } from 'react';
import { criarExcel, lerExcel } from '../../utils/excel';
import { classificarSubgrupo } from '../../utils/subgrupo';

import Cabecalho from '../../components/cabecalho';
import BotaoFlutuante from '../../components/botao-flutuante';
import Loading from '../../components/loading';

import Modal from '../../components/modal';
import './styles.css';

/**
 * Inicia com os dados do Bling
 * Obs.: Falta desenvolver: Aplicar padrão de projeto
 */
 class NomesColunasERP {
    constructor(public grupo: string = "GRUPO", public marca: string = "MARCA", public codigoInterno: string = "CÓDIGO INTERNO", public codigoFabricante: string = "CÓDIGO FÁBRICA", 
      public descricaoComercial: string = "DESCRIÇÃO COMERCIAL", public descricaoCompleta: string = "DESCRIÇÃO COMPLETA", public subgrupo: string = "SUBGRUPO", 
      public precoFabrica: string = "PREÇO DE FÁBRICA", public desconto: string = "DESCONTO %", public fretePorcentagem: string = "FRETE %", public ipi: string = "IPI %", 
      public percentualST: string = "PERCENTUAL ST", public precoVenda: string = "PREÇO VENDA", public unidade: string = "UNIDADE", public unidadeCompra: string = "UNID FABRIL",
      public qtdEmbalagemVenda = "QTDE EMBALAGEM DE VENDA", public qtdEmbalagemCompra: string = "QTDE EMBALAGEM DE COMPRA", public pesoLiquido: string = "PESOLIQ",
      public pesoBruto: string = "PESOBRUTO", public classificacaoFiscal: string = "NCM", public codigoBarras: string = "CODIGOBARRAS",  public ufOrigem: string = "UF ORIGEM",
      public linha: string = "LINHA", public observacao: string = "OBSERVACAO", public aliqICMSOrigem: string = "ALIQICMSORIGEM", public aliqICMSInterna: string = "ALIQICMSINTERNA",
      public cst: string = "CST", public aliquotaCofinsCST = "ALIQUOTA COFINS CST", public aliquotaIPICST = "ALIQUOTA IPI CST", public aliquotaPISCST: string = "ALIQUOTA PIS CST",
      public cfopDentro: string = "CFOP DENTRO", public cfopFora: string = "CFOP FORA", public aliquotaCOFINS: string = "ALIQUOTA COFINS", public aliquotaPIS: string = "ALIQUOTA PIS",
      public freteValor: string = "FRETE R$", public modelo: string = "MODELO", public voltagem: string = "VOLTAGEM", public cor: string = "COR", public csosn: string = "CSOSN",
      public iva: string = "IVA", public valorPI: string = "VALOR PI",   public diferencaIMCS: string = "DIFERENÇA ICMS", public reducaoBaseICMS: string = "REDUÇÃO BASE ICMS",
      public reducaoBaseST: string = "REDUÇÃO BASE ST", public retencaoPIS: string = "RETENÇÃO PIS", public retencaoCofins: string = "RETENÇÃO COFINS",
      public retencaoCSLL: string = "RETENÇÃO CSLL", public retencaoIRRF: string = "RETENÇÃO IRRF", public retencaoPrevSocial: string = "RETENÇÃO PREV. SOCIAL",
      public localizacao: string = "LOCALIZAÇÃO", public enquadramentoIPI: string = "ENQUADRAMENTO IPI", public aliquotaPISOrigem: string = "ALIQUOTA PIS ORIGEM",
      public aliquotaCofinsOrigem: string = "ALIQUOTA COFINS ORIGEM", public imagem: string = "IMAGEM", public estoqueMinimo: string = "ESTOQUE MINIMO",
      public estoqueMaximo: string = "ESTOQUE MAXIMO", public aliquotaIBS: string = "ALIQUOTA IBS", public aliquotaCBS: string = "ALIQUOTA CBS",
      public classificacaoTributaria: string = "CLASSIFICACAO TRIBUTARIA", public codigoBeneficio: string = "CODIGO BENEFICIO"
    ) { }
}

export default function TelaPreparacaoSmartSistemas(){
    const [nomeMarcaERP, setNomeMarcaERP] = useState<string>('');
    const [grupoProduto, setGrupoProduto] = useState<string>('REVESTIMENTOS');
    const [modalidadeRepresentacao, setModalidadeRepresentacao] = useState<boolean>(false);
    const [percentualDescontoMultiplicado, setPercentualDescontoMultiplicado] = useState<boolean>(false); // Se false, o desconto será subtraído no valor e não multiplicado.
    
    const [calcularPrecoCustoPeloERP, setCalcularPrecoCustoPeloERP] = useState<boolean>(true);
    const [calcularPrecoVendaPeloERP, setCalcularPrecoVendaPeloERP] = useState<boolean>(false);

    const [qtdMaximaLinhasPorTabela, setQtdMaximaLinhasPorTabela] = useState<number>(2000);
    const [limitarLinhasSaida, setLimitarLinhasSaida] = useState<boolean>(false);
  
    const [nomesColunasERP, setNomesColunasERP] = useState<NomesColunasERP>(new NomesColunasERP());
    const [arquivoFabricante, setArquivoFabricante] = useState<any>();
  
    const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
    const [statusCarregando, setStatusCarregando] = useState<string>("");

    useEffect(() => {
    }, []);
  

    const prepararTabelaImportacao = async () => {
      setStatusCarregando("Lendo tabela excel...");
      let dadosFabricante: any[] = [];
  
      // Lê os dados da tabela do fabricante
      try{
        dadosFabricante = await lerExcel(arquivoFabricante[0]);
      }catch(erro){
        console.log("Erro ao tentar ler o arquivo excel. Erro: "+erro);
      }

      // Cria uma linha template, vazia, da tabela smart sistemas
      const nomesDasColunas = Object.values(nomesColunasERP);
      const linhaTemplateSmartSistemas: { [key: string]: string | number } = {};
      for (const nomeColuna of nomesDasColunas) {
        linhaTemplateSmartSistemas[nomeColuna] = ""; // Chave: "CÓDIGO INTERNO", Valor: ""
      }

      try{
        // Faz as validações
        if(dadosFabricante === null){
          throw new Error("Nenhuma tabela foi selecionada");
        }else if(dadosFabricante[0]["UF Origem"] === undefined || dadosFabricante[0]["Número de origem"] === undefined){
          console.log(dadosFabricante[0]["UF Origem"] +" - "+ dadosFabricante[0]["Número de origem"]);
          throw new Error("Você precisa definir o UF Origem e Número de origem.");
        }else if((dadosFabricante[0]["Preço de custo"] === undefined || calcularPrecoCustoPeloERP === true) && (dadosFabricante[0]["Preço de tabela"] === undefined || dadosFabricante[0]["%Desconto"] === undefined || dadosFabricante[0]["%IPI"] === undefined || dadosFabricante[0]["%ST"] === undefined)){
          throw new Error("Se você deseja calcular o preço de custo por aqui ou pelo ERP, você precisa preencher as colunas \"Preço de tabela\", \"%IPI\", \"%ST\", \"%Desconto\" e \"%Frete\", se houver.");
        }else if(dadosFabricante[0]["Preço de venda"] === undefined && calcularPrecoVendaPeloERP === false && ((dadosFabricante[0]["Fator"] === undefined || dadosFabricante[0]["%Acréscimo"] === undefined) && dadosFabricante[0]["%Markup"] === undefined)){
          throw new Error("Se você deseja calcular o preço de venda por aqui, com o ST, IPI, Fator e acréscimo, você precisa preencher as colunas \"%IPI\", \"%ST\", \"Fator\", \"%Acréscimo\", \"%Desconto\" e \"%Frete\", se houver. Ou ao invés de Fator e Acréscimo, você pode preencher a coluna \"%Markup\".");
        }

        // Prepara a tabela
        const novosDadosSmartSistemas = dadosFabricante.map((linhaFabricante: any) => {

          // Cria uma CÓPIA limpa do template para esta linha
          const novaLinhaPlanilha: { [key: string]: (string | number) } = { ...linhaTemplateSmartSistemas}

          novaLinhaPlanilha[nomesColunasERP.marca] = nomeMarcaERP;
          novaLinhaPlanilha[nomesColunasERP.codigoFabricante] = linhaFabricante["Cód do fabricante"];
          novaLinhaPlanilha[nomesColunasERP.descricaoCompleta] = linhaFabricante["Descrição"];
          novaLinhaPlanilha[nomesColunasERP.descricaoComercial] = linhaFabricante["Descrição"];
          novaLinhaPlanilha[nomesColunasERP.classificacaoFiscal] = linhaFabricante["Classificação fiscal"];
          novaLinhaPlanilha[nomesColunasERP.codigoBarras] = linhaFabricante["GTIN/EAN"];
          novaLinhaPlanilha[nomesColunasERP.unidade] = linhaFabricante["Unidade"];
          novaLinhaPlanilha[nomesColunasERP.unidadeCompra] = linhaFabricante["Unidade"];
          novaLinhaPlanilha[nomesColunasERP.qtdEmbalagemVenda] = linhaFabricante["Unidade por caixa"];
          novaLinhaPlanilha[nomesColunasERP.qtdEmbalagemCompra] = linhaFabricante["Unidade por caixa"];
          novaLinhaPlanilha[nomesColunasERP.pesoLiquido] = linhaFabricante["Peso bruto (Kg)"];
          novaLinhaPlanilha[nomesColunasERP.pesoBruto] = linhaFabricante["Peso bruto (Kg)"];
          novaLinhaPlanilha[nomesColunasERP.precoFabrica] = linhaFabricante["Preço de tabela"];
          novaLinhaPlanilha[nomesColunasERP.desconto] = linhaFabricante["%Desconto"] || 0;
          novaLinhaPlanilha[nomesColunasERP.ipi] = linhaFabricante["%IPI"];
          novaLinhaPlanilha[nomesColunasERP.percentualST] = linhaFabricante["%ST"];
          novaLinhaPlanilha[nomesColunasERP.fretePorcentagem] = linhaFabricante["%Frete"] || 0;
          novaLinhaPlanilha[nomesColunasERP.freteValor] = linhaFabricante["R$ Frete"] || 0;

          novaLinhaPlanilha[nomesColunasERP.ufOrigem] = linhaFabricante["UF Origem"];
          novaLinhaPlanilha[nomesColunasERP.aliqICMSOrigem] = linhaFabricante["ICMS Origem"] || 0;

          novaLinhaPlanilha[nomesColunasERP.grupo] = grupoProduto;
          novaLinhaPlanilha[nomesColunasERP.subgrupo] = classificarSubgrupo(linhaFabricante["Descrição"], grupoProduto);
          novaLinhaPlanilha[nomesColunasERP.linha] = (linhaFabricante["Linha"] !== undefined && linhaFabricante["Linha"] !== "") ? linhaFabricante["Linha"] : "GERAL";

          // Caso queira calcular o preço de custo pelo ERP
          if(calcularPrecoCustoPeloERP === false){
            novaLinhaPlanilha[nomesColunasERP.ipi] = 0;
            novaLinhaPlanilha[nomesColunasERP.percentualST] = 0;
            novaLinhaPlanilha[nomesColunasERP.fretePorcentagem] = 0;
          }

          // Se o preço de custo já estiver presente e quiser mantê-lo no cadastro
          let precoCusto = 0;
          if(linhaFabricante["Preço de custo"] !== undefined && calcularPrecoCustoPeloERP === false){
            precoCusto = parseFloat(linhaFabricante["Preço de custo"]);
            novaLinhaPlanilha[nomesColunasERP.precoFabrica] = precoCusto;
          }

          // Se o preço de venda já tiver vindo calculado e quiser mantê-lo no cadastro
          let precoVendaCalculado = false;
          if(linhaFabricante["Preço de venda"] !== undefined && calcularPrecoVendaPeloERP === false){
            novaLinhaPlanilha[nomesColunasERP.precoVenda] = parseFloat(linhaFabricante["Preço de venda"]);
            precoVendaCalculado = true;
          } 
            
          // Se precisar calcular o preço de custo
          if(precoCusto === 0 && (calcularPrecoCustoPeloERP === false || (precoVendaCalculado === false && calcularPrecoVendaPeloERP === false))){
            // Aplica o desconto
            let precoComDesconto = parseFloat(linhaFabricante["Preço de tabela"]) * (1 - (parseFloat(linhaFabricante["%Desconto"]))/100);
            if(percentualDescontoMultiplicado === true){
              precoComDesconto = linhaFabricante["Preço de tabela"] * (linhaFabricante["%Desconto"]/100);
            }

            // Aplica o frete
            let valorFrete = linhaFabricante["R$ Frete"] === undefined ? 0 : parseFloat(linhaFabricante["R$ Frete"]);

            if(linhaFabricante["%Frete"] !== undefined){
              valorFrete = (precoComDesconto * (parseFloat(linhaFabricante["%Frete"])/100));
            }

            // Calcula o preço de custo da maneira que o Smart Sistemas faz
            const precoComImpostos = precoComDesconto * (1 + (parseFloat(linhaFabricante["%IPI"])/100)) * (1 + (parseFloat(linhaFabricante["%ST"])/100));
            precoCusto = precoComImpostos + valorFrete; // Adiciona o frete, assim como o smart sistemas faz

            // Cálculo do preço de custo se o frete vier destacado na nota fiscal do vendedor (mais comum)
            // const fatorIPIMaisFrete = 1 + (parseFloat(linhaFabricante["%IPI"])/100) + (percentualFrete/100);
            // precoCusto = precoComDesconto * fatorIPIMaisFrete * (1 + (parseFloat(linhaFabricante["%ST"])/100));

            // Cáculo antigo do preço de custo BDesign
            // precoCusto = precoComDesconto * (1 + (percentualFrete/100)) * (1 + (parseFloat(linhaFabricante["%IPI"])/100)) * (1 + (parseFloat(linhaFabricante["%ST"])/100));

            // Só salva se não for calcular o preço de custo pelo ERP
            if(calcularPrecoCustoPeloERP === false){
              novaLinhaPlanilha[nomesColunasERP.precoFabrica] = precoCusto;
            }
          }

          // Se precisar calcular o preço de venda
          if(precoVendaCalculado === false && calcularPrecoVendaPeloERP === false){
            if(linhaFabricante["%Markup"] !== undefined){
              novaLinhaPlanilha[nomesColunasERP.precoVenda] = precoCusto * (1 + (parseFloat(linhaFabricante["%Markup"])/100));
            }else{
              novaLinhaPlanilha[nomesColunasERP.precoVenda] = precoCusto * parseFloat(linhaFabricante["Fator"]) * (1 + (parseFloat(linhaFabricante["%Acréscimo"])/100));
            }
          }

          // Preenche as variáveis de tributação da modalidade revenda
          if(modalidadeRepresentacao === false){
            // Valores constantes (padrão)
            // novaLinhaPlanilha[nomesColunasERP.aliqICMSInterna] = 20;
            novaLinhaPlanilha[nomesColunasERP.aliqICMSInterna] = 0;
            novaLinhaPlanilha[nomesColunasERP.aliquotaCofinsCST] = 1;
            novaLinhaPlanilha[nomesColunasERP.aliquotaIPICST] = 1;
            novaLinhaPlanilha[nomesColunasERP.aliquotaPISCST] = 1;
            novaLinhaPlanilha[nomesColunasERP.csosn] = "";
            novaLinhaPlanilha[nomesColunasERP.cfopDentro] = 5102;
            novaLinhaPlanilha[nomesColunasERP.cfopFora] = 6102;
            // novaLinhaPlanilha[nomesColunasERP.aliquotaCOFINS] = 3;
            // novaLinhaPlanilha[nomesColunasERP.aliquotaPIS] = 0.65;
            novaLinhaPlanilha[nomesColunasERP.aliquotaCOFINS] = 0;
            novaLinhaPlanilha[nomesColunasERP.aliquotaPIS] = 0;
            novaLinhaPlanilha[nomesColunasERP.enquadramentoIPI] = 999;

            // Valores variáveis
            const cst = linhaFabricante["Número de origem"].toString();
            // Adiciona "00" no final do CST quando não há ST (obs.: quando está 19%, é o mesmo que não ter ST, pois foi adicionado à pedido da empresa)
            novaLinhaPlanilha[nomesColunasERP.cst] = cst + ((linhaFabricante["%ST"] === 0 || linhaFabricante["%ST"] === 19) ? "00" : "60");
          }else{
            // Valores constantes (padrão)
            novaLinhaPlanilha[nomesColunasERP.aliqICMSInterna] = 0;
            novaLinhaPlanilha[nomesColunasERP.aliquotaCofinsCST] = 49; // Outras operações de saída
            novaLinhaPlanilha[nomesColunasERP.aliquotaIPICST] = 49;  // Outras operações de saída
            novaLinhaPlanilha[nomesColunasERP.aliquotaPISCST] = 53;  // Saída não-tributada
            novaLinhaPlanilha[nomesColunasERP.csosn] = "";
            novaLinhaPlanilha[nomesColunasERP.cfopDentro] = 5949;  // Outra saída de mercadoria... não especificada
            novaLinhaPlanilha[nomesColunasERP.cfopFora] = 6949;  // Outra saída de mercadoria... não especificada
            novaLinhaPlanilha[nomesColunasERP.aliquotaCOFINS] = 0;
            novaLinhaPlanilha[nomesColunasERP.aliquotaPIS] = 0;
            novaLinhaPlanilha[nomesColunasERP.enquadramentoIPI] = 999; // Outros
            
            // Valores variáveis
            novaLinhaPlanilha[nomesColunasERP.aliqICMSOrigem] = 0;
            novaLinhaPlanilha[nomesColunasERP.cst] = "041";
          }

          return novaLinhaPlanilha;
        });
          
        //Montar nova tabela com os novos dados
        if(novosDadosSmartSistemas.length > 0){
          const tituloTabela = `Atualização Smart Sistemas - ${nomeMarcaERP}`

          if(limitarLinhasSaida === true){
            // Exporta em múltiplos arquivos, limitado a cada "qtdMaximaLinhasPorTabela"
            let contador = 1;
            let dadosNovaTabela:any[] = [];
            for(let i = 0; i < novosDadosSmartSistemas.length; i++){
              contador++;
              dadosNovaTabela.push(novosDadosSmartSistemas[i]);
      
              if(contador == qtdMaximaLinhasPorTabela || (i+1) == novosDadosSmartSistemas.length){
                await criarExcel(tituloTabela+" "+(i+1), dadosNovaTabela);
                dadosNovaTabela = [];
                contador = 1;
              }
            }
          }else{
            await criarExcel(tituloTabela, novosDadosSmartSistemas);
          }
        }
      }catch(erro: any){
        alert(erro);
      }finally{
        setStatusCarregando("");
      }
    }
  
    /**
     * Baixa o modelo em xlsx (excel) da tabela do fabricante
     */
    const baixarModeloTabelaFabricante = async () => {
      let tabelaFabricante: any[] = [{"Cód do fabricante": "", "Descrição": "", "Preço de tabela": "", "Unidade": "",
       "%IPI": "", "%ST": "", "Fator": "", "%Desconto": "", "%Acréscimo": "", "Número de origem": "", "ICMS Origem": "", "UF Origem": "",
       "Unidade por caixa": "", "Classificação fiscal": "", "CEST": "",  "GTIN/EAN": "", "Peso bruto (Kg)": "", 
       "Comprimento embalagem": "", "Largura embalagem": "", "Altura embalagem": ""}];
  
      criarExcel("Modelo de tabela do fabricante - UtilitáriosBlingHoop", tabelaFabricante);
    }
  
    return (
        <div id="tela-relaciona-tabelas">
            <Cabecalho titulo="Preparação Smart Sistemas" />

            <div className="conteudo">
                <form>
                    <fieldset>
                        <legend>Identificação</legend>

                        <div className="input-group">
                            <label htmlFor="nome-marca-erp">Nome da marca no ERP</label>
                            <input id="nome-marca-erp" type="text" value={nomeMarcaERP} onChange={(event) => setNomeMarcaERP(event.target.value)} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="grupo-produto">Grupo do produto</label>
                            <select id="grupo-produto"  value={grupoProduto} onChange={(event) => setGrupoProduto(event.target.value)}>
                              <option value="REVESTIMENTOS">REVESTIMENTOS</option>
                              <option value="LOUÇAS E METAIS">LOUÇAS E METAIS</option>
                              <option value="ELETRODOMESTICOS">ELETRODOMESTICOS</option>
                            </select>
                        </div>
                    </fieldset>

                    <fieldset id="opcoes-atualizacao">
                        <legend>Opções para atualização</legend>

                        <div className="input-group-horizontal">
                            <input id="modalidade" type="checkbox" checked={modalidadeRepresentacao} onChange={(event) => {setModalidadeRepresentacao(!modalidadeRepresentacao)}} />
                            <label htmlFor="modalidade">Deixe marcado caso a saída seja para a representação</label>
                        </div>

                        <div className="input-group-horizontal">
                            <input id="calcular-preco-venda-pelo-erp" type="checkbox" checked={calcularPrecoVendaPeloERP} onChange={(event) => {setCalcularPrecoVendaPeloERP(!calcularPrecoVendaPeloERP)}} />
                            <label htmlFor="calcular-preco-venda-pelo-erp">Deixe marcado caso deseje que o cálculo do preço de venda seja feito pelo Smart Sistemas</label>
                        </div>

                        <div className="input-group-horizontal">
                            <input id="calcular-preco-custo-pelo-erp" type="checkbox" checked={calcularPrecoCustoPeloERP} onChange={(event) => {setCalcularPrecoCustoPeloERP(!calcularPrecoCustoPeloERP)}} />
                            <label htmlFor="calcular-custo-pelo-erp">Deixe marcado caso deseje que o cálculo do preço de custo seja feito pelo Smart Sistemas (Útil caso deseje que o IPI e o ST fique no cadastro do produto)</label>
                        </div>

                        <div className="input-group-horizontal">
                            <input id="porcentagem-desconto" type="checkbox" checked={percentualDescontoMultiplicado} onChange={(event) => {setPercentualDescontoMultiplicado(!percentualDescontoMultiplicado)}} />
                            <label htmlFor="porcentagem-desconto">Deixe marcado caso o percentual de desconto deva ser multiplicado ao invés de subtraído, no preço de tabela</label>
                        </div>
                        
                        <div className="input-group-horizontal">
                            <input id="limitar-linhas-saida" type="checkbox" checked={limitarLinhasSaida} onChange={(event) => {setLimitarLinhasSaida(!limitarLinhasSaida)}} />
                            <label htmlFor="limitar-linhas-saida">Limitar 2000 linhas por tabela</label>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Tabelas</legend>

                        <div className="input-group">
                            <label htmlFor="tabela-fabricante">Tabela do fabricante (.xls, .xlsx)</label>
                            <input id="tabela-fabricante" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => {setArquivoFabricante(event.target.files)}} />
                        </div>
                    </fieldset>

                    <div id="botoes-opcoes">
                        {/* <button type="button" onClick={() => prepararTabelaImportacao()} disabled={(nomeFabricanteERP == '' || substituicaoTributaria == null || fator == null || fator < 1 || acrescimo == null || desconto == null || arquivoFabricante == null || statusCarregando != "")}>Carregar</button> */}
                        <button type="button" onClick={() => prepararTabelaImportacao()}>Carregar</button>
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