import Axios from 'axios';

interface Produto{
    teste: number
}

export default class TinyProvider {

    protected api = Axios.create({
        baseURL: 'https://api.tiny.com.br/api2/'
    })

    private fimURL: string = "&token=&"+process.env.API_TINY_REVENDA+"+formato=json";

    /**
     * Retorna uma promise em que se tiver conseguido encontrar o pedido por meio do número informado, retorna um objeto com os dados, caso contrário, não retorna nada.
     */
    public async getPedidoPorNumero(numeroPedido: number): Promise<any>{
        try{
            let resposta = await this.api.get('pedidos.pesquisa.php?numero='+numeroPedido+this.fimURL);
            let pedidos = resposta.data.retorno.pedidos;
            
            let idPedido = pedidos[0].pedido.id;

            let pedido = await this.getPedidoPorID(idPedido);

            return pedido;
        }catch(erro){
            console.error("Erro em getPedidoPorNumero = "+erro);
        }
    }

    public async getPedidoPorID(idPedido: number): Promise<any>{
        return this.api.get('pedido.obter.php?id='+idPedido+this.fimURL).then((resposta) => {
            let pedido = resposta.data.retorno.pedido;
            return pedido;
        }).catch((erro) => {
            console.error("Erro em getPedidoPorID = "+erro);
            return null;
        })
    }

    /**
     * Retorna uma promise onde caso não tenha ocorrido erro, retorna uma lista completa de pedidos com os itens inclusos, caso contrário, não retorna nada.
     * @datas Data de cadastramento inicial e final dos pedidos que deseja consultar no formato dd/mm/yyyy
     */
    public async getListaPedidosCompletos(dataInicial: string = '', dataFinal: string = ''): Promise<any>{
        try{
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
        }catch(erro){
            console.error("Erro em getListaPedidos = "+erro);
            return null;
        }
    }

    /**
     * Retorna o produto que tem o código SKU passado por parâmetro.
     * Recomendação: Insira o código SKU completo para evitar erros.
     */
    public async getProdutoPorCodigoSKU(codigoSKU: string){
        return this.api.get('produtos.pesquisa.php?pesquisa='+codigoSKU+this.fimURL).then((resposta) => {
            let produto = resposta.data.retorno.produtos[0].produto;
            return produto;
        }).catch((erro) => {
            console.error("Erro em getProdutoPorCodigoSKU = "+erro);
            return null;
        })
    }
}