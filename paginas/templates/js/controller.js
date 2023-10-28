function retornaTiposUnique(lista){

    var listaTipos = [];
    lista.forEach( item => {
        var tipo = item.tipo;
        var naoIncluiTipo = !listaTipos.includes(tipo);

        if(naoIncluiTipo){
            listaTipos.push(tipo);
        } 
    });

    return listaTipos;
}

function gerarMetodosValidar(listaPropriedades, dados){
    
    var tiposContidos = retornaTiposUnique(listaPropriedades);
    var Tipos = new Tipo();
    var saida = "";

    if(tiposContidos.includes(Tipos.string)){
        saida += `
        \n      private void ValidaStringDoViewModel(string texto, string mensagemEhNulo, bool contemValidacaoTamanhoMaximo = true, int tamanhoMaximo = 0, string mensagemTamanhoMaximo = "")
        {
            if (string.IsNullOrWhiteSpace(texto))
            {
                this.ModelState.AddModelError(string.Empty, mensagemEhNulo);
            }
            else if (contemValidacaoTamanhoMaximo && texto.Length > tamanhoMaximo)
            {
                this.ModelState.AddModelError(string.Empty, mensagemTamanhoMaximo);
            }
        }\n
        `;
    }

    if(tiposContidos.includes(Tipos.intNullAble)){
        saida += `
        \n      private void ValidaIntNullableLookUpObrigatorioViewModel(int? numeroNullAble, string mensagemObrigatorio)
        {
            if (!numeroNullAble.HasValue)
            {
                this.ModelState.AddModelError(string.Empty, mensagemObrigatorio);
            }
        }\n
        `;
    }

    if(tiposContidos.includes(Tipos.decimalNullAble)){
        saida += `
        \n      private void ValidaDecimalMinMax(decimal? min, decimal? max, string mensagemValorMinMaior)
        {
            bool valoresNaoPreenchidos = !(min.HasValue && max.HasValue);
            if (valoresNaoPreenchidos)
            {
                return;
            }

            bool valorMinimoMaior = min.Value > max.Value;
            if (valorMinimoMaior)
            {
                this.ModelState.AddModelError(string.Empty, mensagemValorMinMaior);
            }

        }\n
        `;
    }

    saida += gerarValidacaoModel(listaPropriedades, dados.ClassePrincipal, dados.Area, dados.ControllerName);

    return saida;
}

function gerarValidacaoModel(listaPropriedades, nomeClassePrincipal, areaName, controllerName){

    var saida = `private void ValidarModel(${nomeClassePrincipal}ViewModel viewmodel){\n`;

    var tipo = new Tipo();

    for (let indice = 0; indice < listaPropriedades.length; indice++) {
        const propriedade = listaPropriedades[indice];

        switch (propriedade.tipo) {
            case tipo.string:
                
                saida += "\n";
                saida += `
            ValidaStringDoViewModel(
                texto: viewmodel.${propriedade.nome},
                mensagemEhNulo: App_GlobalResources.${areaName}.${controllerName}.msgCampo${propriedade.nome}Obrigatorio,
                tamanhoMaximo: 50,
                mensagemTamanhoMaximo: App_GlobalResources.${areaName}.${controllerName}.msgCampo${propriedade.nome}TamanhoMaximo
            );\n`;

                break;
            case tipo.intNullAble:

                saida += "\n";
                saida += `
            ValidaIntNullableLookUpObrigatorioViewModel(
                numeroNullAble: viewModel.${propriedade.nome},
                mensagemObrigatorio: App_GlobalResources.${areaName}.${controllerName}.msgCampo${propriedade.nome}Obrigatorio
            );\n`;

                break;
            // case tipo.decimalNullAble:

            //     saida += "\n";
            //     saida += `
            //     ValidaDecimalMinMax(
            //         min: viewModel.PrecoMinimo,
            //         max: viewModel.PrecoMaximo,
            //         mensagemValorMinMaior: App_GlobalResources.Cadastros.CadastrarPoliticaNegociacaoCompra.msgPrecoMinMaior
            //     );\n`;

            //     break;
            default:
                break;
        }
    }
    saida += "      }\n";

    return saida;
}

function getNamespace(classe){

    var dados = new Dados();
    var linhas = classe.split("\n");

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
            dados.ControllerName = controllerName.replace("{", "");

        }else if(haClassName){
            var mainClassName = linha.trimLeft().split(" ")[2];
            dados.ClassePrincipal = mainClassName;
            return dados;
        }
        
    }

    return dados;
}

function normalizaClasseName(nome){
    return nome.replace("ViewModel", "").replace("TO", "").replace("{","");
}

