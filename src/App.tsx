import React, { ReactElement, useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ReactGa from 'react-ga';

import TelaInicial from './pages/tela_inicial';
import TelaRelacionaTabelas from './pages/relaciona_tabelas';
import TelaExtraiItens from './pages/extrai_itens';
import TelaPuxaCustos from './pages/puxa_custos';
import TelaRelatorioComissoes from './pages/relatorios_comissoes';
import TelaRelatorioVendas from './pages/relatorio_vendas';
import TelaMigraPedidos from './pages/migra_pedidos';
import TelaFerramentasDiversas from './pages/ferramentas_diversas';
import TelaEnviaOrdemDeCompra from './pages/ordem_de_compra';

import { estaAutenticado } from './Auth';

import './global.css'

function App() {
  useEffect(() => {
    document.title = "Utilitários Bling e Hoop";
    ReactGa.initialize(process.env.REACT_APP_GA_TRACKING_ID || ""); //Inicializando Google Analytics para ter acesso à quantidade de visualizações da página
    ReactGa.pageview(window.location.pathname); //Reporta uma visualização da página no Google Analytics
  }, []);

  /**
   * Interface para as propriedades do componente PrivateRoute
   */
  interface IPrivateRoute{
    exact: boolean,
    path: string,
    component: any
  }

  /**
   * Controlando autenticação em rotas no ReactJS: https://youtu.be/sYe4r8WXGQg
   */
  const PrivateRoute = (props: IPrivateRoute) => {
    let Component = props.component;

    return(
      <Route exact={props.exact} path = {props.path} render={(propsRender) => {
        if(estaAutenticado() == true){
          return (<Component />);
        }else{
          return (<Redirect to={{pathname: '/', state: {from: propsRender.location}}} />);
        }
      }} />
    );
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={TelaInicial} />
        <Route exact path="/relaciona-tabelas" component={TelaRelacionaTabelas} />
        <Route exact path="/extrai-itens" component={TelaExtraiItens} />
        <Route exact path="/relatorios-comissoes" component={TelaRelatorioComissoes} />
        <Route exact path="/relatorio-vendas" component={TelaRelatorioVendas} />
        <Route exact path="/ferramentas-diversas" component={TelaFerramentasDiversas} />
        <PrivateRoute exact path="/puxa-custos" component={TelaPuxaCustos} />
        <PrivateRoute exact path="/envia-ordem-compra" component={TelaEnviaOrdemDeCompra} />
        <PrivateRoute exact path="/migra-pedidos" component={TelaMigraPedidos} />
      </Switch>
    </Router>
  );
}

export default App;
