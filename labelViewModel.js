function normalizeString(data){
    if(data == undefined){
        return "";
    }

    return data;
}

var classe = document.getElementById("entrada");

function retornaCaminhoDataType(tipoVariavel){
    const caminhoTemplate = "Kendo\\";
    const TypeTemplate = {
        string : "String",
        decimal: "Decimal_6_2",
        int : "Integer",
        Datetime : "Datetime",
    };

    const DataType = `[DataType("${caminhoTemplate}${TypeTemplate[typeof(tipoVariavel)]}")]`;

    return DataType;
}

function formataAnnotation(solutionName,areaName, controllerName, propertyName){
    return `\n      [Display(ResourceType = typeof(Universal.Tois.${solutionName}.Web.App_GlobalResources.${areaName}.${controllerName}),
        Name = nameof(Universal.Tois.${solutionName}.Web.App_GlobalResources.${areaName}.${controllerName}.label${propertyName}))]`
}

function ignorarLinhaCasoConterPalavrasChave(linha){

    var listaPalavrasExcluidas = [ "[Display(","nameof(", "typeof("];

    return contemNaLista(linha, listaPalavrasExcluidas);
}

function contemPalavrasIndesejadas(palavra){

    var listaPalavrasExcluidas = ["Id","TO", "class"];
    return contemNaLista(palavra, listaPalavrasExcluidas);
}

function contemNaLista(palavra, lista){
    for (let index = 0; index < lista.length; index++) {
        const item = lista[index];

        if(item == "TO"){

            var contemTO = palavra.indexOf(item) != -1;
            if(contemTO)
                return true;            
        }else

        if(palavra.toLowerCase().indexOf(item.toLowerCase()) != -1){
            return true;
        }
    }

    return false;
}

function casoEncontrarXIgnorarAteProximoY(linha, condicaoParada, nVezes, encontradosNVezes){
    var linhaContemCondicao = linha.indexOf(condicaoParada) != -1;

    if(linhaContemCondicao){
        encontradosNVezes++
    }

    return encontradosNVezes;
}

function encontraIndiceUltimoCaractere(textoClasse){
    for (let index = textoClasse.length; index > 0; index--) {
        const element = textoClasse[index];

        if(element != " " && element != "\n"){
            return index;
        }
    }

    return -1;
}

function retornaPropriedadeComDataAnotation(classe){

    var dados = getNamespace(classe);

    dados.PreencheCamposDefault();

    var nomeSolucao = dados.Solution;
    var nomeArea = dados.Area;
    var nomeController = dados.ControllerName;
    var listaPropriedades = [];
    
    var nomeClasse = dados.ClassePrincipal;

    var saida = `using System.ComponentModel.DataAnnotations;
    using Universal.Tois.${nomeSolucao}.Dto.${normalizaClasseNameFilter(nomeClasse)};\n`;
    var explicitOperador = "public static explicit operator";

    var indiceUltimo = encontraIndiceUltimoCaractere(classe);
    var texto = classe.substring(0, indiceUltimo);
    var linhas = texto.trimEnd().split("\n");

    var encontradosNVezes = 0;
    var numeroNDesejaEncontrar = 2;
    var estaIgnorandoLinhas = false;

    for (let index = 0; index < linhas.length; index++) {

        var linha = linhas[index];

        if(ignorarLinhaCasoConterPalavrasChave(linha)){
            continue;
        }

        var linhaContemExplicitCast = linha.indexOf(explicitOperador) != -1;
        if(linhaContemExplicitCast || estaIgnorandoLinhas){
            estaIgnorandoLinhas = true;
            encontradosNVezes = casoEncontrarXIgnorarAteProximoY(linha, "}", numeroNDesejaEncontrar , encontradosNVezes);
        }

        if(encontradosNVezes == numeroNDesejaEncontrar){
            estaIgnorandoLinhas = false;
            encontradosNVezes = 0;
            continue;
        }

        if(estaIgnorandoLinhas){
            continue;
        }
        var contemPublic = linha.indexOf("public") != -1;

        if(contemPublic){
            var indicePublic = linha.indexOf("public");
            var contemClass = linha.indexOf("class") != -1;
            
            if(contemClass){
                linha = normalizaClasseName(linha);
                nomeClasse = linha.trimLeft().split(" ")[2].replace("{","");
                nomeClasse = nomeClasse.replace("TO","ViewModel");
                saida += "\n" + linha.replace("TO","ViewModel") + "ViewModel" + "\n";
                continue;
            }

            var nomePropriedade = linha.substr(indicePublic).split(" ")[2];
            listaPropriedades.push(nomePropriedade);

            if(!contemPalavrasIndesejadas(nomePropriedade)){
                saida +=  formataAnnotation(nomeSolucao, nomeArea, nomeController, nomePropriedade) + "\n" ;
            }else{
                saida += "\n";
            }
            linha += "\n";
        }

        if(index == linhas.length -2){
            saida += gerarExplictCast(nomeClasse, listaPropriedades);
            saida += "\n\n";
            saida += gerarExplictCastTO(nomeClasse, listaPropriedades);
        }
        saida += linha;
    }
    
    return saida;
}

function gerarExplictCast(nomeClasse, listaPropriedades){
    var explicitoCast =  `\n        public static explicit operator ${nomeClasse}ViewModel(${nomeClasse.replace("ViewModel","")}TO to)
        {
            return new ${nomeClasse}ViewModel{\n`;
    var propriedadesCast = "";
                
    for (const propriedade of listaPropriedades) {
        
        propriedadesCast += `                ${propriedade} = to.${propriedade},\n`
    }
        explicitoCast += propriedadesCast +`            };
        }\n`;

    return explicitoCast;
}

function gerarExplictCastTO(nomeClasse, listaPropriedades){
    var explicitoCast =  `\n        public static explicit operator ${nomeClasse}TO(${nomeClasse.replace("ViewModel","")}ViewModel to)
        {
            return new ${nomeClasse}TO{\n`;
    var propriedadesCast = "";
                
    for (const propriedade of listaPropriedades) {
        
        propriedadesCast += `                ${propriedade} = to.${propriedade},\n`
    }
        explicitoCast += propriedadesCast +`            };
        }\n`;

    return explicitoCast;
}

function RetornaDataAnotations(){
    var entradaString = entrada.value;

    const entradaContemValor =  entradaString != undefined;

    if(entradaContemValor){
        var saida = document.getElementById("saida");
        saida.innerHTML = retornaPropriedadeComDataAnotation(entradaString);
        copiaAposFormatado();
    }
}