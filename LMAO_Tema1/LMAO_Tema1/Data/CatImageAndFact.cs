namespace LMAO_Tema1.Data
{
    public class CatImageAndFact
    {
        public CatFact  CatFact     { get; private set; }
        public CatImage CatImage    { get; private set; }
        public byte[] Image { get; private set; }

        private CatImageAndFact() { }
        public CatImageAndFact(CatImage image, CatFact fact, byte[] data)
        {
            CatImage = image;
            CatFact = fact;
            Image = data;
        }
    }
}
