function copiaAposFormatado(){
    saida.select();
    document.execCommand('copy');
    exibeMensagemCentralizada();
    document.getSelection().empty();
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
        
        if(validField(controller)){
            this.ControllerName = controller.value;
        }
        if( validField(area)){
            this.Area = area.value;
        }
        if(validField(classeNome)){
            this.ClassePrincipal = classeNome.value;
        }
        if(validField(solucao)){
            this.Solution = solucao.value;
        }
    }
}

function getNamespace(classe){

    var dados = new Dados();
    var linhas = classe.split("\n");
    
    dados.PreencheCamposDefault();

    for (let indice = 0; indice < linhas.length; indice++) {
    
        var linha = linhas[indice]; 
        var haNamespace = linha.indexOf("namespace") != -1;
    
        var haClassName = linha.indexOf("class") != -1;
    
        if(haNamespace){
            var linhaNamespace = linha.trimLeft().split(".");
    
            var solutionName = linhaNamespace[0].split(" ")[1];
            var areaName = linhaNamespace[3];
            var controllerName = linhaNamespace[5];
    
            dados.Area = areaName;
            dados.Solution = solutionName;
            dados.ControllerName = normalizeString(controllerName).replace("{", "");
    
        }else if(haClassName){
            var mainClassName = linha.trimLeft().split(" ")[2];
            dados.ClassePrincipal = mainClassName;
            return dados;
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
