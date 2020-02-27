using System.Diagnostics;
using System.Net;

namespace LMAO_Tema1.Data
{
    public static class Logger
    {
        public static string LogFile = @".\logs.txt";
        public static void LogToFile(string request, HttpStatusCode response, Stopwatch watch)
        {
            long responseTime = watch.ElapsedMilliseconds;
            using (System.IO.StreamWriter file = new System.IO.StreamWriter(LogFile, true))
            {
                file.WriteLine("REQUEST: " + request + " STATUS CODE: " + response.ToString() + " " + responseTime.ToString() + " milliseconds");
            }
        }

        public static void LogToFileOther(string request, Stopwatch watch)
        {
            long responseTime = watch.ElapsedMilliseconds;
            using (System.IO.StreamWriter file = new System.IO.StreamWriter(LogFile, true))
            {
                file.WriteLine("ACTION: " + request + " " + responseTime.ToString() + " milliseconds");
            }
        }
    }
}
