import React, { useEffect, useState } from "react";

const App = () => {
  const [logs, setLogs] = useState("");
  const [errors, setErrors] = useState([]);
  const [solutions, setSolutions] = useState({});

  const fetchJenkinsLogs = async () => {
    try {
      const response = await fetch("/api/job/sbi-hack/28/consoleText");
      const text = await response.text();
      setLogs(text);

      const extractedErrors = extractErrors(text);
      setErrors(extractedErrors);

      if (extractedErrors.length > 0) {
        fetchSolutions(extractedErrors);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs("Failed to load logs.");
    }
  };

  const extractErrors = (logText) => {
    return [...new Set(logText.split("\n").filter((line) => line.includes("ERROR") || line.includes("error")))];
  };

  const fetchSolutions = async (errors) => {
    try {
      console.log("Sending errors for solutions:", errors); // Debugging

      const response = await fetch("http://localhost:5000/api/get-solution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errors }),
      });

      const data = await response.json();
      console.log("Received Solutions:", data); // Debugging
      setSolutions(data);
    } catch (error) {
      console.error("Error fetching solutions:", error);
    }
  };

  useEffect(() => {
    fetchJenkinsLogs();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Jenkins Pipeline Logs</h1>
      <pre className="bg-gray-900 text-white p-4 rounded text-sm overflow-auto max-h-80">
        {logs || "Loading logs..."}
      </pre>

      {errors.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Error Solutions</h2>
          {errors.map((error, index) => (
            <div key={index} className="p-2 border rounded mt-2 bg-gray-100">
              <p className="text-red-600 font-semibold">{error}</p>
              <p className="text-gray-800 mt-1">
                {solutions[error] || "Fetching solution..."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
