import Axios from 'axios';

interface Produto{
    teste: number
}

export default class TinyProvider {

    protected api = Axios.create({
        baseURL: (process.env.REACT_APP_PROXY_URL || "")+'https://api.tiny.com.br/api2/'
    })

    private fimURL: string = "";

    private autenticar(){
        let autenticacao:string = localStorage.getItem("autenticacao") || "";
        if(autenticacao != ""){
            this.fimURL = "&formato=json&token="+JSON.parse(autenticacao).token;
        }
    }

    /**
     * Verifica se consegue fazer uma consulta no ERP com o Token fornecido. Se sim, retorna uma string vazia, caso contrário, retorna o erro.
     * @param token 
     */
    public async testarAPI(token: string): Promise<string>{
        return this.api.get("produtos.pesquisa.php?pesquisa&token="+token+"&formato=json").then((resposta) => {
            let dadosRecebidos = resposta.data.retorno;
            if(dadosRecebidos.erros != undefined){
                return dadosRecebidos.erros[0].erro+" (Código "+dadosRecebidos.codigo_erro+")";
            }else{
                return "";
            }
        }).catch((erro: any) => {
            return erro.toString();
        })
    }

    /**
     * Retorna uma promise em que se tiver conseguido encontrar o pedido por meio do número informado, retorna um objeto com os dados, caso contrário, não retorna nada.
     */
    public async getPedidoPorNumero(numeroPedido: number): Promise<any>{
        try{
            this.autenticar();

            let resposta = await this.api.get('pedidos.pesquisa.php?numero='+numeroPedido+this.fimURL);
            let pedidos = resposta.data.retorno.pedidos;
            
            let idPedido = pedidos[0].pedido.id;

            let pedido = await this.getPedidoPorID(idPedido);

            return pedido;
        }catch(erro: any){
            console.error("Erro em getPedidoPorNumero = "+erro);
            throw erro.toString();
        }
    }

    public async getPedidoPorID(idPedido: number): Promise<any>{
        this.autenticar();

        return this.api.get('pedido.obter.php?id='+idPedido+this.fimURL).then((resposta) => {
            let pedido = resposta.data.retorno.pedido;
            return pedido;
        }).catch((erro: any) => {
            console.error("Erro em getPedidoPorID = "+erro);
            throw erro.toString();
        })
    }

    /**
     * Retorna uma promise onde caso não tenha ocorrido erro, retorna uma lista completa de pedidos com os itens inclusos, caso contrário, não retorna nada.
     * @datas Data de cadastramento inicial e final dos pedidos que deseja consultar no formato dd/mm/yyyy
     */
    public async getListaPedidosCompletos(dataInicial: string = '', dataFinal: string = ''): Promise<any>{
        try{
            this.autenticar();

            //Como conferir a URL antes de enviar a requisição: https://stackoverflow.com/questions/50296744/check-axios-request-url-before-sending/50297192
            // this.api.interceptors.request.use(function (config) {
            //     // Do something before request is sent
            //     console.log(config)
            //     return config;
            //   }, function (error) {
            //     // Do something with request error
            //     return Promise.reject(error);
            //   });

            let resposta = await this.api.get('pedidos.pesquisa.php?dataInicial='+dataInicial+'&dataFinal='+dataFinal+this.fimURL);
            let listaPedidosSimples = resposta.data.retorno.pedidos;

            let pedidosCompletos: any[] = [];
            for(let i=0; i<listaPedidosSimples.length; i++){
                pedidosCompletos.push(await this.getPedidoPorID(listaPedidosSimples[i].pedido.id));
            }

            return pedidosCompletos;
        }catch(erro: any){
            console.error("Erro em getListaPedidos = "+erro);
            throw erro.toString();
        }
    }

    /**
     * Retorna o produto que tem o código SKU passado por parâmetro.
     * Recomendação: Insira o código SKU completo para evitar erros.
     * Caso tenha ocorrido erro, a função retorna o erro que pode ser tratado com try...catch
     */
    public async getProdutoPorCodigoSKU(codigoSKU: string){
        this.autenticar();

        return this.api.get('produtos.pesquisa.php?pesquisa='+codigoSKU+this.fimURL).then((resposta) => {
            console.log(resposta);
            if(resposta.data.retorno.erros == undefined){
                return resposta.data.retorno.produtos[0].produto;
            }else{
                throw resposta.data.retorno.erros[0].erro;
            }
        }).catch((erro: any) => {
            console.error("Erro em getProdutoPorCodigoSKU = "+erro);
            throw erro.toString();
        })
    }
}