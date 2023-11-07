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


function existeMatchNaLista(palavra, listaMatch){
        
    for (let indice = 0; indice < listaMatch.length; indice++) {
        const element = listaMatch[indice];

        const contemPalavra = palavra.indexOf(element) != -1;
        if(contemPalavra){
            return true;
        }
        
    }

    return false;
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

function normalizaClasseName(nome){
    nome = nome.replace("ViewModel", "");
    nome = nome.replace("TO", "");
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

    Tipo.prototype.decimalNullAble = () => this.decimalNullAble;
    Tipo.prototype.intNullAble = () => this.intNullAble;
    Tipo.prototype.string = () => this.string;
    Tipo.prototype.int = () => this.int;
    Tipo.prototype.bool = () => this.bool;
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
