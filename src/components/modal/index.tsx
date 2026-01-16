import React from 'react';

import iconeFechar from '../../assets/images/icones/fechar.png';
import './styles.css';

interface propriedadesModal {
    titulo: string,
    children: JSX.Element,
    visivel: boolean,
    aoPressionarFechar: () => void,
}

export default function Modal(props: propriedadesModal){
    return(
        <>
            {props.visivel == true && 
                <div id="componente-modal">
                    <main>
                        <header>
                            <h3>{props.titulo}</h3>
                            <button onClick={() => props.aoPressionarFechar()}><img src={iconeFechar} alt="Fechar" /></button>
                        </header>

                        {props.children}
                    </main>
                </div>
            }
        </>
    );
}