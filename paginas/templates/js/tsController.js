function gerarTsController(){

    var dados = getNamespace(entrada.value);
    dados.PreencheCamposDefault();
    var output = "";
    var listaPropriedades = getListProps(entrada.value);

    var nomeClasse = `
    
    module Universal.Tois.${dados.Solution}.Web.Scripts.${dados.ControllerName}{
        class ${dados.ClassePrincipal} {\n`;

    output += nomeClasse;
    
    listaPropriedades.forEach( propriedade => output += retornaTsProp(propriedade.nome, propriedade.tipo));

    output += "     }";
    saida.innerHTML = output;
    saida.innerHTML += gerarClasseIndexController(listaPropriedades, dados.ClassePrincipal, dados.ControllerName)
    copiaAposFormatado();
}

function retornaTsProp(propriedadeNome, propriedadeTipo){
    var tipoTs = new TipoTS();
    var tipo = new Tipo(); 
    var descricao = "";
    switch(propriedadeTipo){
        case tipo.bool:
            descricao = tipoTs.bool;
            break;
        case tipo.datetime:
            descricao = tipoTs.datetime;
            break;
        case tipo.datetimeNullable:
            descricao = tipoTs.datetimeNullable;
            break;
        case tipo.decimal:
            descricao = tipoTs.decimal;
            break;
        case tipo.decimalNullAble:
            descricao = tipoTs.decimalNullAble;
            break;
        case tipo.int:
            descricao = tipoTs.int;
            break;
        case tipo.intNullAble:
            descricao = tipoTs.intNullAble;
            break;
        case tipo.string:
            descricao = tipoTs.string;
            break;
        default:
            descricao = tipoTs.string;
            break;
    }

    return `            public ${propriedadeNome}: ${descricao};\n`;

}

function gerarClassePropriedadesInstancia(listaPropriedades){

    var saida = "";
    listaPropriedades.forEach( propriedade => {
        saida += `
                e.model.${propriedade.nome} = `;

        if(ehPropriedadeComboBox(propriedade.nome)){
            if(contemDescricao(propriedade.nome)){
                saida += `kendo.Util.Combo.getText("${replaceDescricaoPorCodigo(propriedade.nome)}");`
            }else{
                saida += `kendo.Util.Combo.getValue("${propriedade.nome}");`;
            }
        }else{
            saida += `$("#${propriedade.nome}").val();`;
        }
        
    });

    return saida;
}

function gerarClasseIndexController(listaPropriedades, classeName, controllerName){

    var indexController = ``;

    var headerClasse = `
    class IndexController {
    `;

    var onSave = `
        public onSave${controllerName}(e: any) {
            `;
            onSave += gerarClassePropriedadesInstancia(listaPropriedades);

            onSave +=
            `
        }`;
        
    var detailInit = `
        public detailInit${classeName}Grid(e: any) {

            var modelo : any = e.data;
            $.ajax({
                method: "post",
                url: Variables.urlDetailInit${classeName}Grid,
                data: { id: modelo.Id },
                success: function (partialView) {
                    e.detailCell.attr("colspan", (e.sender.columns.length.toString()));
                    e.detailCell.html(partialView);
                }
            })
        }

        `;
        
    var gridMethods = `
        public instanciarGrid(id: number) {
            this.grid = $("#${controllerName}" + id.toString()).data("kendoGrid");
        }

        public grid: kendo.ui.Grid;

        public getParamsRead${controllerName}(e: any, id: number) {
            return {
                Id: id
            };
        }

    }
    `;
    
    var EventsFunctions = `
    var controller = new IndexController();

    Functions.getParamsRead${controllerName} = (isso, id) => controller.getParamsRead${controllerName}(isso, id);
    Events.onSave${controllerName} = (e) => controller.onSave${controllerName}(e);
    Events.detailInit${controllerName}Grid = (e) => controller.detailInit${controllerName}Grid(e);
    
}`;
    
    indexController += headerClasse;
    indexController += onSave;
    indexController += detailInit;
    indexController += gridMethods;
    indexController += EventsFunctions;

    return indexController;
}