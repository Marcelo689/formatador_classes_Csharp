namespace Fabrica.Web.Areas.Operacoes.Models.CadastrarTemplate{
    public class Template{

      [Display(ResourceType = typeof(Fabrica.Web.App_GlobalResources.Operacoes.CadastrarTemplate),
        Name = nameof(Web.App_GlobalResources.Operacoes.CadastrarTemplate.labelId))]
        public int Id { get;set; }

      [Display(ResourceType = typeof(Fabrica.Web.App_GlobalResources.Operacoes.CadastrarTemplate),
        Name = nameof(Web.App_GlobalResources.Operacoes.CadastrarTemplate.labelNome))]
        public string Nome { get;set; }

      [Display(ResourceType = typeof(Fabrica.Web.App_GlobalResources.Operacoes.CadastrarTemplate),
        Name = nameof(Web.App_GlobalResources.Operacoes.CadastrarTemplate.labelSenha))]
        public string Senha { get;set; }

      [Display(ResourceType = typeof(Fabrica.Web.App_GlobalResources.Operacoes.CadastrarTemplate),
        Name = nameof(Web.App_GlobalResources.Operacoes.CadastrarTemplate.labelEmail))]
        public string Email { get;set; }
    }
        public static explicit operator Template(TemplateTO to)
        {
            return new Template{
                Id = to.Id,
                Nome = to.Nome,
                Senha = to.Senha,
                Email = to.Email,
            };
        }
}