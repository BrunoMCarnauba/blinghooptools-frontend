export function estaAutenticado() {
    if(localStorage.getItem("autenticacao") != null){
        return true;
    }else{
        return false;
    }
}

export function sair() {
    localStorage.removeItem("autenticacao");
    window.location.reload();
}