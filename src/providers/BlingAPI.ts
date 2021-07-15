import Axios from 'axios';
import {objToXML, removerAtributosIndefinidos} from '../utils/utilitarios';
import PedidoBling from '../models/PedidoBling';
import PedidoCompraBling from '../models/PedidoCompraBling';

export default class BlingProvider {

    protected api = Axios.create({
        baseURL: (process.env.REACT_APP_PROXY_URL || "")+'https://bling.com.br/Api/v2/',
    })
    
    private fimURL: string = "";

    private autenticar(){
        let autenticacao:string = localStorage.getItem("autenticacao") || "";
        if(autenticacao != ""){
            this.fimURL = "/json/?apikey="+JSON.parse(autenticacao).token;
        }
    }

    /**
     * Retorna uma promise em que se tiver conseguido encontrar o pedido por meio do número informado, retorna um objeto com os dados, caso contrário, não retorna nada.
     */
    // public async getPedidoPorNumero(numeroPedido: number): Promise<any>{
    //     try{
    //         let resposta = await this.api.get('pedidos.pesquisa.php?numero='+numeroPedido+this.fimURL);
    //         let pedidos = resposta.data.retorno.pedidos;
            
    //         let idPedido = pedidos[0].pedido.id;

    //         let pedido = await this.getPedidoPorID(idPedido);

    //         console.log(pedido);
    //         return pedido;
    //     }catch(erro){
    //         console.error("Erro em getPedidoPorNumero = "+erro);
    //     }
    // }

    /**
     * Verifica se consegue fazer uma consulta no ERP com o Token fornecido. Se sim, retorna uma string vazia, caso contrário, retorna o erro.
     * @param token 
     */
    public async testarAPI(tokenAPI: string): Promise<string>{
        // // Como conferir a URL antes de enviar a requisição: https://stackoverflow.com/questions/50296744/check-axios-request-url-before-sending/50297192
        // this.api.interceptors.request.use(function (config) {
        //     // Do something before request is sent
        //     console.log(config)
        //     return config;
        //   }, function (error) {
        //     // Do something with request error
        //     return Promise.reject(error);
        //   });

        return this.api.get('produtos/json/&apikey='+tokenAPI).then((retorno) => {
            return "";
        }).catch((erro) => {
            if(erro.response != null){
                erro = erro.response.data.retorno.erros.erro;
                return erro.msg+" (Código "+erro.cod+")";
            }else{
                return erro.toString();
            }
        })
    }

    /**
     * Inclui um pedido de venda no sistema Bling
     * https://ajuda.bling.com.br/hc/pt-br/articles/360047064693-POST-pedido
     * @param pedido 
     */
     public async incluirPedido(pedido: PedidoBling){
        try{
            this.autenticar();

            if(pedido.obs){
                pedido.obs = pedido.obs.replace(/(\r\n|\n|\r)/gm, ""); //Remove as quebras de linha das observações - https://stackoverflow.com/questions/10805125/how-to-remove-all-line-breaks-from-a-string
            }

            let pedidoLimpo = removerAtributosIndefinidos(pedido);
            let xmlPedido = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><pedido>";
            xmlPedido += objToXML(pedidoLimpo);
            xmlPedido +="</pedido>"

            // console.log(xmlPedido);
            //Enviar dados do formulário pelo corpo da requisição: https://stackoverflow.com/questions/47630163/axios-post-request-to-send-form-data
            let bodyFormData = new FormData();
            bodyFormData.append('xml', xmlPedido);

            await this.api.post("pedido"+this.fimURL, bodyFormData, {headers: {"Content-Type": "multipart/form-data"}}).then((resposta) => {
                if(resposta.data){
                    console.log(resposta.data.retorno);
                }
            });
        }catch(error){
            console.error("Erro ao incluirPedido. Erro = "+error);
            if(error.response){
                console.error(error.response.data.retorno.erros);
            }
        }
    }

    /**
     * Inclui um pedido de compra no sistema Bling
     * https://ajuda.bling.com.br/hc/pt-br/articles/360047012593-POST-pedidocompra
     * @param pedido 
     */
    public async incluirPedidoCompra(pedidocompra: PedidoCompraBling){
        try{
            this.autenticar();

            if(pedidocompra.observacoes){
                pedidocompra.observacoes = pedidocompra.observacoes.replace(/(\r\n|\n|\r)/gm, ""); //Remove as quebras de linha das observações - https://stackoverflow.com/questions/10805125/how-to-remove-all-line-breaks-from-a-string
            }

            let pedidoCompraLimpo = removerAtributosIndefinidos(pedidocompra);
            let xmlPedidoCompra = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><pedidocompra>";
            xmlPedidoCompra += objToXML(pedidoCompraLimpo);
            xmlPedidoCompra +="</pedidocompra>"

            // console.log(xmlPedido);
            //Enviar dados do formulário pelo corpo da requisição: https://stackoverflow.com/questions/47630163/axios-post-request-to-send-form-data
            let bodyFormData = new FormData();
            bodyFormData.append('xml', xmlPedidoCompra);

            await this.api.post("pedidocompra"+this.fimURL, bodyFormData, {headers: {"Content-Type": "multipart/form-data"}}).then((resposta) => {
                if(resposta.data){
                    console.log(resposta.data.retorno);
                }
            });
        }catch(error){
            console.error("Erro ao incluirPedidoCompra. Erro = "+error);
            if(error.response){
                console.error(error.response.data.retorno.erros);
            }
        }
    }

    /**
     * Retorna o produto que tem o código SKU passado por parâmetro.
     * Se ocorrer algum erro, retorna o erro que pode ser tratado com try...catch
     * @param codigo 
     */
    public getProdutoPorCodigo(codigo: string){
        this.autenticar();

        return this.api.get('produto/'+codigo+this.fimURL).then((resposta: any) => {
            if(resposta.data.retorno.erros == undefined){
                return resposta.data.retorno.produtos[0].produto;
            }else{
                throw resposta.data.retorno.erros[0].erro.msg+" - Confira se está autenticado com o token correto";
            }
        }).catch((erro) => {
            console.error("Erro no método getProdutoPorCodigo(codigo) da classe BlingAPI: ");
            console.error(erro);
            throw erro.toString();
        })
    }

}