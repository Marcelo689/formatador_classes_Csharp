
using Universal.Web.Mvc.Extensions;
using Universal.Web.Telerik.Mvc5.Extensions;

namespace Universal.Tois.Fabrica.Web.Areas.Operacoes.Controllers
{
#if !DEBUG
    [Authorize(Roles = "CadastrarTemplate")]
#endif


    public class CadastrarTemplateController : ToisController
    {


        public ICadastrarTemplateAppService iCadastrarTemplateAppService { get; }

        public CadastrarTemplateController(ICadastrarTemplateAppService iCadastrarTemplateAppService)
        {
            iCadastrarTemplateAppService = iCadastrarTemplateAppService;
        }

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult ReadTemplate([DataSourceRequest] DataSourceRequest request, CadastrarTemplateFilterViewModel filtrosViewModel)
        {
            CadastrarTemplateFilterViewModelTO filtrosTO = (CadastrarTemplateFilterViewModelTO)filtrosViewModel;

            filtrosTO.PagingParameterTO = new PagingParameterTO(request.Page, request.PageSize);

            TratarModelo(filtrosTO);

            ValidationResult<PagingResult<CadastrarTemplateViewModel>> validationResultViewModel = new ValidationResult<PagingResult<CadastrarTemplateViewModel>>();
            validationResultViewModel.Result = new PagingResult<CadastrarTemplateViewModel>();
            ValidationResult<PagingResult<CadastrarTemplateTO>> validationPagingCadastrarTemplateTO = iCadastrarTemplateAppService.GetListaCadastrarTemplate(filtrosTO);
            IEnumerable<CadastrarTemplateTO> listaCadastrarTemplateTO = validationPagingCadastrarTemplateTO.Result.DataSource;

            bool sucessoAoBuscarDados = validationPagingCadastrarTemplateTO.IsValid;
            if (sucessoAoBuscarDados)
            {
                bool listaPreenchida = listaNegociacaoTO != null;
                if (listaPreenchida)
                {
                    validationResultViewModel.Result.DataSource = listaCadastrarTemplateTO.Select(to => (CadastrarTemplateViewModel)to).ToList();
                    validationResultViewModel.Result.Total = validationPagingPoliticaCadastrarTemplateTO.Result.Total;
                }
                else
                {
                    validationResultViewModel.ValidationResultToModelState(ModelState);
                }
            }

            return Json(validationResultViewModel.ToDataSourceResult(request, ModelState), JsonRequestBehavior.AllowGet);
        }
        public JsonResult InserirTemplate([DataSourceRequest] DataSourceRequest request, CadastrarTemplateViewModel viewModel)
        {
            CadastrarTemplateTO to = (CadastrarTemplateTO)viewModel;
            ValidarModelTO(to);

            if (ModelState.IsValid)
            {
                ValidationResult validation = iCadastrarTemplateAppService.InserirCadastrarTemplate(to);

                bool fracassoAoInserir = !validation.IsValid;
                if (fracassoAoInserir)
                {
                    validation.ValidationResultToModelState(this.ModelState);
                }
                else
                {
                    viewModel = (CadastrarTemplateViewModel)to;
                }
            }

            return Json(new[] { viewModel }.ToDataSourceResult(request, this.ModelState));
        }


        private void ValidaStringDoViewModel(string texto, string mensagemEhNulo, bool contemValidacaoTamanhoMaximo = true, int tamanhoMaximo = 0, string mensagemTamanhoMaximo = "")
        {
            if (string.IsNullOrWhiteSpace(texto))
            {
                this.ModelState.AddModelError(string.Empty, mensagemEhNulo);
            }
            else if (contemValidacaoTamanhoMaximo && texto.Length > tamanhoMaximo)
            {
                this.ModelState.AddModelError(string.Empty, mensagemTamanhoMaximo);
            }
        }

    }
}