import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

/**
 * Lendo um arquivo excel: https://youtu.be/h33eakwu7oo
 * @param arquivo 
 */
export function lerExcel(arquivo: File):Promise<any[]>{
    const promiseLerArquivo: Promise<any[]> = new Promise((resolve, reject) => {
        let fileReader = new FileReader();
        //Carregando o arquivo
        fileReader.readAsArrayBuffer(arquivo);

        //Quando o arquivo for carregado ele entra nessa função onload
        fileReader.onload=(e)=>{
            //Pega o resultado
            let bufferArray = e.target?.result;

            let pastaTrabalho = XLSX.read(bufferArray, {type: 'buffer'});
            //Pegando a primeira planilha da tabela
            let planilhaUm = pastaTrabalho.Sheets[pastaTrabalho.SheetNames[0]];
            let objPlanilhaUm = XLSX.utils.sheet_to_json(planilhaUm, { defval : "" });  //defval: "" é o valor padrão atribuido quando não há dados na coluna

            //Termina a promise retornando o objPlanilhaUm
            resolve(objPlanilhaUm);
        }

        //Se der erro ao ler o arquivo
        fileReader.onerror=((erro) => {
            //Termina a promise com erro
            reject("Erro fileReader: "+erro);
        })
    })

    return promiseLerArquivo;
}

/**
 * Excel Integration with React | Export data into Excel React (Fullstack Techies): https://youtu.be/HwnHgEoiZzE
 */
export async function criarExcel (nomeArquivo: string, dados: any[]) {
    let fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UFT-8';
    let fileExtension = '.xls'; //Foi escolhido o formato ".xls' pois quando estava como ".xlsx" os "0" que ficavam a esquerda do código às vezes era removido

    //Transformando dados typescript para tabela do sheetjs
    let ws = XLSX.utils.json_to_sheet(dados);
    
    // /* Formata as células da tabela como texto - https://github.com/SheetJS/sheetjs/issues/987 */
    // if(formatarCelulasParaTexto == true){
    //     let range = XLSX.utils.decode_range(ws['!ref'] || ""); //get worksheet range */
        
    //     for(var R = range.s.r; R <= range.e.r; ++R) {
    //         for(var C = range.s.c; C <= range.e.c; ++C) {
    //         var cell_address = {c:C, r:R};
    //         var cell_ref = XLSX.utils.encode_cell(cell_address);

    //             /* if the particular row did not contain data for the column, the cell will not be modified */
    //             if (!ws[cell_ref]){
    //                 continue;
    //             }

    //             /* `.t == "n"` for number cells */
    //             // if (ws[cell_ref].t !== 'n') { //Se a célula não for do tipo número
    //                 ws[cell_ref].z = "@";    //Define o formato como texto
    //             // }
    //         }
    //     }
    // }

    //Criando tabela
    let wb = {
        SheetNames: ['Tabela gerada'],  //nomes das planilhas
        Sheets: {
        'Tabela gerada': ws  //'nomePlanilha': dados
        }
    }

    let excelBuffer = XLSX.write(wb, { bookType: 'xls', type: 'array' });

    let arquivo = new Blob([excelBuffer], {type: fileType});

    let data = new Date();
    FileSaver.saveAs(arquivo, nomeArquivo+" 0"+data.getDate()+"-0"+(data.getMonth()+1)+"-"+data.getFullYear()+fileExtension);
}