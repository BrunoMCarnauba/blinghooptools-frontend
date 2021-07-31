/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { estaAutenticado } from '../../Auth';
import BlingProvider from '../../providers/BlingAPI';
import TinyProvider from '../../providers/TinyAPI';

import './styles.css';

export default function TelaInicial(){
    const [erpBling, setERPBling] = useState<boolean>(true);
    const [tokenAPI, setTokenAPI] = useState<string>("");
    const [erroAutenticacao, setErroAutenticacao] = useState<string>("");
    
    const [loadingStatus, setLoadingStatus] = useState<string>("");

    useEffect(() => {
    }, []);

    const autenticar = async () => {
        setErroAutenticacao("");
        setLoadingStatus("Autenticando...");

        let resultadoAutenticacao = "";

        if(erpBling == true){   //Se for para o Bling
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

        setLoadingStatus("");
    }

    const sair = () => {
        setTokenAPI("");
        localStorage.removeItem("autenticacao");
        window.location.reload();
    }

    return (
        <div id="tela-inicial">
            <main>
                <header>
                    <h1>Utilitários Bling e HoopDecor</h1>
                </header>

                {estaAutenticado() == false &&
                    <div id="autenticacao">
                        <p>Autentique-se para ter acesso às funções que fazem uso do ERP</p>
                        
                        <div id="opcoes-erp">
                            <input type="checkbox" id="bling" checked={erpBling} onChange={(event) => {setERPBling(!erpBling)}} />
                            <label htmlFor="bling">Bling</label>

                            <input type="checkbox" id="tinyerp" checked={!erpBling} onChange={(event) => {setERPBling(!erpBling)}} />
                            <label htmlFor="tinyerp">Tiny ERP</label>
                        </div>

                        <form className="container-token" onSubmit={(event) => event.preventDefault()}>
                            <label>Token da API</label>
                            <input id="tokenAPI" type="password" size={50} value={tokenAPI} onChange={(event) => setTokenAPI(event.target.value)}/>
                            {loadingStatus == ""
                            ?
                            <button type="submit" className="botao-normal" onClick={() => autenticar()}>Autenticar</button>
                            :
                            <button type="submit" className="botao-normal" disabled style={{backgroundColor: '#d3dbde'}} onClick={() => autenticar()}>Autenticar</button>
                            }
                        </form>
                        
                        {(loadingStatus != "" || erroAutenticacao  != "") && 
                            <div>
                                <p>{loadingStatus}</p>
                                <p className="texto-erro">{erroAutenticacao}</p>
                            </div>
                        }
                    </div>
                }

                <nav>
                    <Link className="botao-normal" to="/relaciona-tabelas">Ferramenta para relacionamento de tabelas</Link>
                    <Link className="botao-normal" to="/relatorios-comissoes">Ferramenta para gerar relatório de comissões</Link>
                    <Link className="botao-normal" to="/relatorio-vendas">Ferramenta para gerar planilha com as vendas</Link>
                    <Link className="botao-normal" to="/ferramentas-diversas">Ferramentas diversas</Link>
                    {estaAutenticado() == true &&
                        <>
                            <Link className="botao-normal" to="/puxa-custos">Ferramenta para puxar preços de custo do orçamento</Link>
                            <Link className="botao-normal" to="/envia-ordem-compra">Ferramenta para enviar ordem de compra para o ERP</Link>
                            {/* <Link className="botao-normal" to="/migra-pedidos">Ferramenta para migrar pedidos entre sistemas ERP</Link> */}
                            <button className="botao-normal" onClick={() => sair()}>Sair</button>
                        </>
                    }
                </nav>
            </main>

            <footer>
                <p>Desenvolvido por <a href="https://github.com/BrunoMCarnauba/blinghooptools-frontend" target="_blank">Bruno</a> - Versão 07/2021-2</p>
            </footer>
        </div>
    );
}