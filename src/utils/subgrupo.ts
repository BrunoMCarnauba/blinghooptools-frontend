/**
 * Mapeia Grupos para uma lista de regras de Subgrupo.
 * Cada regra é uma tupla [palavrasChave[], subgrupoNome]
 * A ORDEM É IMPORTANTE! Regras mais específicas devem vir primeiro.
 */
const MAPA_SUBGRUPOS: Record<string, [string[], string][]> = {
  "ELETRODOMESTICOS": [
    // 1. Prioridade para itens de Refrigeração
    [
      ['FREEZER', 'BEER CENTER', 'ADEGA', 'FRIGOBAR', 'REFRIGERADOR', 'GAVETA REFRIGERADA', 'ICE MAKER', 'ICE-MAKER', 'CHAMPANHEIRA', 'CERVEJEIRA', 'MAQUINA DE GELO'],
      'REFRIGERACAO' // Pode separar criando um subgrupo para 'ADEGAS E CERVEJEIRAS' se quiser dividir mais as coisas
    ],
    // 2. Coifas
    [
      ['COIFA', 'DEPURADOR', 'EXAUSTOR'],
      'COIFAS E DEPURADORES'
    ],
    // 3. Cocção (Fogões)
    [
      ['COOKTOP', 'FOGAO', 'RANGETOP', 'RANGE', 'FORNO', 'MICRO-ONDAS', 'MICROONDAS', 'AQUECIDA'],
      'FOGOES FORNOS E COOKTOPS'
    ],
    // 4. Churrasco
    [
      ['CHURRASQUEIRA', 'GRILL', 'ASSADOR', 'ESPETO', 'GRELHA'],
      'CHURRASQUEIRAS E GRILLS'
    ],
    // 5. Máquinas grandes
    [
      ['LAVA-LOUCAS', 'LAVA LOUCAS'],
      'LAVA-LOUCAS'
    ],
    // 6. Eletroportáteis
    [
      ['DISPENSER', 'TRITURADOR', 'CAFETEIRA', 'CAFE', 'AIR FRYER', 'BATEDEIRA', 'LIQUIDIFICADOR'],
      'PORTATEIS E UTILITARIOS'
    ],
    // 7. Acessórios (Fica por último para não roubar termos genéricos)
    [
      ['DUTO', 'FILTRO', 'KIT INSTALACAO', 'STORAGE', 'ESPATULA', 'PUXADOR', 'DISPLAY', 'CABO', 'CONECTOR', 'FLANGE', 'VENEZIANA'],
      'ACESSORIOS E PECAS ELETRO'
    ],
  ],

  "LOUÇAS E METAIS": [
    // 1. Cubas e Pias
    [
      ['CUBA', 'PIA', 'BOJO', 'LAVATORIO', ' LAV ', 'LAVANDERIA', ' CB ', 'COLUNA', 'TANQUE', 'BANCADA', 'SUPORTE', 'CALHA UMIDA', 'CALHA ÚMIDA', 'CANAL EQUIPADO', 'FARMHOUSE', 'FREESTANDING'],
      'CUBAS E PIAS'
    ],
    // 2. Banheiras
    [
      ['BANHEIRA', 'SPA', 'COLUNA DE BANHO', 'OFURO'],
      'BANHEIRAS E SPAS'
    ],
    // 3. Metais Principais (Torneiras/Misturadores vêm antes de Acabamentos)
    [
      ['MISTURADOR', 'MONOCOMANDO', 'BICOMANDO', ' MIST ', ' MIS ', ' MONO ', ' MONOC ', ' MON. ', 'BICA'],
      'MISTURADORES'
    ],
    [
      ['TORNEIRA', ' TORN ', ' TOR '],
      'TORNEIRAS'
    ],
    [
      ['CHUVEIRO', ' CHU ', ' CHUV ', 'DUCHA', ' DUCH ', 'DUCHINHA', 'DESVIADOR', ' DESV '],
      'CHUVEIROS E DUCHAS'
    ],
    // 4. Louças Sanitárias
    [
      ['BACIA', 'VASO SANITARIO', 'CAIXA ACOPLADA', 'BACIA COM CAIXA', 'CX ACOP', 'CAIXA ACOP', 'ACOPLAR', 'BIDE', ' CX AC ', 'CISTERNA'],
      'BACIAS SANITARIAS'
    ],
    [
      ['MICTORIO', 'LAVATORIO COLETIVO'],
      'MICTORIOS E LAVATORIOS COLETIVOS'
    ],
    // 5. Ralos (Cuidado para não pegar "Pia com Ralo")
    [
      ['RALO', 'GRELHA', 'CANALETA', 'TAMPA OCULTA'],
      'RALOS E GRELHAS'
    ],
    // 6. Acessórios de Banheiro
    [
      ['SABONETEIRA', 'PORTA SABONETE', 'PORTA SHAMPOO', 'P SABONETE', 'PAPELEIRA', 'PORTA PAPEL', 'PORTA TOALHA', 'PORTA-TOALHA', 'PORTA TOA', 'TOALHEIRO', 'CABIDE', 'DOSADOR', 'DECK', 'TRAVESSEIRO', 'BANDEJA', 'SABONET', 'DISPENSADOR', 'ASSENTO', ' ASS ', 'PRATELEIRA', ' BARRA ', ' BAR ', 'LIXEIRA', 'VARAL', 'ORGANIZADOR', 'ESCORREDOR', 'TEMPEROS', 'TALHERES', 'CHAMPANHEIRA', 'TABUA DE CORTE', 'ESCOVA', 'BANQUETA', 'ESPELHO', 'ESTANTE', 'CANTONEIRA', 'CAIXA PAPELAO', 'CESTO', 'CESTA', 'DISPENSER', 'CAPA', 'ALMOFADA', 'EXPOSITOR', 'PUXADOR', 'PXD', 'ARMADOR', 'GANCHO'],
      'ACESSORIOS'
    ],
    // 7. Acabamentos
    [
      ['ACABAMENTO', ' ACAB ', ' ACA', ' ACB ', 'TAPA FURO', 'SIFAO', 'VALVULA', ' VALV ', ' VAL ', ' VSA ', 'REGISTRO', ' REG ', ' RG ', 'SUPLEMENTO', ' CX DSC ', 'TAMPAO', ' LIGACAO ', 'RODAPIA', ' BASE'],
      'ACABAMENTOS E VALVULAS'
    ],
    // 8. Peças Técnicas
    [
      ['REPARO', 'VEDANTE', 'CARTUCHO', 'MECANISMO DE SAIDA', 'PECA', 'ILUMINACAO', 'ARRUELA', 'VISOR', 'MOLA', 'BOTAO', 'REGULADOR', 'CABO', 'SCJ', 'PARAFUSO', 'FIXACAO', 'TORRE', 'AREJADOR', 'PLACA', 'REPOSICAO', 'PORCA', 'MOTOR', 'ESTRUTURA', 'MECANISMO', 'CARTUCHO', 'PROLONGADOR', 'BUCHA', 'BOLSA ACOP', 'TUBO', 'BOMBA', 'ALARME'],
      'PECAS DE REPARO E COMPONENTES'
    ]
  ],

  "REVESTIMENTOS": [
    // 1. NICHOS ESPECÍFICOS (Devem ser os primeiros para não cair em regras genéricas)
    
    // Itens Kapazi e Emborrachados
    [
      ['GRAMA SINTETICA', 'PISO TATIL', 'DEMARCACAO TATIL', 'FITA ANTIDERRAPANTE', 'FITA DEMARCACAO', 'CAPACHO', 'ESTRADO', 'FITA DE DEMARCACAO'],
      'TAPETES CAPACHOS E PISOS EMBORRACHADOS'
    ],
    // Papéis de Parede e couro (Antes de "Madeira" ou "Cimentício")
    [
      ['COURO', 'COURO NATURAL', 'ECO COURO', 'PALHA NATURAL', 'PALHA', 'ALGODAO', 'CABECEIRA', 'PAINEL ESTOFADO', 'PAINEL COURO', 'PAPEL DE PAREDE', 'PAPEL PAREDE', 'WALLPAPER', 'TNT', 'FIBRA DE VIDRO', 'TASSOGLASS', 'ROLO', 'TEXTURA'],
      'PAPEIS DE PAREDE E REVESTIMENTOS ESPECIAIS'
    ],
    
    // 2. ACESSÓRIOS VISUAIS (Rodapés)
    // Devem vir antes dos Pisos, pois "Rodapé de Madeira" deve ser Rodapé, não Piso.
    [
      ['RODAPE', 'GUARNICAO', 'PERFIL', 'RODA TETO', 'RODATETO', 'RODA MEIO', 'RODAMEIO', 'TESTEIRA', 'TRANSICAO', 'REDUTOR', 'CANTONEIRA', 'CORDAO', 'NOOSING', 'SOLEIRA', 'SOCALO', 'ROSETA', 'FILETE', ' RIPA ', 'RIPADO', 'MEIA CURVA', 'CROSSWALL', 'MOLDURA'],
      'RODAPES GUARNICOES E RODA TETOS'
    ],

    // 3. REVESTIMENTOS NOBRES E DECORATIVOS
    [
      ['MOSAICO', 'PASTILHA', 'SEIXO', 'TELADO', 'TESSERA', 'FARIM', 'FARIM-DK', 'SMIRNA', 'TANAF'],
      'MOSAICOS E PASTILHAS'
    ],
    [
      ['PISO DE MADEIRA', 'REVESTIMENTO DE MADEIRA', 'INDUSPARQUET', 'TACO', 'ASSOALHO', 'DECK', 'LAMBRIL', 'BRISE', 'VERSAILLES', 'PARQUET', 'PRONTO', 'MACICO'],
      'PISOS E REVESTIMENTOS DE MADEIRA'
    ],
    [
      ['PEDRA', 'TIJOLO', 'TJ', 'TRAVERTINO', 'STONE', 'ARDOSIA', 'FILETE', 'SEIXO'],
      'PEDRAS NATURAIS'
    ],

    // 4. PISOS E REVESTIMENTOS SINTÉTICOS E FRIOS
    [
      ['PORCELANATO', 'GRES', 'CROCCANTE', 'WOODEN', 'ARANDANO', ' AC ', ' EXT ', ' PO ', ' PE ', ' EP ', ' NAT ', ' PG ', ' PS ', ' LM ', 'LAMINAM'],
      'PORCELANATOS'
    ],
    [
      ['VINILICO', 'VINIL', 'LVC', 'LVT', 'AMBIENTA', 'PAVIFLEX', 'DECORFLEX', 'IQ OPTIMA', 'DECODE', 'ECLIPSE', 'SPC', 'CLICK'],
      'PISOS VINILICOS'
    ],
    [
      ['LAMINADO', 'DURAFLOOR', 'EUCAFLOOR'],
      'PISOS LAMINADOS'
    ],
    [
      ['CIMENTICIO', 'CONCRETO', 'CASTELATTO', 'PAINEL CIMENTICIO'],
      'PISOS CIMENTICIOS'
    ],
    
    // 5. CERÂMICOS (O "Pega Resto" de piso frio e Tijolinhos Duefratelli)
    [
      ['REVESTIMENTO', 'CERAMICO', 'AZULEJO', 'PINGADEIRA', 'BORDA', ' RV ', ' PP ', ' INS ', '3X12', 'DUEFRATELLI', 'ROMA', 'ISTAMBUL', 'NADI', 'ARGILA', 'BARRO'],
      'REVESTIMENTOS CERAMICOS - AZULEJOS'
    ],

    // 6. MATERIAIS DE INSTALAÇÃO (Fica por último para não engolir palavras como "Cola" ou "Fita")
    [
      ['ARGAMASSA', 'REJUNTE', 'REJUNTAMENTO', 'NIVELA PISO', 'CUNHA', 'ADESIVO', 'COLA ', 'PRIMER', 'SELADOR', 'IMPERMEABILIZANTE', 'OLEOFUGANTE', 'FITA DE COBRE', 'FRESA', 'FRESADOR', 'ESTILETE', 'LAMINA', 'SOLDA', 'BARROTE', 'CAVILHA', 'CATALISADOR', ' OLEO ', 'SELADORA', 'RENOVADOR', 'VERNIZ', 'MASSA', 'BUCHA', 'DUPLA FACE', ' VIGA ', ' CLIP ', 'PARAFUSO', 'LIMPEZA', 'MANTA', 'TUBO', 'DESINCRUSTRANTE', 'CRISTALIZANTE', 'LUCIDANTE', 'REPELENTE', 'REMOVEDOR', 'GRAMPO'],
      'ARGAMASSAS REJUNTES E ACESSORIOS'
    ],
  ]
};

