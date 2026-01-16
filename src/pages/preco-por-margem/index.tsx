import React, { useState, useEffect } from 'react';
import { criarExcel, lerExcel } from '../../utils/excel';

import Cabecalho from '../../components/cabecalho';
import BotaoFlutuante from '../../components/botao-flutuante';
import Loading from '../../components/loading';
import Modal from '../../components/modal';

import './styles.css';

export default function TelaPrecoPorMargem(){
	// Preços e margens
	const [nomeFantasiaFabricante, setNomeFantasiaFabricante] = useState<string>("");

    // Demais taxas que envolvem o custo do item
    const [taxaSimples, setTaxaSimples] = useState<number>(9.50);
    const [taxaComissaoArquiteto, setTaxaComissaoArquiteto] = useState<number>(5.00);
    const [taxaComissaoVendedor, setTaxaComissaoVendedor] = useState<number>(5.08);
    const [taxaComissaoGerente1, setTaxaComissaoGerente1] = useState<number>(3.81);
    const [taxaComissaoGerente2, setTaxaComissaoGerente2] = useState<number>(1.00);
    const [taxaAbraco, setTaxaAbraco] = useState<number>(1);

    // Margem mínima aceita que o item pode alcançar
    const [margemMinimaAceita, setMargemMinimaAceita] = useState<number>(9);

    // Taxa para valor parcelado em 10x
    const [taxaParcelado, setTaxaParcelado] = useState<number>(9.340);

    // Arquivo enviado pelo usuário, com os itens para cálculo
    const [arquivoFabricante, setArquivoFabricante] = useState<any>();
  
    // Variáveis auxiliares
    const [visualizarAjuda, setVisualizarAjuda] = useState<boolean>(false);
    const [statusCarregando, setStatusCarregando] = useState<string>("");

    useEffect(() => {
    }, []);
  
	/**
	 * Calcula a margem de contribuição com base no preço à vista, custo e taxas aplicadas.
	 * Para calcular uma margem de contribuição, eu preciso pegar o preço à vista e ir calculando o valor para cada taxa 
	 * (simples, comissão arquiteto, comissão vendedor, comissão gerente 1, comissão gerente 2 e taxa abraço). Sendo que a taxa da 
	 * comissão vendedor, gerente 1, gerente 2 e taxa abraço, é sobre o preço à vista menos o valor da comissão do arquiteto. Depois
	 * eu somo todos os valores + o preço de custo e divido o preço de custo pelo preço à vista que eu encontrei. Chegando na margem de contribuição.
	 * @param precoAVista 
	 * @param precoCusto 
	 * @returns 
	 */
	const calcularMargemContribuicao = (precoAVista: number, precoCusto: number): number => {
		// Cálculo da taxa simples sobre o preço à vista
		const valorTaxaSimples = (taxaSimples / 100) * precoAVista;
	  
		// Cálculo da comissão do arquiteto sobre o preço à vista
		const valorComissaoArquiteto = (taxaComissaoArquiteto / 100) * precoAVista;
	  
		// Base para as demais comissões: preço à vista - comissão do arquiteto
		const baseComissoes = precoAVista - valorComissaoArquiteto;
	  
		// Cálculo das demais comissões
		const valorComissaoVendedor = (taxaComissaoVendedor / 100) * baseComissoes;
		const valorComissaoGerente1 = (taxaComissaoGerente1 / 100) * baseComissoes;
		const valorComissaoGerente2 = (taxaComissaoGerente2 / 100) * baseComissoes;
		const valorTaxaAbraco = (taxaAbraco / 100) * baseComissoes;
	  
		// Soma de todas as taxas
		const somaDasTaxas = valorTaxaSimples + valorComissaoArquiteto + valorComissaoVendedor + valorComissaoGerente1 + valorComissaoGerente2 + valorTaxaAbraco;
	  
		// Cálculo da margem de contribuição
		const margemContribuicao = ((precoAVista - (precoCusto + somaDasTaxas)) / precoAVista) * 100;
	  
		return parseFloat(margemContribuicao.toFixed(2)); // Retorna com duas casas decimais
	};
	  
	/**
	 * Ajusta o preço à vista para que a margem de contribuição atinja ou ultrapasse a margem mínima desejada.
 	 * Incrementa o preço até alcançar a margem especificada.
	 * @param precoCusto 
	 * @param precoAVista 
	 * @returns 
	 */
	const ajustarPrecoParaMargemMinima = (precoAVista: number, precoCusto: number): { precoAjustado: number; margemFinal: number } => {
		let precoAjustado = precoAVista;
		let margem = calcularMargemContribuicao(precoAjustado, precoCusto);
	  
		// Incrementa o preço até que a margem desejada seja atingida
		while (margem < margemMinimaAceita) {
		  precoAjustado += 0.01; // Ajuste fino para encontrar o preço mínimo necessário
		  margem = calcularMargemContribuicao(precoAjustado, precoCusto);
		}
	  
		return { precoAjustado: parseFloat(precoAjustado.toFixed(2)), margemFinal: margem };
	};

    /**
     * Função responsável por extrair os dados da tabela excel enviada, calcular o novo preço à vista e parcelado, com base no preço sugerido
	 * na tabela, de forma que a margem de contribuição não fique abaixo de 9%, caso fique, ele deve aumentar o valor do preço à vista. No fim,
	 * gera uma nova tabela excel com os novos preços.
     */
    const calcularPrecos = async () => {
      setStatusCarregando("Lendo tabela excel...");
      let dadosFabricante: any[] = [];
  
      try{
        dadosFabricante = await lerExcel(arquivoFabricante[0]);

		if(dadosFabricante[0]["Preço sugerido"] == undefined || dadosFabricante[0]["Preço de custo"] == undefined){
			throw "Nenhum preço sugerido ou preço de custo encontrado no arquivo excel.";
		}

      }catch(erro){
        alert("Erro ao tentar ler o arquivo excel. Erro: "+erro);
		setStatusCarregando("");
		return;
      }

      if(dadosFabricante!=null){
		// Percorre linha por linha e faz o cálculo do preço de cada item
		for(let i = 0; i < dadosFabricante.length; i++){
			setStatusCarregando("Calculando item...");

			// Remove espaços em branco da descrição
			dadosFabricante[i]["Descrição"] = dadosFabricante[i]["Descrição"].trim();

            // Calcula o preço de custo adicionando o ST
            dadosFabricante[i]["Preço de custo"] = dadosFabricante[i]["Preço de custo"] * (1 + ((dadosFabricante[i]["%ST"] || 0) / 100));

			// Calcula a margem de contribuição
			dadosFabricante[i]["Preço à vista"] = dadosFabricante[i]["Preço sugerido"];
			const margemContribuicao = calcularMargemContribuicao(dadosFabricante[i]["Preço à vista"], dadosFabricante[i]["Preço de custo"]);
			dadosFabricante[i]["Margem atingida"] = margemContribuicao;
			dadosFabricante[i]["Preço ajustado"] = "Não";

			// Ajusta o preço à vista para que a margem de contribuição atinja ou ultrapasse a margem mínima desejada
			if(margemContribuicao < margemMinimaAceita){
				setStatusCarregando("Ajustando preço...");
				const objNovoPreco = ajustarPrecoParaMargemMinima(dadosFabricante[i]["Preço à vista"], dadosFabricante[i]["Preço de custo"]);
				dadosFabricante[i]["Preço à vista"] = objNovoPreco.precoAjustado;
				dadosFabricante[i]["Margem atingida"] = objNovoPreco.margemFinal;
				dadosFabricante[i]["Preço ajustado"] = "Sim";
			}

			// Calcula o preço parcelado
			dadosFabricante[i]["Preço em 10x"] = dadosFabricante[i]["Preço à vista"] * (1 + (taxaParcelado / 100));
		}

        //Montar nova tabela com os dados calculados
        setStatusCarregando("Gerando tabelas excel...");
        await criarExcel("Preços por margem - "+nomeFantasiaFabricante, dadosFabricante);
      }
  
      setStatusCarregando("");
    }

    /**
     * Baixa o modelo em xlsx (excel) da tabela do fabricante
     */
    const baixarModeloTabelaFabricante = async () => {
      let tabelaFabricante: any[] = [{"Cód do fabricante": "", "Descrição": "", "Preço sugerido": "", "Preço de custo": "", "%IPI": "", "Unidade": "",
       "Unidade por caixa": "", "Classificação fiscal": "", "CEST": "", "Origem": "", "GTIN/EAN": "", "Peso bruto (Kg)": "", 
       "Comprimento embalagem": "", "Largura embalagem": "", "Altura embalagem": ""}];
  
      criarExcel("Modelo de tabela do fabricante - UtilitáriosBlingHoop", tabelaFabricante);
    }

	/**
	 * Confere se os dados estão válidos, para ativar ou desativar o botão carregar
	 * @returns true se os dados estiverem válidos e false se não estiverem.
	 */
	const validarCampos = () => {
		if(nomeFantasiaFabricante.length > 1 || taxaSimples >= 0 || taxaComissaoArquiteto >= 0 || taxaComissaoVendedor >= 0 || taxaComissaoGerente1 >= 0 || taxaComissaoGerente2 >= 0 || taxaAbraco >= 0 || margemMinimaAceita >= 0 || taxaParcelado >= 0){
			return true;			
		}else{
			return false;
		}
	}

    return (
        <div id="tela-relaciona-tabelas">
            <Cabecalho titulo="Cálculo de preço por margem" />

            <div className="conteudo">
                <form>
                    <fieldset>
                        <legend>Identificação</legend>

                        <div className="input-group">
                            <label htmlFor="nome-fantasia-fabricante">Nome fantasia</label>
                            <input id="nome-fantasia-fabricante" type="text" value={nomeFantasiaFabricante} onChange={(event) => setNomeFantasiaFabricante(event.target.value.toUpperCase())} />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Variáveis para cálculo dos preços</legend>

                        <div className="input-group">
                            <label htmlFor="taxa-simples">% Taxa do simples</label>
                            <input id="taxa-simples" type="number" value={taxaSimples} onChange={(event) => setTaxaSimples(parseFloat(event.target.value))} />
                        </div>

						<div className="input-group">
                            <label htmlFor="taxa-comissao-arquiteto">% Taxa comissão arquiteto</label>
                            <input id="taxa-comissao-arquiteto" type="number" value={taxaComissaoArquiteto} onChange={(event) => setTaxaComissaoArquiteto(parseFloat(event.target.value))} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="taxa-comissao-vendedor">% Taxa comissão vendedor</label>
                            <input id="taxa-comissao-vendedor" type="number" value={taxaComissaoVendedor} onChange={(event) => setTaxaComissaoVendedor(parseFloat(event.target.value))} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="taxa-comissao-gerente1">% Taxa comissão gerente 1</label>
                            <input id="taxa-comissao-gerente1" type="number" value={taxaComissaoGerente1} onChange={(event) => setTaxaComissaoGerente1(parseFloat(event.target.value))} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="taxa-comissao-gerente2">% Taxa comissão gerente 2</label>
                            <input id="taxa-comissao-gerente2" type="number" value={taxaComissaoGerente2} onChange={(event) => setTaxaComissaoGerente2(parseFloat(event.target.value))} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="taxa-abraco">% Taxa abraço</label>
                            <input id="taxa-abraco" type="number" value={taxaAbraco} onChange={(event) => setTaxaAbraco(parseFloat(event.target.value))} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="margem-minima-aceita">% Margem mínima aceita</label>
                            <input id="margem-minima-aceita" type="number" value={margemMinimaAceita} onChange={(event) => setMargemMinimaAceita(parseFloat(event.target.value))} />
                        </div>

                        <div className="input-group">
                            <label htmlFor="taxa-parcelado">% Taxa parcelado em 10x</label>
                            <input id="taxa-parcelado" type="number" value={taxaParcelado} onChange={(event) => setTaxaParcelado(parseFloat(event.target.value))} />
                        </div>
                    </fieldset>

                    <fieldset id="opcoes-atualizacao">
                        <legend>Opções para atualização</legend>

						<p>Nenhuma opção disponível no momento</p>

                        {/* <div className="input-group-horizontal">
                            <input id="qual-erp" type="checkbox" checked={blingERP} onChange={(event) => {setBlingERP(!blingERP)}} />
                            <label htmlFor="qual-erp">Deixe marcado caso a saída seja para o Bling e desmarcado se for para o Tiny ERP</label>
                        </div> */}
                    </fieldset>

                    <fieldset>
                        <legend>Tabelas</legend>

                        <div className="input-group">
                            <label htmlFor="tabela-fabricante">Tabela do fabricante (.xls, .xlsx)</label>
                            <input id="tabela-fabricante" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(event) => {setArquivoFabricante(event.target.files)}} />
                        </div>
                    </fieldset>
					
                    <div id="botoes-opcoes">
                        <button type="button" onClick={() => calcularPrecos()} disabled={!validarCampos()}>Carregar</button>
                        <button type="button" onClick={() => baixarModeloTabelaFabricante()}>Baixar modelo da tabela do fabricante</button>
                    </div>
                </form>

                <Modal titulo="Ajuda" visivel={visualizarAjuda} aoPressionarFechar={() => setVisualizarAjuda(false)}>
                  <div id="modal-ajuda">
					<p>Essa ferramenta é útil para o cálculo automático do preço à vista e parcelado, baseado na margem de contribuição. Caso não seja atingido a margem de contribuição, o sistema se encarrega de ajustar o valor até que esteja de acordo.</p>
					<p>Para isso, você precisa importar uma tabela que tenha as colunas "Preço sugerido" (preço à vista) e "Preço de custo", para que o sistema utilize os valores para o cálculo da margem de contribuição e faça os ajustes necessários.</p>
					<p>A ferramenta irá te retornar um excel com o preço à vista e preço parcelado calculado. Além de informar a margem de contribuição atingida e se houve ou não ajuste para alcançá-la.</p>
					<button type="button" onClick={() => setVisualizarAjuda(false)}>Ok</button>
                  </div>
                </Modal>

                <BotaoFlutuante onClick={() => setVisualizarAjuda(!visualizarAjuda)} />
                <Loading textoStatus={statusCarregando} />
            </div>
        </div>
    );
}