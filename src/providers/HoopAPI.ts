import Axios from 'axios';

interface Produto{
    teste: number
}

export default class HoopProvider {

    protected api = Axios.create({
        baseURL: (process.env.REACT_APP_PROXY_URL || "")+'https://dev.hoopdecor.com/api/',
    })

    /**
     * Retorna uma promise com um objeto com os dados do orçamento da respectiva URL. Caso tenha dado erro, retorna um erro que pode ser tratado com Try...Catch.
     */
    public async getDadosOrcamento(urlOrcamento: string){
        // // Como conferir a URL antes de enviar a requisição: https://stackoverflow.com/questions/50296744/check-axios-request-url-before-sending/50297192
        // this.api.interceptors.request.use(function (config) {
        //     // Do something before request is sent
        //     console.log(config)
        //     return config;
        //   }, function (error) {
        //     // Do something with request error
        //     return Promise.reject(error);
        //   });

        return Axios.get((process.env.REACT_APP_PROXY_URL || "")+urlOrcamento).then((resposta) => {
            let htmlOrcamento = resposta.data;
            let inicioDadosOrcamento = htmlOrcamento.split('window.printdata = {')[1];
            let jsonDadosOrcamento = "{"+inicioDadosOrcamento.split('};')[0]+"}";
            let objDadosOrcamento = JSON.parse(jsonDadosOrcamento);
            return objDadosOrcamento;
        }).catch((erro) => {
            console.error("Erro ao tentar pegar o HTML do orçamento: "+erro);
            throw erro.toString();
        });
    }

    /**
     * Retorna uma promise com um objeto com os dados do relatório da respectiva URL. Caso tenha dado erro, retorna o erro que pode ser tratado com Try...Catch.
     */
    public async getDadosRelatorio(urlRelatorio: string){
        return Axios.get((process.env.REACT_APP_PROXY_URL || "")+urlRelatorio).then((resposta) => {
            let htmlRelatorio = resposta.data;
            let inicioDadosRelatorio = htmlRelatorio.split('window.printdata = {')[1];
            let jsonDadosRelatorio = "{"+inicioDadosRelatorio.split('};')[0]+"}";
            let objDadosRelatorio = JSON.parse(jsonDadosRelatorio);
            return objDadosRelatorio;
        }).catch((erro) => {
            console.error("Erro ao tentar pegar o HTML do relatório: "+erro);
            throw erro.toString();
        });
    }

    /**
     * Retorna uma promise com um objeto com os dados da ordem de compra da respectiva URL. Caso tenha dado erro, retorna o erro que pode ser tratado com Try...Catch.
     */
     public async getDadosOrdemDeCompra(urlOrdemDeCompra: string){
        return Axios.get((process.env.REACT_APP_PROXY_URL || "")+urlOrdemDeCompra).then((resposta) => {
            let htmlOrdemDeCompra = resposta.data;
            let inicioDadosOrdemDeCompra = htmlOrdemDeCompra.split('window.printdata = {')[1];
            let jsonDadosOrdemDeCompra = "{"+inicioDadosOrdemDeCompra.split('};')[0]+"}";
            let objDadosOrdemDeCompra = JSON.parse(jsonDadosOrdemDeCompra);
            return objDadosOrdemDeCompra;
        }).catch((erro) => {
            console.error("Erro ao tentar pegar o HTML da ordem de compra: "+erro);
            throw erro.toString();
        });
    }

}