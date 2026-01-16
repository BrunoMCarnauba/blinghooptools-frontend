import React from 'react';

import './styles.css';

interface propriedadesLoading{
    textoStatus: string
}

export default function Loading(props: propriedadesLoading){

    return(
        <>
            {props.textoStatus != "" &&
                <div id="componente-loading">
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                    <p>{props.textoStatus}</p>
                </div>
            }
        </>
    );
}