function copiaAposFormatado(){
    saida.select();
    document.execCommand('copy');
    exibeMensagemCentralizada();
    document.getSelection().empty();
}

document.addEventListener("DOMContentLoaded", function (e){
    tela.addEventListener("change", function (evento){
        btnCarregar.click();
        
        setTimeout(function(){
            if(btnFormatar != undefined){
                btnFormatar.click();
            }
        } , 1000);
    });
})

function primeiraLetraMinuscula(nome){

    var saida = nome[0].toLowerCase();

    saida += nome.substring(1,nome.length);
    return saida;
}

function ehLabelResx(propriedadeFullName){
    return itemDaListaContemNaPalavra(propriedadeFullName, ["ask", "msg", "label"]);
}

function naoEhLabelResx(propriedadeFullName){
    return !ehLabelResx(propriedadeFullName);
}

function getListProps(classe){

    var listaProps = [];

    var linhasClasse = classe.split("\n");

    for(var indice =0 ; indice < linhasClasse.length; indice++){
        var linha = linhasClasse[indice];
        var linha = linha.trimLeft();

        var naoContemPublic = linha.indexOf("public") == -1;
        var contemClass = linha.indexOf("class") != -1;

        if(naoContemPublic || contemClass){
            continue;
        }else{

            var propType = linha.split(" ")[1];
            var propName = linha.split(" ")[2];
            
            if(contemPalavrasInvalidas(propName)){
                continue;
            }
            var itemProp = new Propriedade(propType, propName);

            listaProps.push(itemProp);
        }
    }

    return listaProps;
}

function ehPropriedadeComboBox(propriedadeNome){

    var contemCodigo = propriedadeNome.indexOf("Codigo") != -1;
    var contemDescricao = propriedadeNome.indexOf("Descricao") != -1;

    return contemCodigo || contemDescricao;
}

function contemPalavrasInvalidas(nomePropriedade){
    var listaPalavrasInvalidas = ["explicit"];

    for (const palavraInvalida of listaPalavrasInvalidas) {
        
        const contem = nomePropriedade.indexOf(palavraInvalida) != -1;
        if(contem){
            return true;
        }
    }
    return false;
}

function normalizaNomePropriedade(palavra){
    var lista = ["Codigo","Descricao"];
    return apagaPalavrasNaLista(palavra, lista);
}   

function apagaPalavrasNaLista(palavra, lista){

    for (let indice = 0; indice < lista.length; indice++) {
        const item = lista[indice];
        
        const contemPalavraDaLista = palavra.indexOf(item) != -1;
        if(contemPalavraDaLista){
            palavra = palavra.replace(item, "");
        }
    }

    return palavra;
}

function ehSnProp(nomeProp){
    return nomeProp.indexOf("Sn") != -1;
}

function exibeMensagemCentralizada(){
    var corpo = document.getElementsByTagName('body')[0];

    var div = document.createElement("div");
    div.className = "container-mensagem";
    div.textContent = "Copiado para clipboard!!";
    corpo.appendChild(div)

    setTimeout(function(){
        div.remove();
    }, 700)

}

function nomeContemPercentual(nomePropriedade){
    return nomePropriedade.indexOf("Percentual") != -1;
}

function ehPropriedadeDescricaoComLabelProprio(propriedade){
    return contemDescricao(propriedade) && ehPropriedadeComposta(propriedade);
}

function ehPropriedadeComposta(nomePropriedade){

    const propriedadeEhComposta = contarNumeroLetrasMaiusculas(nomePropriedade) > 1;
    return propriedadeEhComposta;
}

function seContemPropriedadeInPalavraOfListaDePalavras(propriedade, listaPalavras){

    var contem = false;
    for (palavra of listaPalavras){
        const existeMatch = propriedade.indexOf(palavra) != -1;

        if(existeMatch){
            contem = true;
            return contem;
        }

    };

    return contem;
}

function seListaContemMatch(match, listaPalavras){

    var contem = false;
    for (palavra of listaPalavras){
        const existeMatch = encontrouNaPalavra(match, palavra);

        if(existeMatch){
            contem = true;
            return contem;
        }
    };

    return contem;
}

function encontrouNaPalavra(match, palavra) {
    return palavra.indexOf(match) != -1;
}

