import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import TelaInicial from './pages/tela_inicial';
import TelaRelacionaTabelas from './pages/relaciona_tabelas';
import TelaPuxaCustos from './pages/puxa_custos';
import TelaRelatorioComissoes from './pages/relatorios_comissoes';
import TelaMigraPedidos from './pages/migra_pedidos';
import TelaFerramentasDiversas from './pages/ferramentas_diversas';

import './global.css'

function App() {
  useEffect(() => {
    document.title = "Utilitários Bling e Hoop";
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={TelaInicial} />
        <Route exact path="/relaciona-tabelas" component={TelaRelacionaTabelas} />
        <Route exact path="/puxa-custos" component={TelaPuxaCustos} />
        <Route exact path="/relatorios-comissoes" component={TelaRelatorioComissoes} />
        <Route exact path="/migra-pedidos" component={TelaMigraPedidos} />
        <Route exact path="/ferramentas-diversas" component={TelaFerramentasDiversas} />
      </Switch>
    </Router>
  );
}

export default App;
