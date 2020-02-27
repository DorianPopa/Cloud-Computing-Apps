using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.Net.Http;
using System.Threading.Tasks;

namespace LMAO_Tema1.Data
{
    public class CatFactService
    {
        private readonly string baseCatFactAPI = "https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=1";
        readonly HttpClient httpClient = new HttpClient();

        public Task<CatFact> GetCatFactFromAPI()
        {
            return Task<CatFact>.Run(async () =>
            {
                var watch = new Stopwatch();
                watch.Start();

                var httpResponse = httpClient.GetAsync(baseCatFactAPI);
                string result = await httpResponse.Result.Content.ReadAsStringAsync();

                var myJObject = JObject.Parse(result);
                string data = myJObject.SelectToken("text").Value<string>();

                watch.Stop();
                Logger.LogToFile("GET " + baseCatFactAPI, httpResponse.Result.StatusCode, watch);

                return new CatFact(data);
            });
        }
    }
}
