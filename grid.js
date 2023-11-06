var classe = document.getElementById("entrada");


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

        int numeroColunas = 10;
        var larguraPorColuna = 100 / numeroColunas;
        var percentualLargura = larguraPorColuna.ToString() + "%";
    }

    @(Html.Kendo().Grid<${nomeReduzidoClasse}ViewModel>()
        .Name(GRID_NAME)
        .Pageable(pageable => pageable.
        PageSizes( new int[]{ tamanhoPaginaInicial, tamanhoPaginaInicial *2 , tamanhoPaginaInicial * 3})
        )
    .Columns(cols =>
    {`;
    var colunas = RetornaColumns(classeCompleta);
    grid += colunas;
    grid += `\n         //cols.Command(command =>
                        //{
        //command.Edit();
        //command.Destroy();
    //}).Width(200);
   
    })
    .DataSource(dataSource => dataSource
    .Ajax()
    .PageSize(tamanhoPaginaInicial)
    .Read(read => read.Action("Read${controllerName}", CONTROLLER_NAME, AREA).Data("Functions.getParamsRead${nomeReduzidoClasse}(this, "+Model+")"))
    .Events( ev => {
        ev.RequestStart("OpenLoadingWindow");
        ev.RequestEnd("CloseLoadingWindow");
    })
    ).Events( ev =>
    {
        ev.DetailInit("Events.detailInitInner${nomeReduzidoClasse}Grid");
    })
    )

<script>
    Variables.detailInitInner${nomeReduzidoClasse}Grid = '@Url.Action("${nomeReduzidoClasse}InnerTabStripDetailInit", CONTROLLER_NAME, AREA)';
</script>
    `;
    saida.innerHTML = grid;
    
    copiaAposFormatado();
}

function geraColunaGrid(nomePropriedade, tipoPropriedade, largura = "percentualLargura"){

    //var biblioteca = ["int", "DateTime", "int?", "decimal", "string", "static"];
    var estiloColunaCentralizada = "estiloColunaCentralizada";
    console.log(tipoPropriedade);
    var saida = `\n          cols.Bound(c => c.${nomePropriedade})`;
    var estiloColuna = estiloColunaCentralizada;

    if(tipoPropriedade == "static"){
        return "";
    }

    if(tipoPropriedade == "string"){
        estiloColuna = "estiloColunaString";
    }else if(tipoPropriedade == "int"){
        estiloColuna = "estiloColunaInteira";
    }else if(tipoPropriedade == "DateTime"){
        estiloColuna = estiloColunaCentralizada;
        saida += `.Format("{0:G}")`;
    }else if(tipoPropriedade == "int?"){
        estiloColuna = estiloColunaCentralizada;
    }


    saida += `
                        .Width(${largura})
                        .Editable("Functions.naoEditavel")
                        .HeaderHtmlAttributes(${estiloColuna})
                        .HtmlAttributes(${estiloColuna});`;

    return saida;
}

function contemPalavrasIndesejadas(palavra, palavrasIndesejadas){

    var listaPalavrasExcluidas = ["id", "class"];

    listaPalavrasExcluidas.forEach(palavra => {
        var indice = palavra.indexOf("")
    });
}

function RetornaColumns(classe){
    var saida = "";

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

            var larguraColuna = 60;
            saida +=  geraColunaGrid(nomePropriedade, tipoPropriedade) + "\n" ;
        }

    }
    
    return saida;
}

function RetornaColunasGrid(){
    var entradaString = entrada.value;

    const entradaContemValor =  entradaString != undefined;

    if(entradaContemValor){
        var saida = document.getElementById("saida");
        saida.innerHTML = RetornaColumns(entradaString);
    }
}
