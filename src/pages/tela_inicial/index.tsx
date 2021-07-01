/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import './styles.css';

export default function TelaInicial(){
    // const [usuario, setUsuario] = useState<string>("");

    useEffect(() => {

    }, []);

    const teste = () => {
        
    }

    return (
        <div id="tela-inicial">
            <div>
                <header>
                    <h1>Utilitários TinyERP e HoopDecor</h1>
                </header>

                <nav>
                    <Link className="botao-menu" to="/relaciona-tabelas">Ferramenta para relacionamento de tabelas</Link>
                    <Link className="botao-menu" to="/puxa-custos">Ferramenta para puxar preços de custo do orçamento</Link>
                    <Link className="botao-menu" to="/relatorios-comissoes">Ferramenta para gerar relatório de comissões</Link>
                    <Link className="botao-menu" to="/migra-pedidos">Ferramenta para migrar pedidos entre sistemas ERP</Link>
                    <Link className="botao-menu" to="/ferramentas-diversas">Ferramentas diversas</Link>
                </nav>
            </div>

            <footer>
                <p>Desenvolvido por Bruno - Versão 05/2021-1</p>
            </footer>
        </div>
    );
}