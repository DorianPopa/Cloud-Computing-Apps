using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace LMAO_Tema1.Data
{
    public class MetricsLogService
    {
        private string LogFile = Logger.LogFile;
        
        public Task<MetricsLogEntry[]> GetLogListFromFile()
        {
            List<MetricsLogEntry> returnList = new List<MetricsLogEntry>();
            return Task.Run(() =>
            {
                string fileData = "";
                try
                {   
                    using (StreamReader sr = new StreamReader(LogFile))
                    {
                        fileData = sr.ReadToEnd();
                    }
                }
                catch (IOException e)
                {
                    Console.WriteLine("The file could not be read:");
                    Console.WriteLine(e.Message);
                }

                string[] lines = fileData.Split('\n');
                foreach(var line in lines)
                {
                    string[] words = line.Split(' ');

                    if(words[0] == "REQUEST:")
                    {
                        MetricsLogEntry entry = new MetricsLogEntry(words[0], words[1], words[2], words[5], words[6]);
                        returnList.Add(entry);
                    }
                    else if(words[0] == "ACTION:")
                    {
                        MetricsLogEntry entry = new MetricsLogEntry(words[0], words[1], words[2], "OK", words[3]);
                        returnList.Add(entry);
                    }
                }
                return returnList.ToArray();
            });
        }
        
    }
}
