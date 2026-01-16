import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logomarcaBdesign from "../../assets/images/logo_bdesign.png";
import voltar from "../../assets/images/icones/voltar.png";
import './styles.css';

interface propriedadesCabecalho {
    titulo?: string
}

export default function Cabecalho(props: propriedadesCabecalho){

    const navigate = useNavigate();
    const [lojaAtual, setLojaAtual] = useState<string>("Revenda");

    /**
     * Muda de revenda para representação ou vice versa
     */
    const alterarLoja = () => {
        if(lojaAtual == "Revenda"){
            setLojaAtual("Representação");
        } else {
            setLojaAtual("Revenda");
        }
    }

    return(
        <div id="componente-cabecalho">
            <div id="cabecalho-sistema">
                <span>
                    <img src={logomarcaBdesign} alt="Logomarca BDesign" />
                    <h2>Utilitários Bling & Hoop</h2>
                </span>

                <span>
                    <button onClick={() => alterarLoja()}>Atualmente na {lojaAtual}</button>
                </span>
            </div>

            {props.titulo != undefined &&
                <div id="cabecalho-pagina">
                    <button onClick={() => navigate(-1)}><img src={voltar} alt="Voltar" /></button>
                    <p>{props.titulo}</p>
                </div>
            }
        </div>
    );
}