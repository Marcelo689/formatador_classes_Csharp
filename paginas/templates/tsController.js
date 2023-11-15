function gerarTsController(){
    var output = "";
    var listaPropriedades = getListProps(entrada.value);

    var nomeClasse = `class ControleRegulagemLinhaDestala {\n`;

    output += nomeClasse;
    
    listaPropriedades.forEach( propriedade => output += retornaTsProp(propriedade.nome, propriedade.tipo));

    output += "}\n";
    saida.innerHTML = output;
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

    return `    public ${propriedadeNome}: ${descricao};\n`;

}


function gerarClasseIndexController(){
    var headerClasse = ` class IndexController {
        public getParamsUpdate${controllerName}(e: any) {
    `;

    var classeAndPropriedadesInstaciadas = `
            var modelo = new ${classeName}();
            modelo.${propriedadeNome} = $("#${propriedadeNome}").val();
            
            return modelo;
        }
        public getParamsInsert${controllerName}(e: any) {
            
        }
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

    var controller = new IndexController();

    Functions.getParamsRead${controllerName} = (isso, id) => controller.getParamsRead${controllerName}(isso, id);
    Functions.getParamsInsert${controllerName} = (e) => controller.getParamsInsert${controllerName}(e);
    Functions.getParamsUpdate${controllerName} = (e) => controller.getParamsUpdate${controllerName}(e);
    Events.detailInit${controllerName}Grid = (e) => controller.detailInit${controllerName}Grid(e);`
}