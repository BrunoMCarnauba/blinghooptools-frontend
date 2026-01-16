import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

import Rotas from './rotas';

import './index.css';

ReactDOM.render(
  <BrowserRouter>
    <Rotas />
  </BrowserRouter>,
  document.getElementById('root')
);