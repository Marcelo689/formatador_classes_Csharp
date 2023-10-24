namespace Universal.Tois.RecebimentoTabaco.Web.Areas.Cadastros.Controllers
{   
    #if !DEBUG
        [Authorize( Roles = "CadastrarPoliticaNegociacaoCompra" )]
    #endif
    public class AgendarCompra : ToisController
    {

        public MinhaClasseController()
        {

        }

        public ActionResult Index()
        {
            return View();
        }
        public JsonResult ReadAgendarCompra([DataSourceRequest] DataSourceRequest request, AgendarCompraFilterViewModel filtrosViewModel)
        {
            AgendarCompraFilterViewModelTO filtrosTO = (AgendarCompraFilterViewModelTO)filtrosViewModel;

            filtrosTO.PagingParameterTO = new PagingParameterTO(request.Page, request.PageSize);

            TratarModelo(filtrosTO);

            ValidationResult<PagingResult<AgendarCompraViewModel>> validationResultViewModel = new ValidationResult<PagingResult<AgendarCompraViewModel>>();
            validationResultViewModel.Result = new PagingResult<AgendarCompraViewModel>();
            ValidationResult<PagingResult<AgendarCompraTO>> validationPagingAgendarCompraTO = iAgendarCompraAppService.GetListaAgendarCompra(filtrosTO);
            IEnumerable<AgendarCompraTO> listaAgendarCompraTO = validationPagingAgendarCompraTO.Result.DataSource;

            bool sucessoAoBuscarDados = validationPagingAgendarCompraTO.IsValid;
            if (sucessoAoBuscarDados)
            {
                bool listaPreenchida = listaNegociacaoTO != null;
                if (listaPreenchida)
                {
                    validationResultViewModel.Result.DataSource = listaAgendarCompraTO.Select(to => (AgendarCompraViewModel)to).ToList();
                    validationResultViewModel.Result.Total = validationPagingPoliticaAgendarCompraTO.Result.Total;
                }
                else
                {
                    validationResultViewModel.ValidationResultToModelState(ModelState);
                }
            }

            return Json(validationResultViewModel.ToDataSourceResult(request, ModelState), JsonRequestBehavior.AllowGet);
        }

        public JsonResult InserirPolitica([DataSourceRequest] DataSourceRequest request, PoliticaNegociacaoCompraViewModel viewModel)
        {
            CadastrarPoliticaNegociacaoCompraTO to = (CadastrarPoliticaNegociacaoCompraTO) viewModel;
            ValidarModelTO(to);

            if (ModelState.IsValid)
            {
                ValidationResult validation = iCadastrarPoliticaNegociacaoCompraAppService.InserirPolitica(to);

                bool fracassoAoInserir = !validation.IsValid;
                if (fracassoAoInserir)
                {
                    validation.ValidationResultToModelState(this.ModelState);
                }
                else
                {
                    viewModel = (PoliticaNegociacaoCompraViewModel) to;
                }
            }

            return Json(new[] { viewModel }.ToDataSourceResult(request, this.ModelState));
        }
    }
}