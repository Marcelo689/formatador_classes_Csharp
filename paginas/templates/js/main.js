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

function ehPropriedadeComposta(nomePropriedade){

    const propriedadeEhComposta = contarNumeroLetrasMaiusculas(nomePropriedade) > 1;
    return propriedadeEhComposta;
}

function sePropriedadeContemPalavra(propriedade, listaPalavras){

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

function Dados(Area,Solution,ControllerName, ClassePrincipal){
    this.Area = Area;
    this.Solution = Solution;
    this.ControllerName = ControllerName;
    this.ClassePrincipal = ClassePrincipal;

    Dados.prototype.Area = () => Area;
    Dados.prototype.Solution = () => Solution;
    Dados.prototype.ControllerName = () => ControllerName;
    Dados.prototype.ClassePrincipal = () => ClassePrincipal;

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
 
function Tipo(tipo, nome){
    this.decimalNullAble = "decimal?";
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
