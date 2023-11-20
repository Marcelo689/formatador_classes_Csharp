var padroes = [".ask", ".msg", ".label"];

function gerarLabelResx(){

    var lista = pegarMensagems(entrada.value);

    var output  = gerarSaida(lista);

    saida.innerHTML = output;
}

function pegarMensagems(entrada){

    var listaMensagens = [];
    var linhas = entrada.split("\n");

    for (const linha of linhas) {

        if(contem(linha)){
            var label = pegarApenasLabel(linha);
            listaMensagens.push(label);
        }
    }

    return listaMensagens;
}

function contem(linha) {

    for (const padrao of padroes) {
        
        const match = linha.indexOf(padrao) != -1;
        if(match){
            return true;
        }
    }

    return false;
}

function pegarApenasLabel(linha){
    for (const padrao of padroes) {
        
        const indice = linha.indexOf(padrao); 
        const match =  indice != -1;
        if(match){
            return linha.substring(indice, linha.length);
        }
    }

    return "";
}

function gerarSaida(lista){
    var output = "";
    for (const palavra of lista) {
        saida += palavra;
    }

    return output;
}