function listaPropriedadeContemAoMenos2Matchs(listaNomePropriedade, match, nOcorrencias = 2){

    var contador = 0;
    listaNomePropriedade.forEach(propriedade => {
        if(encontrouNaPalavra(match, propriedade))
            contador++;
    });

    return contador >= nOcorrencias;
}

function contemPropriedadesMinimoEMaximo(listaNomePropriedade, nomePropriedade){
    var propriedadeMinimaMaximaNormalizada = normalizaPropMinMax(nomePropriedade);
    const contem2Matchs = listaPropriedadeContemAoMenos2Matchs(listaNomePropriedade, propriedadeMinimaMaximaNormalizada);
    var encontrouAmbasProps = false;

    if(contem2Matchs){
        var encontrouMinimoDaPropriedade = false;
        var encontrouMaximoDaPropriedade = false;

        listaNomePropriedade.forEach( propriedade => {
            if(encontrouNaPalavra(propriedadeMinimaMaximaNormalizada, propriedade)){
                if(ehPropriedadeMinMax(propriedade)){

                    if(ehPropriedadeMinima(propriedade)){
                        encontrouMinimoDaPropriedade = true;
                    }else if(ehPropriedadeMaxima(propriedade)){
                        encontrouMaximoDaPropriedade = true;
                    }

                    if(encontrouMaximoDaPropriedade == encontrouMinimoDaPropriedade)
                        encontrouAmbasProps = true;
                }
            }
        });

    }

    return encontrouAmbasProps;
}

function normalizaPropMinMax(nomePropriedade){
    nomePropriedade = ApagarDaPalavra(nomePropriedade, "Minimo");
    nomePropriedade = ApagarDaPalavra(nomePropriedade, "Min");
    nomePropriedade = ApagarDaPalavra(nomePropriedade, "Maximo");
    nomePropriedade = ApagarDaPalavra(nomePropriedade, "Max");

    return nomePropriedade;
}

function ApagarDaPalavra(nomePropriedade, textoParaApagar) {
    return nomePropriedade.replace(textoParaApagar, "");
}

function ehPropriedadeMinMax(propriedadeNome){
    if(ehPropriedadeMinima(propriedadeNome) || ehPropriedadeMaxima(propriedadeNome))
        return true;

    return false;
}

function ehPropriedadeMaxima(propriedadeNome) {
    return encontrouNaPalavra("Max", propriedadeNome) || encontrouNaPalavra("Maximo", propriedadeNome);
}

function ehPropriedadeMinima(propriedadeNome) {
    return encontrouNaPalavra("Min", propriedadeNome) || encontrouNaPalavra("Minimo", propriedadeNome);
}

function contemId(propriedadeNome){
    return propriedadeNome.indexOf("Id") != -1;
}

function contarNumeroLetrasMaiusculas(nomePropriedade){

    var contador = 0;
    for (let indice = 0; indice < nomePropriedade.length; indice++) {
        const letra = nomePropriedade[indice];

        const letraVersaoMaiuscula = letra.toUpperCase();

        const IsMaiuscula = letra == letraVersaoMaiuscula;
        if(IsMaiuscula){
            contador++;
        }
    }

    return contador;

}

function validField(field){
    return field.value != undefined && field.value.length != "";
}

function contemDescricao(propriedadeNome){
    return propriedadeNome.indexOf("Descricao") != -1;
}

function replaceDescricaoPorCodigo(propriedadeNome){
    return propriedadeNome.replace("Descricao", "Codigo");
}

function Dados(Area,Solution,ControllerName, ClassePrincipal){
    this.Area = Area;
    this.Solution = Solution;
    this.ControllerName = ControllerName;
    this.ClassePrincipal = ClassePrincipal;
    this.Namespace;
    Dados.prototype.Area = () => Area;
    Dados.prototype.Solution = () => Solution;
    Dados.prototype.ControllerName = () => ControllerName;
    Dados.prototype.ClassePrincipal = () => ClassePrincipal;
    Dados.prototype.Namespace = () => this.Namespace;

    Dados.prototype.setNamespace = (namespace) => {
        this.Namespace = namespace;
    }

    Dados.prototype.PreencheCamposDefault = function() {
        var contadorCamposValidos = 0;
        if(validField(controller)){
            this.ControllerName = controller.value;
            contadorCamposValidos++;
        }
        if( validField(area)){
            this.Area = area.value;
            contadorCamposValidos++;
        }
        if(validField(classeNome)){
            this.ClassePrincipal = normalizaClasseName(classeNome.value);
            contadorCamposValidos++;
        }
        if(validField(solucao)){
            this.Solution = solucao.value;
            contadorCamposValidos++;
        }

        if(contadorCamposValidos == 4)
            return true;
        else
            return false;
    }
}

