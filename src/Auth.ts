export function estaAutenticado() {
    if(localStorage.getItem("autenticacao") != null){
        return true;
    }else{
        return false;
    }
}