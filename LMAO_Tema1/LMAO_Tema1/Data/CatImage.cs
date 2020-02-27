namespace LMAO_Tema1.Data
{
    public class CatImage
    {
        public byte[] ImageData { get; private set; }
        public string ImageURL { get; private set; }
        private CatImage() { }
        public CatImage(byte[] imgData, string URL)
        {
            ImageData = imgData;
            ImageURL = URL;
        }
    }
}
