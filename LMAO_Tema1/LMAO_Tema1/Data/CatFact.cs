namespace LMAO_Tema1.Data
{
    public class CatFact
    {
        public string FactText { get; private set; }
        private CatFact() { }
        public CatFact(string text)
        {
            FactText = text;
        }
    }
}
