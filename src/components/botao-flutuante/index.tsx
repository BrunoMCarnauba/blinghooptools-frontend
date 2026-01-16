import React from 'react';

import iconeAjuda from '../../assets/images/icones/ajuda.png';
import './styles.css';

interface propriedadesBotaoFlutuante {
    lado?: "esquerda" | "direita",
    icone?: "ajuda",
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function BotaoFlutuante(props: propriedadesBotaoFlutuante){

    return(
        <div id="componente-botao-flutuante" style={(props.lado === "esquerda") ? {right: 0, left: 10}: {}}>
            <button onClick={props.onClick}>
                {props.icone === "ajuda" &&
                    <img src={iconeAjuda} alt="Ajuda" />            
                }
            </button>
        </div>
    );
}

BotaoFlutuante.defaultProps = {
    lado: "direita",
    icone: "ajuda"
}