import Axios from 'axios';

interface Produto{
    teste: number
}

export default class HoopProvider {

    protected api = Axios.create({
        baseURL: 'https://dev.hoopdecor.com/api/',
    })

    /**
     * Retorna uma promise em que se tiver conseguido encontrar o pedido por meio do número informado, retorna um objeto com os dados, caso contrário, não retorna nada.
     */
    public async getDadosOrcamento(urlOrcamento: string){
        return Axios.get(urlOrcamento).then((resposta) => {
            let htmlOrcamento = resposta.data;
            let inicioDadosOrcamento = htmlOrcamento.split('window.printdata = {')[1];
            let jsonDadosOrcamento = "{"+inicioDadosOrcamento.split('};')[0]+"}";
            let objDadosOrcamento = JSON.parse(jsonDadosOrcamento);
            return objDadosOrcamento;
        }).catch((erro) => {
            console.error("Erro ao tentar pegar o HTML do orçamento: "+erro);
            return null;
        });
    }

    /**
     * 
     */
    public async getDadosRelatorio(urlOrcamento: string){
        return Axios.get(urlOrcamento).then((resposta) => {
            let htmlOrcamento = resposta.data;
            let inicioDadosOrcamento = htmlOrcamento.split('window.printdata = {')[1];
            let jsonDadosOrcamento = "{"+inicioDadosOrcamento.split('};')[0]+"}";
            let objDadosOrcamento = JSON.parse(jsonDadosOrcamento);
            return objDadosOrcamento;
        }).catch((erro) => {
            console.error("Erro ao tentar pegar o HTML do relatório: "+erro);
            return null;
        });
    }
}