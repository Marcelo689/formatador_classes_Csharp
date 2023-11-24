var padroes = [".ask", ".msg", ".label"];

function gerarLabelResx(){

    var lista = pegarMensagems(entrada.value);

    var output  = gerarSaida(lista);

    saida.innerHTML = output;
}

function pegarMensagems(entrada){

    var listaMensagens = [];

    var lista = entrada.split("\n");
    for (const linha of lista) {

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
        var pegaTipoResxLabel = pegaTipoLabel(palavra);
        var propriedadeNome = pegaPropriedadeDoLabel(palavra);
        var palavraComEspacos = convertePalavraComEspacos(propriedadeNome);
        var esseLabel = `${pegaTipoResxLabel}${propriedadeNome}Obrigatorio	${palavraComEspacos}\n`;

        output += esseLabel;
    }

    return output;
}

function pegaTipoLabel(palavra){
    
   var saida = retornaPadraoLabel(palavra);

   return removePonto(saida);
}

function retornaPadraoLabel(palavra){
    var saida = retornaPadraoCasoConter(palavra, ".ask");

    if(saida != ""){
        return saida;
    }

    saida = retornaPadraoCasoConter(palavra, ".msg")

    if(saida != ""){
        return saida;
    }
    saida = retornaPadraoCasoConter(palavra, ".label");

    return saida;
}

function retornaPadraoCasoConter(palavra, padrao){
    
    if(palavraContem(palavra, padrao)){
        return padrao;
    }

    return "";
}


function pegaPropriedadeDoLabel(palavraLabel){
    var labelNormalizado = normalizaLabel(palavraLabel);
    
    return labelNormalizado;
}

function convertePalavraComEspacos(propriedadeNome){
    var saida = "";
    for (const letra of propriedadeNome) {
        
        if(ehMaiuscula(letra)){
            saida += " ";
        }

        saida += letra;
    }

    return saida;
}

function apenasLetrasENumeros(entrada){
    return apenasLetras(entrada) && apenasNumeros(entrada);
}

function apenasLetras(entrada){
    return entrada.match("/^[A-Za-z]*$/") != null;
}

function apenasNumeros(entrada){
    return entrada.match("/^[0-9]*$/");
}

function ehPalavraComposta(palavra){

    var contador = 0;
    for (const letra of palavra) {

        if(ehMaiuscula(letra)){
            contador++;
        }
    }

    return contador > 1;
}

function ehMaiuscula(letra) {
    return letra == letra.toUpperCase();
}

function normalizaLabel(palavraLabel){
    
    palavraLabel = removePonto(palavraLabel);
    palavraLabel = removeVirgula(palavraLabel);
    palavraLabel = removePontoVirgula(palavraLabel);
    palavraLabel = removePadroes(palavraLabel);
    return palavraLabel = palavraLabel.replace(".", "");
}

function removeVirgula(palavraLabel){
    return palavraLabel.replace(",", "");
}

function removePadroes(palavraLabel){

    for (const padrao of padroes) {
        const padraoNormalizado = removePonto(padrao);

        if(palavraContem(palavraLabel, padraoNormalizado)){
            palavraLabel = apagarPadraoDaPalavra(palavraLabel, padraoNormalizado);
        }
    }

    return palavraLabel;
}

function apagarPadraoDaPalavra(palavra, padrao){
    return palavra.replace(padrao, "");
}

function palavraContem(palavra, padrao){
    return palavra.indexOf(padrao) != -1;
}

function removePonto(palavraLabel) {
    return palavraLabel.replace(".", "");
}

function removePontoVirgula(palavraLabel) {
    return palavraLabel.replace(";", "");
}