function normalizaClassTOViewModel(nome){
    nome = nome.replace("ViewModel", "");
    nome = nome.replace("TO", "");

    return nome
}

function normalizaClasseName(nome){
    nome = normalizaClassTOViewModel(nome);
    nome = nome.replace("{","");

    return nome;
}

function normalizaClasseNameFilter(nome){
    return nome.replace("Filter", "");
}

function getNamespace(classe){

    var dados = new Dados();
    var linhas = classe.split("\n");
    
    var foiPreenchido = dados.PreencheCamposDefault();
    var naoFoiPreenchido = !foiPreenchido;

    if(naoFoiPreenchido){

        for (let indice = 0; indice < linhas.length; indice++) {
        
            var linha = linhas[indice]; 
            var haNamespace = linha.indexOf("namespace") != -1;
        
            var haClassName = linha.indexOf("class") != -1;
        
            if(haNamespace){
                var linhaNamespace = linha.replace("namespace ", "").trimLeft().split(".");
                var quantidadeRecortes = linhaNamespace.length;

                var indiceControler = quantidadeRecortes-1;
                var indiceArea = indiceControler -2;
                var indiceSolucao = indiceArea - 3;

                var solutionName = linhaNamespace[indiceSolucao];
                var areaName = linhaNamespace[indiceArea];
                var controllerName = linhaNamespace[indiceControler];
        
                if(areaName == undefined){
                    areaName = area.value;
                }

                dados.Area = areaName;

                if(solutionName == undefined){
                    solutionName = solucao.value;
                }
                dados.Solution = solutionName;

                if(controllerName == undefined){
                    controllerName = controller.value;
                }

                dados.ControllerName = normalizeString(controllerName).replace("{", "");
        
            }else if(haClassName){
                var mainClassName = linha.trimLeft().split(" ")[2];
                dados.ClassePrincipal = normalizaClasseName(mainClassName);
                return dados;
            }
        }
    }
    
    return dados;
}
 
function getNomesListaPropriedades(listaPropriedades){
    var listaSaida = [];

    listaPropriedades.forEach(propriedade => {
        listaSaida.push(propriedade.nome);
    });

    return listaSaida;
}

function Tipo(tipo, nome){
    this.decimalNullAble = "decimal?";
    this.decimal = "decimal";
    this.intNullAble = "int?";
    this.string = "string";
    this.int = "int";
    this.bool = "bool";
    this.datetime = "DateTime"; 
    this.datetimeNullable = "DateTime?";
    
    Tipo.prototype.decimalNullAble = () => this.decimalNullAble;
    Tipo.prototype.intNullAble = () => this.intNullAble;
    Tipo.prototype.string = () => this.string;
    Tipo.prototype.int = () => this.int;
    Tipo.prototype.bool = () => this.bool;
    Tipo.prototype.datetime = () => this.datetime;
    Tipo.prototype.datetimeNullable = () => this.datetimeNullable;
}

function TipoTS(){
    this.decimalNullAble = "number";
    this.decimal = "number"
    this.intNullAble = "number";
    this.string = "string";
    this.int = "number";
    this.bool = "boolean";
    this.datetime = "Date"; 
    this.datetimeNullable = "Date";
    
    Tipo.prototype.decimalNullAble = () => this.decimalNullAble;
    Tipo.prototype.decimal = () => this.decimal;
    Tipo.prototype.intNullAble = () => this.intNullAble;
    Tipo.prototype.string = () => this.string;
    Tipo.prototype.int = () => this.int;
    Tipo.prototype.bool = () => this.bool;
    Tipo.prototype.datetime = () => this.datetime;
    Tipo.prototype.datetimeNullable = () => this.datetimeNullable;
}

var TiposCSharp = {
    decimalNullAble : "decimal?",
    intNullAble : "int?",
    string : "string",
    int : "int",
    bool: "bool",
}

function Propriedade(tipo, nome){
    this.tipo = tipo;
    this.nome = nome;

    Propriedade.prototype.Tipo = () => this.tipo;
    Propriedade.prototype.Nome = () => this.nome;
}
