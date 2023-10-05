
public class CadastrarTemplateController : Controller {

        public ICadastrarTemplateAppService iCadastrarTemplateAppService { get;}
        public CadastrarTemplateController(ICadastrarTemplateAppService iCadastrarTemplateAppService)
        {
            iCadastrarTemplateAppService = iCadastrarTemplateAppService;
        }

        public ActionResult Index(){
            return View();
        }

        public ActionResult InserirTemplate(CadastrarTemplateTO to)
        {
            // Implemente a lógica para criar um novo produto.
            return Json(new { sucesso = true });
        }

        public ActionResult AtualizarTemplate(CadastrarTemplateTO to)
        {
            // Implemente a lógica para atualizar um produto existente.
            return Json(new { sucesso = true });
        }

        public ActionResult ExcluirTemplate(int id)
        {
            // Implemente a lógica para excluir um produto com base no ID.
            return Json(new { sucesso = true });
        }
}