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
            if(erro.name !== "AxiosError"){
                erro = erro.response.data.retorno.erros.erro;
                return erro.msg+" (Código "+erro.cod+")";
            }else{
                return erro.toString();
            }
        })
    }

    /**
     * Retorna todos os pedidos que tem a data de emissão correspondente ao período informado por parâmetro
     * @param mes 
     * @param ano 
     * @returns 
     */
    public async buscarPedidos(mes: number, ano: number){
        try{
            this.autenticar();

            let dataInicio = new Date(ano, (mes-1), 1);
            let dataFim = new Date(ano, (mes-1) + 1, 0);
            let resposta = await this.api.get('pedidos/'+this.fimURL+"&filters=dataEmissao["+dataInicio.toLocaleDateString()+" TO "+dataFim.toLocaleDateString()+"]");
            console.log(resposta);
            if(resposta.data.retorno.erros == undefined){
                return resposta.data.retorno.pedidos;
            }else{
                console.log(resposta.data.retorno.erros[0].erro.msg);
                return undefined;
            }
        }catch(erro: any){
            console.error("Erro no método buscarPedidos() da classe BlingAPI: ");
            console.error(erro);
            throw erro.toString();
        }
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
        }catch(error: any){
            console.error("Erro ao tentar incluirPedido. Erro = "+error);
            if(error.response){
                console.error(error.response.data.retorno.erros);
            }
        }
    }

    /**
     * Retorna os dados de um contato a partir do ID, CPF ou CNPJ passado por parâmetro
     * @param identificador (ID, CPF ou CNPJ)
     */
    public async buscarContato(identificador: string){
        try{
            this.autenticar();

            let resultado = await this.api.get("contato/"+identificador+this.fimURL);
            if(resultado.data.retorno.erros){
                throw "Contato: "+resultado.data.retorno.erros[0].erro.msg;
            }else{
                return resultado.data.retorno.contatos[0].contato;
            }
        }catch(erro: any){
            console.error("Erro ao tentar buscarContato. Erro = ");
            console.error(erro);
            if(erro.msg){
                throw erro.msg.toString();
            }
            throw erro.toString(); //Se não tiver o erro.msg
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

            let dadosFornecedor = await this.buscarContato(pedidocompra.fornecedor.cpfcnpj || "");
            pedidocompra.fornecedor.id = dadosFornecedor.id;
            pedidocompra.fornecedor.nome = dadosFornecedor.nome;

            if(pedidocompra.observacoes){
                pedidocompra.observacoes = pedidocompra.observacoes.replace(/(\r\n|\n|\r)/gm, ""); //Remove as quebras de linha das observações - https://stackoverflow.com/questions/10805125/how-to-remove-all-line-breaks-from-a-string
            }

            let pedidoCompraLimpo = removerAtributosIndefinidos(pedidocompra);
            let xmlPedidoCompra = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><pedidocompra>";
            xmlPedidoCompra += objToXML(pedidoCompraLimpo);
            xmlPedidoCompra += "</pedidocompra>"
            // console.log(xmlPedidoCompra);

            //Enviar dados do formulário pelo corpo da requisição: https://stackoverflow.com/questions/47630163/axios-post-request-to-send-form-data
            let bodyFormData = new FormData();
            bodyFormData.append('xml', xmlPedidoCompra);

            await this.api.post("pedidocompra"+this.fimURL, bodyFormData, {headers: {"Content-Type": "multipart/form-data"}}).then((resposta) => {
                // console.log(resposta.data.retorno);
                if(resposta.data.retorno.erros){
                    throw "Pedido de compra: "+resposta.data.retorno.erros[0].erro.msg;
                }
            });
        }catch(error: any){
            console.error("Erro ao tentar incluirPedidoCompra. Erro = "+error);
            console.error(error);
            if(error.msg){
                throw error.msg.toString();
            }
            throw error.toString(); //Se não tiver o error.msg
        }
    }

    /**
     * Retorna o produto que tem o código SKU (código de loja) passado por parâmetro.
     * Se ocorrer algum erro, retorna o erro que pode ser tratado com try...catch
     * @param codigo 
     */
    public getProdutoPorCodigo(codigo: string){
        this.autenticar();

        return this.api.get('produto/'+codigo+this.fimURL).then((resposta: any) => {
            if(resposta.data.retorno.erros == undefined){
                return resposta.data.retorno.produtos[0].produto;
            }else{
                throw resposta.data.retorno.erros[0].erro.msg;
            }
        }).catch((erro: any) => {
            console.error("Erro no método getProdutoPorCodigo(codigo) da classe BlingAPI: ");
            console.error(erro);
            throw erro.toString();
        })
    }

    /**
     * Retorna o produto que tem o código de fábrica passado por parâmetro.
     * Se ocorrer algum erro, retorna o erro que pode ser tratado com try...catch
     * @param codigoFabricante
     * @param idFornecedor
     */
    public async getProdutoPorCodigoFabricante(codigoFabricante: string, idFornecedor: string){
        try{
            this.autenticar();

            let resposta = await this.api.get('produto/'+codigoFabricante+"/"+idFornecedor+this.fimURL);
            
            if(resposta.data.retorno.erros == undefined){
                return resposta.data.retorno.produtos[0].produto;
            }else{
                console.log(resposta.data.retorno.erros[0].erro.msg);
                return undefined;
            }
        }catch(erro: any){
            console.error("Erro no método getProdutoPorCodigoFabricante(codigoFabricante, idFornecedor) da classe BlingAPI: ");
            console.error(erro);
            throw erro.toString();
        }
    }

    /**
     * Cadastra (se não tiver codigo) ou atualiza(se tiver codigo) um produto no Bling
     * @param produto 
     */
    public async salvarProduto(produto: any){
        try{
            this.autenticar();
            
            let produtoLimpo = removerAtributosIndefinidos(produto);

            let xmlProduto = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><produto>";
            xmlProduto += objToXML(produtoLimpo);
            xmlProduto += "</produto>";

            //Enviar dados do formulário pelo corpo da requisição: https://stackoverflow.com/questions/47630163/axios-post-request-to-send-form-data
            let bodyFormData = new FormData();
            bodyFormData.append('xml', xmlProduto);

            let inicioURL = "produto";
            if(produtoLimpo.codigo != undefined){
                inicioURL += "/"+produtoLimpo.codigo;
            }

            await this.api.post(inicioURL+this.fimURL, bodyFormData, {headers: {"Content-Type": "multipart/form-data"}}).then((resposta) => {
                if(resposta.data){
                    console.log(resposta.data.retorno);
                }
            });
        }catch(erro: any){
            console.error("Erro no método cadastrarProduto(produto) da classe BlingAPI: ");
            console.error(erro);
            throw erro.toString();
        }
    }

    /**
     * Busca todas as contas com a situação "pago" que tem a data de vencimento informada
     * @param dataVencimento 
     */
    public async buscarContasRecebidasDoMes(mes: number, ano: number){
        try{
            this.autenticar();

            let dataInicio = new Date(ano, (mes-1), 1);
            let dataFim = new Date(ano, (mes-1) + 1, 0);
            let resposta = await this.api.get('contasreceber/'+this.fimURL+"&filters=dataVencimento["+dataInicio.toLocaleDateString()+" TO "+dataFim.toLocaleDateString()+"]; situacao[pago]");
            
            if(resposta.data.retorno.erros == undefined){
                return resposta.data.retorno.contasreceber;
            }else{
                console.log(resposta.data.retorno.erros[0].erro.msg);
                return undefined;
            }
        }catch(erro: any){
            console.error("Erro no método buscarContasAReceberDoMes() da classe BlingAPI: ");
            console.error(erro);
            throw erro.toString();
        }
    }

    /**
     * Busca a forma de pagamento que tem o id especificado por parâmetro
     * @param id 
     * @returns 
     */
    public async buscarFormaPagamentoPorID(id: string){
        try{
            this.autenticar();

            let resposta = await this.api.get('formapagamento/'+id+this.fimURL);
            
            if(resposta.data.retorno.erros == undefined){
                return resposta.data.retorno.formaspagamento[0];
            }else{
                console.log(resposta.data.retorno.erros[0].erro.msg);
                return undefined;
            }
        }catch(erro: any){
            console.error("Erro no método buscarFormaPagamentoPorID() da classe BlingAPI: ");
            console.error(erro);
            throw erro.toString();
        }
    }
}