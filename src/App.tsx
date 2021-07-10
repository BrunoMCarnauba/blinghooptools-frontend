import React, { useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import TelaInicial from './pages/tela_inicial';
import TelaRelacionaTabelas from './pages/relaciona_tabelas';
import TelaPuxaCustos from './pages/puxa_custos';
import TelaRelatorioComissoes from './pages/relatorios_comissoes';
import TelaMigraPedidos from './pages/migra_pedidos';
import TelaFerramentasDiversas from './pages/ferramentas_diversas';

import './global.css'
import { estaAutenticado } from './Auth';

function App() {
  useEffect(() => {
    document.title = "Utilitários Bling e Hoop";
  }, []);

  /**
   * Controlando autenticação em rotas no ReactJS: https://youtu.be/sYe4r8WXGQg
   */
  const PrivateRoute = (exact: any, path: string, component: any) => {  // !! Falta ajustar os tipos. Colocar exact como boolean e component como component react
    let Component = component;

    return(
      <Route exact={exact} path = {path} render={(propsRender) => {
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
        <Route exact path="/relatorios-comissoes" component={TelaRelatorioComissoes} />
        <Route exact path="/ferramentas-diversas" component={TelaFerramentasDiversas} />
        <PrivateRoute exact path="/puxa-custos" component={TelaPuxaCustos} />
        <PrivateRoute exact path="/migra-pedidos" component={TelaMigraPedidos} />
      </Switch>
    </Router>
  );
}

export default App;
