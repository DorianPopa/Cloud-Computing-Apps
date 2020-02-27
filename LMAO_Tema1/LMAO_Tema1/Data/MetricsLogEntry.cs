namespace LMAO_Tema1.Data
{
    public class MetricsLogEntry
    {
        public string Action { get; private set; }
        public string ActionType { get; private set; }
        public string ActionParams { get; private set; }
        public string ActionResult { get; private set; }
        public string ActionResponseTime { get; private set; }

        private MetricsLogEntry() { }

        public MetricsLogEntry(string action, string actionType, string parameters, string result, string responseTime)
        {
            Action = action;
            ActionType = actionType;
            ActionParams = parameters;
            ActionResult = result;
            ActionResponseTime = responseTime;
        }
    }
}
