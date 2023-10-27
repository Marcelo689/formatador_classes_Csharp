namespace Fabrica.Web.Areas.Operacoes.Models.CadastrarTemplate{
    public class Template{
        public int Id {get;set;}
        public string Nome {get;set;}
        public DateTime Data {get;set;}
        public decimal Salario {get;set;}
        public double Peso {get;set;}
        public float Altura {get;set;}
        public string ExemploPalavraComposta {get;set;}
        public string PalavraComTextoDescartavelViewModel {get;set;}
        public string PalavraComAcentoPao {get;set;}
    }
}
