var classe = document.getElementById("entrada");

var numeroColunasTotal = 0;

function CriarGrid(){
    var classeCompleta     = entrada.value;   
    
    var dados = getNamespace(entrada.value);
    dados.PreencheCamposDefault();

    var nomeReduzidoClasse = normalizaClasseName(dados.ClassePrincipal);
    var controllerName     = dados.ControllerName;
    var areaName           = dados.Area; 

   var grid =  `
    @using Universal.Tois.${dados.Solution}.Web.Areas.${dados.Area}.Models.${dados.ControllerName}
    @model int
    @{
        const string CONTROLLER_NAME = "${controllerName}";
        string GRID_NAME = CONTROLLER_NAME + "Grid" + Model.ToString();
        object AREA = "${areaName}";
        var estiloColunaInteira = new { style = "text-align:right" };
        var estiloColunaString = new { style = "text-align:left" };
        var estiloColunaCentralizada = new { style = "text-align:center" };

        var tamanhoPaginaInicial = 10;

        int numeroColunas = DigiteONumeroDeColunas;
        var larguraPorColuna = 100 / numeroColunas;
        var percentualLargura = larguraPorColuna.ToString() + "%";
    }

    <style>
        .k-grid .k-grid-header .k-header .k-link {
            height: auto;
        }

        .k-grid .k-grid-header .k-header {
            white-space: normal;
        }
    </style>

    @(Html.Kendo().Grid<${nomeReduzidoClasse}ViewModel>()
        .Name(GRID_NAME)
        .HtmlAttributes( new { @class = "gridStyle"})
        .Pageable(pageable => pageable.
        PageSizes( new int[]{ tamanhoPaginaInicial, tamanhoPaginaInicial *2 , tamanhoPaginaInicial * 3})
        )
    .Columns(cols =>
    {`;
    grid = RetornaColumns(classeCompleta, grid);
    grid += `\n         
    })
    .DataSource(dataSource => dataSource
    .Ajax()
    .Model( e => e.Id( f => f.Id))
    .PageSize(tamanhoPaginaInicial)
    .Read(read => read.Action("Read${nomeReduzidoClasse}", CONTROLLER_NAME, AREA).Data("Functions.getParamsRead${nomeReduzidoClasse}(this, "+Model+")"))
    .Events( ev => {
        ev.RequestStart("OpenLoadingWindow");
        ev.RequestEnd("CloseLoadingWindow");
    })
    ).Events( ev =>
    {
        ev.DetailInit("Events.detailInit${nomeReduzidoClasse}Grid");
    })
    )

<script>
    Variables.urlDetailInit${nomeReduzidoClasse}Grid = '@Url.Action("${nomeReduzidoClasse}DetailInit", CONTROLLER_NAME, AREA)';
</script>
    `;
    saida.innerHTML = grid;
    
    copiaAposFormatado();
}

function geraColunaGrid(nomePropriedade, tipoPropriedade, largura = "percentualLargura"){

    //var biblioteca = ["int", "DateTime", "int?", "decimal", "string", "static"];
    var estiloColunaCentralizada = "estiloColunaCentralizada";
    var estiloColunaInteira = "estiloColunaInteira";
    var estiloColunaString = "estiloColunaString"
    var saida = `\n          cols.Bound(c => c.${nomePropriedade})`;

    if(ehSnProp(nomePropriedade)){
        saida = `\n          cols.ForeignKey(c => c.${nomePropriedade}, (System.Collections.IEnumerable)this.ViewData["SNDataSource"], "Value", "Text")`;
    }

    var estiloColuna = estiloColunaCentralizada;

    if(tipoPropriedade == "static"){
        return "";
    }

    if(tipoPropriedade == "decimal" || tipoPropriedade == "decimal?"){
        estiloColuna = estiloColunaInteira;
        saida += `.Format("{0:n2}")`;
    }else
    if(tipoPropriedade == "string"){
        estiloColuna = estiloColunaString;
    }else if(tipoPropriedade == "int"){
        estiloColuna =  estiloColunaInteira;
    }else if(tipoPropriedade == "DateTime"){
        estiloColuna = estiloColunaCentralizada;
        saida += `.Format("{0:G}")`;
    }else if(tipoPropriedade == "int?"){
        estiloColuna = estiloColunaCentralizada;
        saida += `.ClientTemplate("#=${nomePropriedade.replace("Codigo", "")}Descricao#")`
    }

    saida += `
                        .Width(${largura})
                        .HeaderHtmlAttributes(${estiloColuna})
                        .HtmlAttributes(${estiloColuna});`;

                        numeroColunasTotal++;
    return saida;
}

function RetornaColumns(classe, grid){
    var saida = "";

    numeroColunasTotal = 0;

    var listaPalavrasExcluidas = ["Id", "Descricao"];
    var linhas = classe.split("\n");
    
    for (let index = 0; index < linhas.length; index++) {

        var linha = linhas[index];

        var contemPublic = linha.indexOf("public") != -1;

        if(contemPublic){
            var indicePublic = linha.indexOf("public");

            var contemClass =linha.indexOf("class") != -1;

            if(contemClass){
                continue;
            }

            var nomePropriedade = linha.substr(indicePublic).split(" ")[2];
            var tipoPropriedade = linha.substr(indicePublic).split(" ")[1];

            const ehPalavraComposta = ehPropriedadeComposta(nomePropriedade);
            const propriedadeNaoSeUsaNaGrid = sePropriedadeContemPalavra(nomePropriedade, listaPalavrasExcluidas);

            if(propriedadeNaoSeUsaNaGrid)
                continue;

            const contemPalavraDescricao = nomePropriedade.indexOf("Descricao") != -1;
            if(ehPalavraComposta && contemPalavraDescricao)
                continue;

            saida +=  geraColunaGrid(nomePropriedade, tipoPropriedade) + "\n" ;
        }

    }
    
    grid = grid.replace("DigiteONumeroDeColunas", numeroColunasTotal);
    grid += saida;
    return grid;
}

function RetornaColunasGrid(){
    var entradaString = entrada.value;

    const entradaContemValor =  entradaString != undefined;

    if(entradaContemValor){
        var saida = document.getElementById("saida");
        saida.innerHTML = RetornaColumns(entradaString);
    }
}
