import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { estaAutenticado, sair } from '../../providers/autenticacao';
import BlingProvider from '../../providers/BlingAPI';
import TinyProvider from '../../providers/TinyAPI';

import Cabecalho from '../../components/cabecalho';
import Loading from '../../components/loading';
import './styles.css';

export default function TelaInicio(){
    const navigate = useNavigate();
    
    const [autenticacaoNoERPBling, setAutenticacaoNoERPBling] = useState<boolean>(true);
    const [tokenAPI, setTokenAPI] = useState<string>("");
    const [erroAutenticacao, setErroAutenticacao] = useState<string>("")
    const [statusCarregando, setStatusCarregando] = useState<string>("");

    const autenticar = async () => {
        setErroAutenticacao("");
        setStatusCarregando("Autenticando...");

        let resultadoAutenticacao = "";

        if(autenticacaoNoERPBling == true){   //Se for para o Bling
            let blingProvider = new BlingProvider();
            resultadoAutenticacao = await blingProvider.testarAPI(tokenAPI);
            if(resultadoAutenticacao == ""){    //Se tiver sido bem sucedido
                localStorage.setItem("autenticacao", JSON.stringify({erp: "Bling", token: tokenAPI}));
            }else{  //Se tiver dado erro
                setErroAutenticacao(resultadoAutenticacao);
            }
        }else{  //Se for para o Tiny
            let tinyProvider = new TinyProvider();
            resultadoAutenticacao = await tinyProvider.testarAPI(tokenAPI);
            if(resultadoAutenticacao == ""){    //Se tiver sido bem sucedido
                localStorage.setItem("autenticacao", JSON.stringify({erp: "Tiny", token: tokenAPI}));
            }else{  //Se tiver dado erro
                setErroAutenticacao(resultadoAutenticacao);
            }
        }

        setStatusCarregando("");
    }

    return (
        <div id="tela-inicio">
            <Cabecalho />

            <div className="conteudo">
                {estaAutenticado() === false &&
                    <form id="autenticacao">
                        <p>Autentique-se para ter acesso às funções que fazem uso do ERP</p>

                        <div id="opcoes-erp">
                            <input type="checkbox" id="bling" checked={autenticacaoNoERPBling} onChange={(event) => {setAutenticacaoNoERPBling(!autenticacaoNoERPBling)}} />
                            <label htmlFor="bling">Bling</label>

                            <input type="checkbox" id="tinyerp" checked={!autenticacaoNoERPBling} onChange={(event) => {setAutenticacaoNoERPBling(!autenticacaoNoERPBling)}} />
                            <label htmlFor="tinyerp">Tiny ERP</label>
                        </div>

                        <div id="container-token">
                            <div className="input-group" onSubmit={(event) => event.preventDefault()}>
                                <label>Token da API</label>
                                <input id="tokenAPI" type="password" size={50} value={tokenAPI} onChange={(event) => setTokenAPI(event.target.value)}/>
                            </div>

                            {statusCarregando == ""
                            ?
                                <button type="submit" className="botao-normal" onClick={() => autenticar()}>Autenticar</button>
                            :
                                <button type="submit" className="botao-normal" disabled style={{backgroundColor: '#d3dbde'}} onClick={() => autenticar()}>Autenticar</button>
                            }
                        </div>
                        
                        {erroAutenticacao &&
                            <p className="mensagem-erro">{erroAutenticacao}</p>                    
                        }
                    </form>
                }

                <nav>
                    {estaAutenticado() === true &&
                        <div>
                            <div className="cabecalho-categoria-menu">
                                <h2>Relatórios e envios de comissões</h2>
                            </div>

                            <div className="botoes-menu">
                                {/* <button onClick={() => navigate('/relatorio-comissoes-hoop')}>Relatório e envio de comissões Hoop</button> */}
                                {estaAutenticado() === true && 
                                <>
                                    <button onClick={() => navigate('/puxa-custos')}>Puxar custos de um orçamento Hoop</button>
                                    <button onClick={() => navigate('/ordem-compra-hoop')}>Enviar ordem de compra Hoop</button>
                                </>
                                }
                            </div>
                        </div>
                    }

                    <div>
                        <div className="cabecalho-categoria-menu">
                            <h2>Ferramentas excel</h2>
                        </div>

                        <div className="botoes-menu">
                            <button onClick={() => navigate('/preparacao-smart-sistemas')}>Atualizar preços do Smart Sistemas</button>
                            <button onClick={() => navigate('/relaciona-tabelas')}>Atualizar preços do Bling</button>
                            <button onClick={() => navigate('/agrupa-tabelas')}>Agrupar ou separar tabelas</button>
                            <button onClick={() => navigate('/extrai-itens')}>Extrair itens de uma tabela</button>
                            <button onClick={() => navigate('/preco-por-margem')}>Calcular preço por margem</button>
                        </div>
                    </div>

                    {/* {estaAutenticado() === true &&
                        <div>
                            <div className="cabecalho-categoria-menu">
                                <h2>Ferramentas de desenvolvedor</h2>
                            </div>

                            <div className="botoes-menu">
                                <button onClick={() => navigate('/migra-pedidos')}>Migrar pedidos entre sistemas</button>
                            </div>
                        </div>
                    } */}

                    <div>
                        <div className="cabecalho-categoria-menu">
                            <h2>Sistemas</h2>
                        </div>

                        <div className="botoes-menu">
                            <button onClick={() => window.open("https://www.bling.com.br/b/login", "_blank")}>Bling (Setor administrativo)</button>
                            <button onClick={() => window.open("https://hoopdecor.com/login", "_blank")}>Hoopdecor (Consultores)</button>
                            <button onClick={() => window.open("https://app.lojaintegrada.com.br/painel/login", "_blank")}>Loja integrada (Ecommerce)</button>
                            <button>Sobre o utilitário</button>
                            <button>Configurações</button>
                            <button onClick={() => sair()}>Sair</button>
                        </div>
                    </div>
                </nav>
            </div>

            <Loading textoStatus={statusCarregando} />
        </div>
    );
}