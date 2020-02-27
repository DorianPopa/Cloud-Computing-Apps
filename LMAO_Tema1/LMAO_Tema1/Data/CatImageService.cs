using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace LMAO_Tema1.Data
{
    public class CatImageService
    {
        private readonly string baseCatImageBINARY = @"https://api.thecatapi.com/v1/images/search?mime_types=jpg,png&format=src";
        private readonly string baseCatImageURL = @"https://api.thecatapi.com/v1/images/search?mime_types=jpg,png";
        readonly WebClient webClient = new WebClient();
        readonly HttpClient httpClient = new HttpClient();

        public CatImageService()
        {
            httpClient.DefaultRequestHeaders.Add("x-api-key", "ce90be86-0207-4fa3-a11c-52b673d87b9c");
        }

        public Task<CatImage> LoadCatImageFromURL(string catImageURL)
        {
            return Task<CatImage>.Run(() =>
            {
                var watch = new Stopwatch();
                watch.Start();

                Stream stream = webClient.OpenRead(catImageURL);

                byte[] result;
                using (var streamReader = new MemoryStream())
                {
                    stream.CopyTo(streamReader);
                    result = streamReader.ToArray();
                }

                watch.Stop();
                Logger.LogToFileOther("Load_binary_image_from_URL: " + catImageURL, watch);

                return new CatImage(result, catImageURL);
            });
        }
        public Task<string> GetCatImageURLFromAPI()
        {
            return Task<string>.Run(async () =>
            {
                var watch = new Stopwatch();
                watch.Start();

                var httpResponse = httpClient.GetAsync(baseCatImageURL);
                string result = await httpResponse.Result.Content.ReadAsStringAsync();
                result = result.Substring(1, result.Length - 2);
                var myJObject = JObject.Parse(result);
                string catImageURL = myJObject.SelectToken("url").Value<string>();

                watch.Stop();
                Logger.LogToFile("GET " + baseCatImageURL, httpResponse.Result.StatusCode, watch);

                return catImageURL;
            });
        }
    }
}
