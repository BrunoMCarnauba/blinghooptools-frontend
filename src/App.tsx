import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import TelaInicial from './pages/tela_inicial';
import TelaRelacionaTabelas from './pages/relaciona_tabelas';
import TelaPuxaCustos from './pages/puxa_custos';
import TelaMigraPedidos from './pages/migra_pedidos';
import TelaFerramentasDiversas from './pages/ferramentas_diversas';

import './global.css'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={TelaInicial} />
        <Route exact path="/relaciona-tabelas" component={TelaRelacionaTabelas} />
        <Route exact path="/puxa-custos" component={TelaPuxaCustos} />
        <Route exact path="/migra-pedidos" component={TelaMigraPedidos} />
        <Route exact path="/ferramentas-diversas" component={TelaFerramentasDiversas} />
      </Switch>
    </Router>
  );
}

export default App;
