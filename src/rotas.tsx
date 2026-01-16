import React from  'react';
import { Routes, Route } from "react-router-dom";

import TelaInicio from './pages/inicio';
import TelaRelatorioComissoesHoop from './pages/relatorios-comissao-hoop';
import TelaRelacionaTabelas from './pages/relaciona-tabelas';
import TelaAgrupaTabelas from './pages/agrupa-tabelas';
import TelaExtraiItens from './pages/extrai-itens';
import TelaPuxaCustos from './pages/puxa-custos';
import TelaOrdemCompraHoop from './pages/ordem-de-compra';
import TelaMigraPedidos from './pages/migra-pedidos';
import TelaPrecoPorMargem from './pages/preco-por-margem';
import TelaPreparacaoSmartSistemas from './pages/preparacao-smart-sistemas';

const Rotas = () => {
    return(
        <Routes>
            <Route path="/inicio" element={<TelaInicio />} />
            <Route path="/relatorio-comissoes-hoop" element={<TelaRelatorioComissoesHoop />} />
            <Route path="/relaciona-tabelas" element={<TelaRelacionaTabelas />} />
            <Route path="/preco-por-margem" element={<TelaPrecoPorMargem />} />
            <Route path="/agrupa-tabelas" element={<TelaAgrupaTabelas />} />
            <Route path="/extrai-itens" element={<TelaExtraiItens />} />
            <Route path="/puxa-custos" element={<TelaPuxaCustos />} />
            <Route path="/ordem-compra-hoop" element={<TelaOrdemCompraHoop />} />
            <Route path="/migra-pedidos" element={<TelaMigraPedidos />} />
            <Route path="/preparacao-smart-sistemas" element={<TelaPreparacaoSmartSistemas />} />
            <Route path="/*" element={<TelaInicio />} />
        </Routes>
    );
}

export default Rotas;