function gerarArquivoController(){
    var classeConteudo = entrada.value;
    var dados = getNamespace(classeConteudo);
    dados.ClassePrincipal = normalizaClasseName(dados.ClassePrincipal);

    var areaName = dados.Area;
    var controllerName = dados.ControllerName;
    var solutionName = dados.Solution;
    var classeName = dados.ClassePrincipal;
    
    var listaPropriedades = getListProps(classeConteudo);

    var textoSaida = "";

    textoSaida += geraNamespace(solutionName, areaName, controllerName);
    textoSaida += gerarControlador(controllerName);
    textoSaida += gerarRead(controllerName, classeName);
    textoSaida += gerarInsert(controllerName, classeName);
    textoSaida += gerarMetodosValidar(listaPropriedades, dados);
    textoSaida += fecharArquivo();

    saida.value = textoSaida;
    
    copiaAposFormatado();
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

            var itemProp = new Propriedade(propType, propName);

            listaProps.push(itemProp);
        }
    }

    return listaProps;
}

function geraNamespace(solutionName, areaName, controllerName){
    var texto = `
using Universal.Web.Mvc.Extensions;
using Universal.Web.Telerik.Mvc5.Extensions;

namespace Universal.Tois.${solutionName}.Web.Areas.${areaName}.Controllers
{
    #if !DEBUG
        [Authorize( Roles = "${controllerName}" )]
    #endif
    `;

    return texto;
}

function gerarControlador(NomeController){  
    var arquivoControllador =  
        `\n
    public class ${NomeController}Controller : ToisController {\n

        public I${NomeController}AppService i${NomeController}AppService { get;}

        public ${NomeController}Controller(I${NomeController}AppService i${NomeController}AppService)
        {
            i${NomeController}AppService = i${NomeController}AppService;
        }

        public ActionResult Index(){
            return View();
        }
    `

    return arquivoControllador;
}

function gerarRead(controllerName, classeName){

    var texto = `
        public JsonResult Read${classeName}([DataSourceRequest] DataSourceRequest request, ${controllerName}FilterViewModel filtrosViewModel)
        {
            ${controllerName}FilterViewModelTO filtrosTO = (${controllerName}FilterViewModelTO) filtrosViewModel;

            filtrosTO.PagingParameterTO = new PagingParameterTO(request.Page, request.PageSize);

            TratarModelo(filtrosTO);

            ValidationResult<PagingResult<${controllerName}ViewModel>> validationResultViewModel = new ValidationResult<PagingResult<${controllerName}ViewModel>>();
            validationResultViewModel.Result = new PagingResult<${controllerName}ViewModel>();
            ValidationResult<PagingResult<${controllerName}TO>> validationPaging${controllerName}TO = i${controllerName}AppService.GetLista${controllerName}(filtrosTO);
            IEnumerable<${controllerName}TO> lista${controllerName}TO = validationPaging${controllerName}TO.Result.DataSource;

            bool sucessoAoBuscarDados = validationPaging${controllerName}TO.IsValid;
            if (sucessoAoBuscarDados)
            {
                bool listaPreenchida = listaNegociacaoTO != null;
                if (listaPreenchida)
                {
                    validationResultViewModel.Result.DataSource = lista${controllerName}TO.Select(to => (${controllerName}ViewModel) to).ToList();
                    validationResultViewModel.Result.Total = validationPagingPolitica${controllerName}TO.Result.Total;
                }
                else
                {
                    validationResultViewModel.ValidationResultToModelState(ModelState);
                }
            }

            return Json(validationResultViewModel.ToDataSourceResult(request, ModelState), JsonRequestBehavior.AllowGet);
        }`;

    return texto;
}
    
function gerarInsert(controllerName, classeName){
    var texto = `
        public JsonResult Inserir${classeName}([DataSourceRequest] DataSourceRequest request, ${controllerName}ViewModel viewModel)
        {
            ${controllerName}TO to = (${controllerName}TO) viewModel;
            ValidarModelTO(to);

            if (ModelState.IsValid)
            {
                ValidationResult validation = i${controllerName}AppService.Inserir${controllerName}(to);

                bool fracassoAoInserir = !validation.IsValid;
                if (fracassoAoInserir)
                {
                    validation.ValidationResultToModelState(this.ModelState);
                }
                else
                {
                    viewModel = (${controllerName}ViewModel) to;
                }
            }

            return Json(new[] { viewModel }.ToDataSourceResult(request, this.ModelState));
        }
    `

    return texto;
}
  
function fecharArquivo(){
    var textoSaida = "}\n}";
    return textoSaida;
}