import React, { useState } from 'react';
import Cabecalho from '../../components/cabecalho';
import Modal from '../../components/modal';
import Loading from '../../components/loading';

import iconeEditar from '../../assets/images/icones/editar.png';
import iconeApagar from '../../assets/images/icones/apagar.png';
import './styles.css';

export default function TelaRelatorioComissoes(){

    const [modalidadePagamento, setModalidadePagamento] = useState<string>("");
    const [tipoRelatorio, setTipoRelatorio] = useState<string>("");
    const [aliquotaArquiteto, setAliquotaArquiteto] = useState<number>(0);
    const [aliquotaVendedor, setAliquotaVendedor] = useState<number>(0);
    const [periodoComissoes, setPeriodoComissoes] = useState<number>(0);

    const [modalEdicaoVisivel, setModalEdicaoVisivel] = useState<boolean>(false);
    const [numeroVendaEdicao, setNumeroVendaEdicao] = useState<string>("00000");
    const [aliquotaVendaEspecifica, setAliquotaVendaEspecifica] = useState<number>(aliquotaVendedor);
    const [indexComissionado, setIndexComissionado] = useState<number>(0);
    const [indexComissao, setIndexComissao] = useState<number>(0);

    const [modalEnvioComissoes, setModalEnvioComissoes] = useState<boolean>(false);
    const [dataVencimentoConta, setDataVencimentoConta] = useState<string>("");

    const [comissionados, setComissionados] = useState<any[]>([]);

    const [statusCarregando, setStatusCarregando] = useState<string>("");
    const [teste, setTeste] = useState<boolean>(false);

    /**
     * Altera o tipo de relatório e zera a alíquota de vendedor caso o tipo de relatório for diferente de vendedores.
     * Para evitar que seja usado no cálculo uma alíquota por engano em um tipo de relatório que não é de vendedores.
     */
    const onChangeTipoRelatorio = (tipoRelatorio: string) => {
        if(tipoRelatorio == "arquitetos"){
            setAliquotaVendedor(0);
        }

        setTipoRelatorio(tipoRelatorio);
    }

    /** 
     * Permite editar a alíquota de comissão do comissionado
     */
    const abrirModalEditarComissao = (posicaoComissionadoArray: number, posicaoComissaoArray: number) => {
        setModalEdicaoVisivel(true);
        let comissao = comissionados[posicaoComissionadoArray].comissoes[posicaoComissaoArray];
        setNumeroVendaEdicao(comissao.numeroPedido);
        setAliquotaVendaEspecifica(comissao.aliquotaComissao);
        setIndexComissionado(posicaoComissionadoArray);
        setIndexComissao(posicaoComissaoArray);
    }

    /** 
     * Permite definir a data de vencimento no qual as contas a pagar ou a receber serão cadastradas no ERP
     */
    const abrirModalEnvioComissoes = () => {
        setDataVencimentoConta("");
        setModalEnvioComissoes(true);
    }

    /**
     * Envia as comissões para o contas a pagar ou contas a receber (dependendo do tipo de relatório) para o ERP Bling
     */
    const enviarComissoesERP = () => {
        console.log(dataVencimentoConta);
        // setModalEnvioComissoes(false);
        setStatusCarregando("Cadastrando contas no ERP...");
    }

    /**
     * Gera o relatório com as comissões calculadas
     */
    const gerarRelatorio = () => {
        if(modalidadePagamento === "" || tipoRelatorio === "" || periodoComissoes === 0 || aliquotaVendedor === 0){
            alert("Preencha os campos");
            return;
        }
        
        if(tipoRelatorio === "representados" || tipoRelatorio === "arquitetos"){
            alert("Tipo de relatório ainda não implementado. Falta agrupar por "+tipoRelatorio+".");
        }

        let comissoes = [];

        if(modalidadePagamento === "integral"){
            // vendasNaoTratadas: Essas vendas iriam vir do back-end quando solicitado as vendas de um determinado mês
            let vendasNaoTratadas = [
                {
                    numeroPedido: 10291,
                    vendedor: "Vendedor Um",
                    cliente: "Esse é o nome",
                    arquiteto: "Arquiteto tal",
                    representado: undefined,
                    formaPagamento: [
                        {nome: "Transferência", valor: 500, taxa: 0, data: "01/06/2021"},
                        {nome: "Cartão de crédito 2x", valor: 1000, taxa: 4.98, data: "01/06/2021"},
                        {nome: "Cartão de crédito 2x", valor: 1500, taxa: 4.98, data: "01/07/2021"},
                    ],
                    valorTotal: 3000,
                    frete: 200,
                    data: "01/06/2021"
                },
                {
                    numeroPedido: 10292,
                    vendedor: "Vendedor Dois",
                    cliente: "Esse é o nome",
                    arquiteto: "Arquiteto tal",
                    representado: "Castelatto",
                    formaPagamento: [
                        {nome: "Transferência", valor: 500, taxa: 0, data: "02/06/2021"},
                        {nome: "Cartão de crédito 2x", valor: 1000, taxa: 4.98, data: "02/06/2021"},
                        {nome: "Cartão de crédito 2x", valor: 1800, taxa: 4.98, data: "02/07/2021"},
                    ],
                    valorTotal: 3300,
                    frete: 200,
                    data: "02/06/2021"
                },
                {
                    numeroPedido: 10293,
                    vendedor: "Vendedor Tres",
                    cliente: "Esse é o nome",
                    arquiteto: "Arquiteto tal",
                    representado: "Castelatto",
                    formaPagamento: [
                        {nome: "Transferência", valor: 500, taxa: 0, data: "03/06/2021"},
                        {nome: "Cartão de crédito 2x", valor: 2300, taxa: 4.98, data: "03/06/2021"},
                        {nome: "Cartão de crédito 2x", valor: 3000, taxa: 4.98, data: "03/07/2021"},
                    ],
                    valorTotal: 5800,
                    frete: 200,
                    data: "03/06/2021"
                },
                {
                    numeroPedido: 10294,
                    vendedor: "Vendedor Um",
                    cliente: "Esse é o nome",
                    arquiteto: "Arquiteto tal",
                    representado: undefined,
                    formaPagamento: [
                        {nome: "Transferência", valor: 1000, taxa: 0, data: "04/06/2021"},
                        {nome: "Cartão de crédito 2x", valor: 1000, taxa: 4.98, data: "04/06/2021"},
                        {nome: "Cartão de crédito 2x", valor: 1000, taxa: 4.98, data: "04/07/2021"},
                    ],
                    valorTotal: 3000,
                    frete: 200,
                    data: "04/06/2021"
                },
                {
                    numeroPedido: 10295,
                    vendedor: "Vendedor Dois",
                    cliente: "Esse é o nome",
                    arquiteto: "Arquiteto tal",
                    representado: undefined,
                    formaPagamento: [
                        {nome: "Transferência", valor: 2200, taxa: 0, data: "05/06/2021"},
                        {nome: "Cartão de crédito 2x", valor: 3000, taxa: 4.98, data: "05/06/2021"},
                        {nome: "Cartão de crédito 2x", valor: 4000, taxa: 4.98, data: "05/07/2021"},
                    ],
                    valorTotal: 9200,
                    frete: 200,
                    data: "05/06/2021"
                },
            ]

            //Agrupando comissionados e adicionando novas variáveis às vendas
            let auxAgruparComissionado: string[] = [];
            for(let i = 0; i < vendasNaoTratadas.length; i++){
                let vendaNaoTratada = vendasNaoTratadas[i];

                let formaPagamento = "";
                vendaNaoTratada.formaPagamento.forEach((modoPagamento) => {
                    formaPagamento += modoPagamento.nome+"\n";
                })

                let valorTotalSemTaxas = 0;
                vendaNaoTratada.formaPagamento.forEach((formaPagamento) => {
                    valorTotalSemTaxas += formaPagamento.valor*(1 - formaPagamento.taxa/100);
                });

                //Adiciona as variáveis aliquotaComissao e comissaoVenda ao objeto venda
                let venda = {
                    aliquotaComissao: aliquotaVendedor,
                    comissao: ((valorTotalSemTaxas - vendaNaoTratada.frete)*(1 - aliquotaArquiteto/100))*(aliquotaVendedor/100),
                    vendedor: vendaNaoTratada.vendedor,
                    numeroPedido: vendaNaoTratada.numeroPedido,
                    cliente: vendaNaoTratada.cliente,
                    formaPagamento: formaPagamento,
                    data: vendaNaoTratada.data,
                    valor: vendaNaoTratada.valorTotal,
                    valorAntesComissao: ((valorTotalSemTaxas - vendaNaoTratada.frete)*(1 - aliquotaArquiteto/100)),
                    frete: vendaNaoTratada.frete,
                    representado: vendaNaoTratada.representado
                }

                //Tenta encontrar a posição em que está o vetor com os dados do comissionado (nesse caso o vendedor)
                let posicaoVendedorAgrupar = auxAgruparComissionado.findIndex((vendedor) => {
                    return vendedor == venda.vendedor;
                });
                
                if(posicaoVendedorAgrupar != -1){   //Se a posição tiver sido encontrada, adiciona a nova venda ao vetor de vendas
                    comissoes[posicaoVendedorAgrupar].totalComissoes = comissoes[posicaoVendedorAgrupar].totalComissoes + venda.comissao;
                    comissoes[posicaoVendedorAgrupar].totalGeral = comissoes[posicaoVendedorAgrupar].totalGeral + venda.valor;
                    comissoes[posicaoVendedorAgrupar].comissoes.push(venda);
                }else{  //Se não tiver sido encontrada a posição com o comissionado, então cria uma nova posição
                    auxAgruparComissionado.push(venda.vendedor);
                    comissoes.push({
                        modalidade: "integral",
                        comissionado: venda.vendedor,
                        comissoes: [venda],
                        totalComissoes: venda.comissao,
                        totalGeral: venda.valor   // total vendas
                    });
                }
            }

        }else if(modalidadePagamento === "parcial"){
            // parcelasNaoTratadas: Essas parcelas iriam vir do back-end quando solicitado as parcelas de um determinado mês
            let parcelasNaoTratadas = [
                {nome: "Transferência", valor: 500, taxa: 0, data: "01/06/2021", observacoes: "Parcela 01 de 03",
                 venda: { numeroPedido: 10291, vendedor: "Vendedor Um", cliente: "Esse é o nome", arquiteto: "Arquiteto tal", representado: undefined, valorTotal: 3000, frete: 200, data: "01/06/2021", parcelas: [{},{},{}]}},
                {nome: "Cartão de crédito 2x", valor: 1000, taxa: 4.98, data: "01/06/2021", observacoes: "Parcela 02 de 03",
                 venda: { numeroPedido: 10291, vendedor: "Vendedor Um", cliente: "Esse é o nome", arquiteto: "Arquiteto tal", representado: undefined, valorTotal: 3000, frete: 200, data: "01/06/2021", parcelas: [{},{},{}]}},
                
                {nome: "Transferência", valor: 500, taxa: 0, data: "02/06/2021", observacoes: "Parcela 01 de 03",
                 venda: { numeroPedido: 10292, vendedor: "Vendedor Dois", cliente: "Esse é nome", arquiteto: "Arquiteto tal", representado: "Castelatto", valorTotal: 3300, frete: 200, data: "02/06/2021", parcelas: [{},{},{}]}},
                {nome: "Cartão de crédito 2x", valor: 1000, taxa: 4.98, data: "02/06/2021", observacoes: "Parcela 02 de 03",
                 venda: { numeroPedido: 10292, vendedor: "Vendedor Dois", cliente: "Esse é nome", arquiteto: "Arquiteto tal", representado: "Castelatto", valorTotal: 3300, frete: 200, data: "02/06/2021", parcelas: [{},{},{}]}},
                
                {nome: "Transferência", valor: 500, taxa: 0, data: "03/06/2021", observacoes: "Parcela 01 de 03",
                 venda: { numeroPedido: 10293, vendedor: "Vendedor Tres", cliente: "Esse é o nome", arquiteto: "Arquiteto tal", representado: "Castelatto", valorTotal: 5800, frete: 200, data: "03/06/2021", parcelas: [{},{},{}]}},
                {nome: "Cartão de crédito 2x", valor: 2300, taxa: 4.98, data: "03/06/2021", observacoes: "Parcela 02 de 03",
                 venda: { numeroPedido: 10293, vendedor: "Vendedor Tres", cliente: "Esse é o nome", arquiteto: "Arquiteto tal", representado: "Castelatto", valorTotal: 5800, frete: 200, data: "03/06/2021", parcelas: [{},{},{}]}},
                
                {nome: "Transferência", valor: 1000, taxa: 0, data: "04/06/2021", observacoes: "Parcela 01 de 03",
                 venda: { numeroPedido: 10294, vendedor: "Vendedor Um", cliente: "Esse é o nome", arquiteto: "Arquiteto tal", representado: undefined, valorTotal: 3000, frete: 200, data: "04/06/2021", parcelas: [{},{},{}]}},
                {nome: "Cartão de crédito 2x", valor: 1000, taxa: 4.98, data: "04/06/2021", observacoes: "Parcela 02 de 03",
                 venda: { numeroPedido: 10294, vendedor: "Vendedor Um", cliente: "Esse é o nome", arquiteto: "Arquiteto tal", representado: undefined, valorTotal: 3000, frete: 200, data: "04/06/2021", parcelas: [{},{},{}]}},
                
                {nome: "Transferência", valor: 2200, taxa: 0, data: "05/06/2021", observacoes: "Parcela 01 de 03",
                 venda: { numeroPedido: 10295, vendedor: "Vendedor Dois", cliente: "Esse é o nome", arquiteto: "Arquiteto tal", representado: undefined, valorTotal: 9200, frete: 200, data: "05/06/2021", parcelas: [{},{},{}] }},
                {nome: "Cartão de crédito 2x", valor: 3000, taxa: 4.98, data: "05/06/2021", observacoes: "Parcela 02 de 03",
                 venda: { numeroPedido: 10295, vendedor: "Vendedor Dois", cliente: "Esse é o nome", arquiteto: "Arquiteto tal", representado: undefined, valorTotal: 9200, frete: 200, data: "05/06/2021", parcelas: [{},{},{}]}},
            ]

            //Agrupando comissionados e adicionando novas variáveis às parcelas
            let auxAgruparComissionado: string[] = [];
            for(let i = 0; i < parcelasNaoTratadas.length; i++){
                let parcelaNaoTratada = parcelasNaoTratadas[i];

                //Adiciona as variáveis aliquotaComissao e comissaoVenda ao objeto parcela
                let parcela = {
                    aliquotaComissao: aliquotaVendedor,
                    comissao: (((parcelaNaoTratada.valor*(1 - parcelaNaoTratada.taxa/100))-(parcelaNaoTratada.venda.frete/parcelaNaoTratada.venda.parcelas.length))*(1 - aliquotaArquiteto/100))*(aliquotaVendedor/100),    // Subtrai o frete de maneira igual para todas as parcelas
                    vendedor: parcelaNaoTratada.venda.vendedor,
                    numeroPedido: parcelaNaoTratada.venda.numeroPedido,
                    cliente: parcelaNaoTratada.venda.cliente,
                    formaPagamento: parcelaNaoTratada.nome,
                    data: parcelaNaoTratada.data,
                    valor: parcelaNaoTratada.valor,
                    valorAntesComissao: ((parcelaNaoTratada.valor*(1 - parcelaNaoTratada.taxa/100))-(parcelaNaoTratada.venda.frete/parcelaNaoTratada.venda.parcelas.length))*(1 - aliquotaArquiteto/100),
                    frete: parcelaNaoTratada.venda.frete,
                    representado: parcelaNaoTratada.venda.representado
                }

                //Tenta encontrar a posição em que está o vetor com os dados do comissionado (nesse caso o vendedor)
                let posicaoVendedorAgrupar = auxAgruparComissionado.findIndex((vendedor) => {
                    return vendedor == parcela.vendedor;
                });
                
                if(posicaoVendedorAgrupar != -1){   //Se a posição tiver sido encontrada, adiciona a nova parcela ao vetor de parcelas
                    comissoes[posicaoVendedorAgrupar].totalComissoes = comissoes[posicaoVendedorAgrupar].totalComissoes + parcela.comissao;
                    comissoes[posicaoVendedorAgrupar].totalGeral = comissoes[posicaoVendedorAgrupar].totalGeral + parcela.valor;
                    comissoes[posicaoVendedorAgrupar].comissoes.push(parcela);
                }else{  //Se não tiver sido encontrada a posição com o comissionado, então faz o cadastro dele e adiciona a parcela em questão
                    auxAgruparComissionado.push(parcela.vendedor);
                    comissoes.push({
                        modalidade: "parcial",
                        comissionado: parcela.vendedor,
                        comissoes: [parcela],
                        totalComissoes: parcela.comissao,
                        totalGeral: parcela.valor    // total parcelas
                    });
                }
            }
        }

        // FALTA SOMAR TODAS AS COMISSÕES E TODOS OS VALORES TOTAIS, PRA POR NO FINAL DO RELATÓRIO.

        console.log(comissoes);
        setComissionados(comissoes);
    }

    /**
     * Edita a alíquota para a venda em específico
     */
    const editarAliquota = () => {
        let listaComissionados = comissionados;
        let comissao = listaComissionados[indexComissionado].comissoes[indexComissao];
        comissao.aliquotaComissao = aliquotaVendaEspecifica;
        comissao.comissao = comissao.valorAntesComissao*(aliquotaVendaEspecifica/100);
        listaComissionados[indexComissionado].comissoes[indexComissao] = comissao;
        setComissionados(listaComissionados);
        setModalEdicaoVisivel(false);
    }

    /**
     * Recebe o número de um mês e retorna a string
     * @param numeroMes 
     */
    const numeroParaMes = (numeroMes: number) => {
        let mes = "";

        if(numeroMes === 1){
            mes = "Janeiro";
        }else if(numeroMes === 2){
            mes = "Fevereiro";
        }else if(numeroMes === 3){
            mes = "Março";
        }else if(numeroMes === 4){
            mes = "Abril";
        }else if(numeroMes === 5){
            mes = "Maio";
        }else if(numeroMes === 6){
            mes = "Junho";
        }else if(numeroMes === 7){
            mes = "Julho";
        }else if(numeroMes === 8){
            mes = "Agosto";
        }else if(numeroMes === 9){
            mes = "Setembro";
        }else if(numeroMes === 10){
            mes = "Outubro";
        }else if(numeroMes === 11){
            mes = "Novembro";
        }else{
            mes = "Dezembro";
        }

        return mes;
    }

    return (
        <div id="tela-relatorio-comissoes">
            <Cabecalho titulo="Relatório de comissões Hoop" />

            <div className="conteudo">
                <form>
                    <div className="lado-a-lado">
                        <div className="input-group">
                            <label htmlFor="modalidade-pagamento">Modalidade do pagamento</label>
                            <select id="modalidade-pagamento" value={modalidadePagamento} onChange={(event) => setModalidadePagamento(event.target.value)}>
                                <option value="" disabled>Selecione</option>
                                <option value="integral">Liberação integral</option>
                                <option value="parcial">Liberação parcial</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="tipo-relatorio">Tipo de relatório</label>
                            <select id="tipo-relatorio" value={tipoRelatorio} onChange={(event) => onChangeTipoRelatorio(event.target.value)}>
                                <option value="" disabled>Selecione</option>
                                <option value="vendedores">Vendedores</option>
                                <option value="arquitetos">Arquitetos</option>
                                <option value="representados">Representados</option>
                            </select>
                        </div>
                    </div>

                    <div className="lado-a-lado">
{/* https://stackoverflow.com/questions/13571700/get-first-and-last-date-of-current-month-with-javascript-or-jquery */}
                        <div className="input-group">
                            {modalidadePagamento == "parcial" 
                                ? <label htmlFor="mes-comissoes">Parcelas do mês</label>
                                : <label htmlFor="mes-comissoes">Vendas do mês</label>
                            }
                            
                            <select id="mes-comissoes" disabled={modalidadePagamento == ""} onChange={(event) => setPeriodoComissoes(parseInt(event.target.value))} defaultValue={periodoComissoes}>
                                <option value={0} disabled>Selecione</option>
                                <option value={1}>Janeiro</option>
                                <option value={2}>Fevereiro</option>
                                <option value={3}>Março</option>
                                <option value={4}>Abril</option>
                                <option value={5}>Maio</option>
                                <option value={6}>Junho</option>
                                <option value={7}>Julho</option>
                                <option value={8}>Agosto</option>
                                <option value={9}>Setembro</option>
                                <option value={10}>Outubro</option>
                                <option value={11}>Novembro</option>
                                <option value={12}>Dezembro</option>
                            </select>
                        </div>
                        
                        {tipoRelatorio != "representados" &&
                            <div className="input-group">
                                <label htmlFor="aliquota-arquiteto">Alíquota do arquiteto (%)</label>
                                <input id="aliquota-arquiteto" disabled={tipoRelatorio != "arquitetos" && tipoRelatorio != "vendedores"} type="number" value={aliquotaArquiteto} onChange={(event) => setAliquotaArquiteto(parseInt(event.target.value))} />
                            </div>
                        }

                        
                        {(tipoRelatorio == "" || tipoRelatorio == "vendedores") &&
                            <div className="input-group">
                                <label htmlFor="aliquota-vendedor">Alíquota do vendedor (%)</label>
                                <input id="aliquota-vendedor" disabled={tipoRelatorio != "vendedores"} type="number" value={aliquotaVendedor} onChange={(event) => setAliquotaVendedor(parseInt(event.target.value))}  />
                            </div>
                        }

                    </div>

                    <div id="botoes-opcoes">
                        <button type="button" onClick={() => gerarRelatorio()}>Gerar relatório</button>
                        <button type="button">Imprimir relatório</button>
                        <button type="button" onClick={() => abrirModalEnvioComissoes()}>Enviar comissões para o ERP</button>
                    </div>
                </form>
                
                {comissionados.length !== 0 && 
                    <div id="relatorio">
                        <header>
                            <h2>S W GOMES DE BARROS COSTA EIRELI | RELATÓRIO DE COMISSÕES COM LIBERAÇÃO {modalidadePagamento.toUpperCase()} - VENDAS REALIZADAS</h2>
                            <h3>Referente às vendas do mês de {numeroParaMes(periodoComissoes)}</h3>
                            <h3>Relatório gerado em {new Date().toLocaleDateString()}</h3>
                        </header>

                        <header>
                            <h2>Vendas de {numeroParaMes(periodoComissoes)}</h2>
                            <h4>Alíquota arquiteto: {aliquotaArquiteto}%</h4>
                            <h4>Alíquota vendedor: {aliquotaVendedor}%</h4>
                        </header>

                        {comissionados.map((comissionado, indexComissionado) => {
                            return(
                                <div key={indexComissionado}>
                                    <header>
                                        <h3>Vendas de {comissionado.comissionado}</h3>
                                    </header>
        
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nº Pedido</th>
                                                <th>Data</th>
                                                <th>Cliente</th>
                                                <th>Valor</th>
                                                <th>Comissão</th>
                                                <th>Modo</th>
                                                <th>Representado</th>
                                                <th>Opções</th>
                                            </tr>
                                        </thead>
        
                                        <tbody>
                                            {comissionado.comissoes.map((comissao: any, indexComissao: number) => {
                                                return(
                                                    <tr key={indexComissao}>
                                                        <td>{(comissao.numeroPedido)}</td>
                                                        <td>{(comissao.data)}</td>
                                                        <td>{(comissao.cliente)}</td>
                                                        <td>R$: {(comissao.valor.toFixed(2))}</td>
                                                        <td>R$: {comissao.comissao.toFixed(2)}</td>
                                                        <td>{(comissao.formaPagamento)}</td>
                                                        <td>{(comissao.representado || "Não informado")}</td>
                                                        <td>
                                                            <button type="button" onClick={() => abrirModalEditarComissao(indexComissionado, indexComissao)}><img src={iconeEditar} alt="Editar" /></button>
                                                            <button type="button"><img src={iconeApagar} alt="Apagar" /></button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
        
                                    <footer>
                                        <h3>Total de comissões:</h3>
                                        <h3>R$: {comissionado.totalComissoes.toFixed(2)}</h3>
                                    </footer>
        
                                    <footer>
                                        <h3>Total de vendas:</h3>
                                        <h3>R$: {comissionado.totalGeral.toFixed(2)}</h3>
                                    </footer>
                                </div>
                            );
                        })}

                        
                        <div id="footer-geral">
                            <footer>
                                <h3>Total de todas comissões:</h3>
                                <h3>R$: 11,40</h3>
                            </footer>

                            <footer>
                                <h3>Total de todas vendas:</h3>
                                <h3>R$: 9,50</h3>
                            </footer>
                        </div>
                    </div>
                }
            </div>

            <Modal titulo="Editar comissão" visivel={modalEdicaoVisivel} aoPressionarFechar={() => setModalEdicaoVisivel(false)}>
                <div id="modal-edicao-comissao">
                    <p>Digite a alíquota de comissão para o pedido de número {numeroVendaEdicao}</p>

                    <form>
                        <div className="input-group">
                            <label htmlFor="aliquotaVendaEspecifica">Alíquota de comissão</label>
                            <input id="aliquotaVendaEspecifica" type="number" value={aliquotaVendaEspecifica} onChange={(event) => setAliquotaVendaEspecifica(parseFloat(event.target.value))} />
                        </div>

                        <button type="button" onClick={() => editarAliquota()}>Atualizar comissão</button>
                        <button type="button" onClick={() => setModalEdicaoVisivel(false)}>Cancelar</button>
                    </form>
                </div>
            </Modal>

            <Modal titulo="Envio das comissões" visivel={modalEnvioComissoes} aoPressionarFechar={() => setModalEnvioComissoes(false)}>
                <div id="modal-envio-comissoes">
                    <p>O total de comissões de cada comissionado será enviado para as finanças do Bling, da mesma maneira em que está apresentado no relatório. Digite abaixo a data de vencimento na qual deseja que as contas sejam cadastradas.</p>

                    <form>
                        <div className="input-group">
                            <label htmlFor="data-vencimento">Data de vencimento</label>
                            <input id="data-vencimento" type="date" value={dataVencimentoConta} onChange={(event) => setDataVencimentoConta(event.target.value)} />
                        </div>

                        <button type="button" onClick={() => enviarComissoesERP()}>Enviar comissões</button>
                        <button type="button" onClick={() => setModalEdicaoVisivel(false)}>Cancelar</button>
                    </form>
                </div>
            </Modal>

            <Loading textoStatus={statusCarregando} />
        </div>
    );
}