/**
 * Limpa e padroniza o texto para uma comparação mais fácil.
 */
const normalizeText = (text: string | null | undefined): string => {
  if (!text) {
    return "";
  }
  
  let normalized = text.toUpperCase();
  
  // Remove acentos
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Adiciona espaços em volta para facilitar buscas por palavras inteiras (ex: " AC ")
  return " " + normalized + " ";
}

/**
 * Classifica um produto em um Subgrupo com base em sua descrição e Grupo.
 * @param descricao A descrição completa do produto.
 * @param grupo O Grupo já definido para o produto.
 * @returns O nome do Subgrupo ou "A CLASSIFICAR" se não for encontrado.
 */
export const classificarSubgrupo = (descricao: string, grupo: string): string => {
  const descricaoNormalizada = normalizeText(descricao);

  // Encontra o conjunto de regras para o grupo informado
  const regrasDoGrupo = MAPA_SUBGRUPOS[grupo];

  // Se o grupo não for encontrado no mapa, retorna para revisão
  if (!regrasDoGrupo) {
    return "NAO CLASSIFICADO";
  }

  // Itera sobre as regras (a ordem importa!)
  for (const [palavrasChave, subgrupo] of regrasDoGrupo) {
    for (const palavra of palavrasChave) {
      if (descricaoNormalizada.includes(palavra)) {
        return subgrupo;
      }
    }
  }

  // Se nenhuma regra do grupo corresponder, retorna para revisão
  return "NAO CLASSIFICADO";
};