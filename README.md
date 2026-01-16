# Utilitários ERP

Esse projeto foi desenvolvido com [ReactJS e a linguagem de programação TypeScript](https://github.com/facebook/create-react-app) com intuito de facilitar alguns processos nos sistemas Bling, Tiny, Hoop e Smart Sistemas.

## Configuração
Para o Bling, Tiny ou Hoopdecor, alguns recursos fazem requisição para a API, seja para ler ou salvar dados. Para isso, é utilizado o [proxy "CORS Anywhere"](https://github.com/Rob--W/cors-anywhere), que atua como um servidor intermediário, encaminhando as requisições do frontend para a API externa e adicionando os headers CORS necessários. Dessa forma, evita-se a necessidade de implementar um backend próprio apenas para esse fim. A URL desse proxy é definida no arquivo .env com a variável "REACT_APP_PROXY_URL". Caso não queira utilizá-lo, você pode usar a extensão [Allow CORS](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=pt) que permitirá o uso direto pelo próprio frontend sem a necessidade do proxy.\
Para definir a variável, crie um arquivo chamado .env na pasta raíz do projeto. Dentro dele defina a variável como mostrado no exemplo seguinte: `REACT_APP_PROXY_URL = https://cors-anywhere.com/`

## Recursos disponíveis

### Relacionamento de tabelas para importação no ERP (Bling ou Tiny)
Atualize os itens do ERP (Bling ou Tiny ERP) através do relacionamento por código de fábrica ou descrição complementar. Você exporta do ERP os produtos do fabricante no qual deseja atualizar, cria uma tabela com todos os produtos recebidos do fabricante seguindo o padrão pedido pela aplicação (Colunas obrigatórias: "Preço de tabela" e "Cód do fabricante" ou "Preço de tabela" e "Descrição". Colunas opcionais: "%IPI", "Unidade", "Unidade por caixa", "Classificação fiscal", "CEST", "Origem", "GTIN/EAN", "Peso bruto (Kg)", "Comprimento embalagem", "Largura embalagem" e "Altura embalagem". O valor informado na coluna %IPI deve ser sem a %, por exemplo, 5% é apenas 5, e na origem é informado o número que a representa, que pode ser de 0 a 8), informa o nome do fabricante cadastrado no ERP, informa os valores para o cálculo de preço, personaliza a atualização com as opções disponíveis, adiciona as tabelas exportadas do ERP e a do fabricante, e a aplicação irá gerar para você uma tabela com os produtos atualizados e outra tabela com os novos produtos encontrados (se houver) para que possa ser importada no ERP. Antes de importar, abra cada uma, confira se está ok e exclua a última coluna chamada "EMPTY_" (se houver). Se não desejar que o preço seja calculado, basta deixar o fator com o valor 1 e os demais campos com o valor 0.
A fórmula usada para cálculo do preço de custo é: `((PrecoTabela*(1-Desconto))*(1+ST))*(1+IPI)` e para o preço de venda é: `(PrecoCusto*Fator)*(1+Adicao)`.

### Preparação da tabela para importação no ERP (Smart Sistemas)
A tabela padrão de importação de produtos do Smart Sistemas apresenta muitas colunas a serem preenchidas. Com essa ferramenta, você pode acelerar o processo de preperação da tabela usando uma tabela simplificada. O sistema direciona os dados para as colunas aceitas pelo Smart e calcula o preço de venda caso deseje. Outros valores padrões de impostos ou outros campos podem ser definidos direto no código, para o preenchimento automático. A tabela que o sistema lê contém as seguintes colunas (mas nem todas são obrigatórias): "Cód do fabricante", "Descrição", "Preço de tabela", "Preço de custo" (Caso não deseje que o sistema calcule automaticamente), "Preço de venda" (Caso não deseje que o sistema calcule automaticamente), "Unidade", "Unidade por caixa", "Classificação fiscal", "Peso", "UF Origem", "Número de origem". Caso deseje que o sistema calcule o preço de custo, você também precisa inserir %IPI, %ST, %Desconto e %Frete (ou R$ Frete), com valores numéricos, sem o uso da porcentagem no fim deles, sendo o frete uma coluna opcional. Já para o cálculo do preço de venda, você precisa inserir %Markup que será incluso ao preço de custo, ou Fator e %Acréscimo. Você também pode ajustar algumas opções pelos checkboxs presentes na página, como calcular ou não o preço de custo de forma automática, onde caso deixe desmarcado para o cálculo automático, ele vai inserir na coluna do Smart Sistemas as informações de %IPI, %ST e Preço de tabela, para que o ERP fique responsável pelo cálculo.

### Ferramenta para extração de itens de uma tabela
Extraia itens de uma tabela pelo código. Você pode manter apenas os itens nos quais seu código está presente na tabela base ou remover todos os itens que não tem código presente na tabela base. O sistema executa a tarefa e retorna uma planilha excel com os dados extraídos.

### Ferramenta para agrupar tabelas
Una as tabelas exportadas do ERP em apenas uma tabela com a função de agrupar tabelas, ou divida 1 tabela em várias.
Essas funções podem ser úteis para juntar tabelas exportadas (quando são exportados mais de 500 produtos o ERP não baixa tudo em uma só tabela), e pode ser útil quando tem uma tabela muito grande para importar, mas por garantia quer importar de 500 em 500 ou algo próximo disso.

### Ferramenta para puxar preços de custo de um orçamento HoopDecor
Puxe os preços de um orçamento HoopDecor com os preços de custo e preços de venda. Essa função é útil para fazer cálculos necessários para dar desconto na venda.
A aplicação consultará os preços de custo na API do ERP através da pesquisa pelo código de loja.

### Ferramenta para gerar relatório de comissões com o HoopDecor
Por meio do relatório de arquitetos ou de vendedores do sistema HoopDecor, crie um relatório com os valores das comissões calculados automaticamente conforme as alíquotas informadas na aplicação.
O sistema usa a seguinte fórmula para cálculo das comissões dos especificadores: `((Valor total com desconto e sem frete)*(1-(%TaxaModoPagamento/100))*(%ComissãoArquiteto/100))`;
E usa a seguinte fórmula para cálculo das comissões dos vendedores: `((Valor total com desconto e sem frete)*(1-(%TaxaModoPagamento/100))*(1-%ComissãoArquiteto/100))*(%ComissãoVendedor/100)`.

### Ferramenta para gerar planilha do relatório de vendas do HoopDecor
Por meio do relatório de arquitetos ou de vendedores do sistema HoopDecor, crie uma planilha excel que além dos dados originais, contém alguns dados que estão ocultos no relatório original

### Ferramenta para enviar ordem de compra HoopDecor para o ERP (Bling ou Tiny)
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

- Ordenar pela descrição e pelo preço, em ordem crescente ou decrescente, as tabelas enviadas para a função de relacionamento de tabelas, para que a atualização de produtos com códigos de fábrica repetidos seja mais preciso, com mais chances de acertar o produto.
- Adicionar compatibilidade com arquivos .CSV
- Modificar autenticação no sistema. Manter como aquelas janelas pra aceitar cookie que aparece na parte inferior da tela. Colocar um texto explicativo informando para que serve a autenticação e por 2 opções de autenticação, a de entrar como visitante, onde precisa apenas adicionar o token do ERP e isso não é salvo no sistema e a de cadastrar o token, onde pode configurar mais de uma loja e não precisa ficar informando ele sempre, pois é salvo no sistema.
- Fazer um comparador de preços (dizer o percentual de diferença entre os preços de 2 tabelas). Examinar 2 tabelas que tem o código do fabricante, descrição e o preço e gerar uma nova com o percentual de diferença.