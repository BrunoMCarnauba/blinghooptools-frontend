# Utilitário Bling e HoopDecor

Esse projeto foi desenvolvido com [React JS com TypeScript](https://github.com/facebook/create-react-app) 

## Configuração
A aplicação usa do [proxy "CORS Anywhere"](https://github.com/Rob--W/cors-anywhere) para poder fazer as requisições para a API de cada sistema ERP. Por isso é criado um arquivo .env com a variável "REACT_APP_PROXY_URL" onde é informado a URL onde está hospedado o Proxy. A extensão [Allow CORS](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=pt) pode ajudar caso queira utilizar a aplicação em localhost sem ficar executando o proxy.\
Para definir a variável, crie um arquivo chamado .env na pasta raíz do projeto. Dentro dele defina a variável como mostrado no exemplo seguinte: `REACT_APP_PROXY_URL = https://brunomcarnauba-cors-anywhere.herokuapp.com/`

## Recursos disponíveis

### Relacionamento de tabelas para importação no ERP
Atualize os itens do ERP (Bling ou Tiny ERP) através do relacionamento por código de fábrica ou descrição. Você exporta do ERP os produtos do fabricante no qual deseja atualizar, cria uma tabela com todos os produtos recebidos do fabricante seguindo o padrão pedido pela aplicação (Colunas obrigatórias: "Preço de tabela" e "Cód do fabricante" ou "Descrição". E as colunas opcionais: "Unidade", "Unidade por caixa", "Classificação fiscal", "CEST", "Origem", "GTIN/EAN", "Peso bruto (Kg)", "Comprimento embalagem", "Largura embalagem", "Altura embalagem" e "%IPI", onde o IPI você informa o valor sem a %, por exemplo, 5% é apenas 5). Abre a função de relacionamento de tabelas, informa o nome do fabricante que está no ERP, informa os valores para o cálculo de preço, adiciona as tabelas exportadas do ERP e a do fabricante, e a aplicação irá gerar para você uma tabela com os produtos atualizados e outra tabela com os novos produtos encontrados (se houver) para que possa ser importada no ERP.

### Ferramentas diversas
Una as tabelas exportadas do ERP em apenas uma tabela com a função de agrupar tabelas, ou divida 1 tabela em várias.
Essas funções podem ser úteis para juntar tabelas exportadas (quando são exportados mais de 500 produtos o ERP não baixa tudo em uma só tabela), e pode ser útil quando tem uma tabela muito grande para importar, mas por garantia quer importar de 500 em 500 ou algo próximo disso.

### Ferramenta para puxar preços de custo de um orçamento HoopDecor
Puxe os preços de um orçamento HoopDecor com os preços de custo e preços de venda. Essa função é útil para fazer cálculos necessários para dar desconto na venda.
A aplicação consultará os preços de custo na API do ERP através da pesquisa pelo código de loja.

### Ferramenta para gerar relatório de comissões com o HoopDecor
Por meio do relatório de arquitetos ou de vendedores do sistema HoopDecor, crie um relatório com os valores das comissões calculados automaticamente conforme as alíquotas informadas na aplicação.
O sistema usa a seguinte fórmula para cálculo das comissões dos especificadores: `((Valor total com desconto e sem frete)*(1-(%TaxaModoPagamento/100))*(%ComissãoArquiteto/100))`;
E usa a seguinte fórmula para cálculo das comissões dos vendedores: `((Valor total com desconto e sem frete)*(1-(%TaxaModoPagamento/100))*(1-%ComissãoArquiteto/100))*(%ComissãoVendedor/100)`.

### Ferramenta para enviar ordem de compra HoopDecor para o ERP
Envie para o ERP uma ordem de compra gerada através do HoopDecor.

## Scripts disponíveis

Na pasta do projeto, você pode executar os seguintes comandos através do terminal:

### `npm install`

Instala as dependências necessárias para que a aplicação seja executada. Basta executar este comando uma só vez.

### `yarn start`

Inicia o aplicativo no modo de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para acessá-lo pelo navegador.

A página vai recarregar se você fizer edições no código.\
Você também poderá visualizar os erros no console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Links que podem ser úteis

É necessário ter o [NodeJS](https://nodejs.org/en/) instalado no seu computador;<br/>
Para aprender sobre React, você pode checar a [Documentação React](https://reactjs.org/);<br/>
Para aprender sobre a API Bling, você pode checar a [Documentação API Bling para Desenvolvedores](https://ajuda.bling.com.br/hc/pt-br/categories/360002186394-API-para-Desenvolvedores);<br/>
Para aprender sobre a API Tiny ERP, você pode checar a [Documentação API Tiny ERP para Desenvolvedores](https://www.tiny.com.br/ajuda/api/api2);<br/>
Sistema ERP [Bling](https://www.bling.com.br/home);<br/>
Sistema ERP [Tiny ERP](https://www.tiny.com.br/);<br/>
Sitema CRM [HoopDecor](https://hoopdecor.com/).

## O que falta fazer

- Ordenar pela descrição e pelo preço, em ordem crescente ou decrescente, as tabelas enviadas para a função de relacionamento de tabelas, para que a atualização de produtos com códigos de fábrica repetidos seja mais preciso, com mais chances de acertar o produto.\
- Adicionar compatibilidade com arquivos .CSV
