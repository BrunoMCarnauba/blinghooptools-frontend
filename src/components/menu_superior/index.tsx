/* eslint-disable */
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

interface propriedades{
    tituloPagina: string
    ajudaPressionado?: any
}

export default function MenuSuperior(props: propriedades){
    // const [teste, setTeste] = useState<string>('');

    // useEffect(() => {

    // }, []);

    return (
        <div id="menu-superior">
            <Link className="botao" to="/">Voltar</Link>
            <h4>{props.tituloPagina}</h4>
            
            <div>
                {props.ajudaPressionado != undefined &&
                    <button className="botao" onClick={() => props.ajudaPressionado()}>Ajuda</button>
                }
            </div>
        </div>
    );

}