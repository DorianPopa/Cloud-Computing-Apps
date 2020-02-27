using System.Diagnostics;
using System.Net.Http;
using System.Threading.Tasks;

namespace LMAO_Tema1.Data
{
    public class CatImageAndFactService
    {
        private readonly string baseGeneratorURL = @"https://memegen.link/custom/";
        readonly HttpClient httpClient = new HttpClient();

        public CatImageAndFactService() { }
        
        public Task<CatImageAndFact> GetCatImageAndFact(CatImage cat, CatFact fact)
        {
            string finalRequestLink = baseGeneratorURL;
            string[] text = fact.FactText.Split(".", 2);
            if(text.Length == 1)
                text = fact.FactText.Split(",", 2);

            try
            {
                finalRequestLink += text[0] + "/" + text[1] + ".jpg";
            }
            catch(System.IndexOutOfRangeException e)
            {
                System.Console.WriteLine(e.Message);
                finalRequestLink += text[0] + "/" + ".jpg";
            }
            finalRequestLink += "?alt=" + cat.ImageURL;
            finalRequestLink = finalRequestLink.Replace(' ', '_');

            return Task<CatImage>.Run(async () =>
            {
                var watch = new Stopwatch();
                watch.Start();

                var httpResponse = httpClient.GetAsync(finalRequestLink);
                byte[] result = await httpResponse.Result.Content.ReadAsByteArrayAsync();

                watch.Stop();
                Logger.LogToFile("GET " + finalRequestLink, httpResponse.Result.StatusCode, watch);

                return new CatImageAndFact(cat, fact, result);
            });
        }
    }
}
