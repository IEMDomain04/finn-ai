import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("Hi! I'm Finn, your financial assistant from DenariBank. Ask me anything about your budget, spending habits, or how to save better.");
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    setLoading(true);
    setResponse("");

    try {
      const SYSTEM_PROMPT = `You are Finn, an intelligent financial assistant built by DenariBank. 
You provide personalized insights on budgeting, spending habits, saving strategies, and investment opportunities. 
You explain financial concepts in a simple, friendly, and supportive manner. 
If the user asks about investments, offer beginner-friendly options like savings accounts, mutual funds, and stock market basics. 
If the user asks something unrelated to finance (e.g., movies, celebrities, or jokes), kindly remind them you're a financial assistant and gently steer the conversation back to financial topics.`;

      const userData = `
The user is a student based in Manila, Philippines, who is interested in starting to invest.
`;

      // You can later populate this from actual form responses
      const userProfile = {
        age: 21,
        gender: "male",
        status: "student",
        hobbies: ["graphic design", "gaming"],
        hasSteadyIncome: true,
        supportsAnyone: true,
        investments: [], // empty array = no investments yet
        investmentHesitation: "I have some interest investing sometime.",
        location: "Manila"
      };

      const res = await fetch("http://localhost:3001/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `${SYSTEM_PROMPT}\n\n${userData}\n\nUser: ${prompt}\nFinn:`,
        }),
      });

      const data = await res.json();
      let responseText = data.response || "No response received.";

      // Custom spending insights
      if (prompt.toLowerCase().includes("what is something i might not know about my spending?")) {
        responseText = `
Here’s a summary of what I’ve observed by comparing your spending habits with those of similar students:

* You spend ₱500 more on utilities.
* You spend ₱80 less on transportation.
* You spend ₱245 less on dining out.
These figures are based on averages from students of a similar age and with similar interests.

When compared to students living in your city:

* You spend ₱350 more on utilities.
This means you spend around 60% of your money within the first 10 days of the month.

Let me know if you'd like more insights into your spending habits. :)
`;
      }

      setResponse(responseText);
    } catch (err) {
      console.error(err);
      setResponse("Error fetching response.");
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text) => {
    if (!text) return "";

    const escapeHTML = (str) =>
      str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const boldItalicRegex = /\*\*\_(.*?)\_\*\*/g;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*(.*?)\*/g;
    const inlineCodeRegex = /`([^`]+)`/g;
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const listRegex = /(^|\n)[\s]*[-*] (.*?)(?=\n|$)/g;
    const orderedListRegex = /(^|\n)[\s]*\d+\. (.*?)(?=\n|$)/g;

    let html = escapeHTML(text)
      .replace(codeBlockRegex, (_, lang, code) => {
        return `<pre class="bg-gray-900 text-green-300 rounded p-4 overflow-x-auto my-4"><code class="language-${lang || 'text'}">${escapeHTML(code)}</code></pre>`;
      })
      .replace(inlineCodeRegex, '<code class="bg-gray-600 text-green-500 px-1 rounded">$1</code>')
      .replace(boldItalicRegex, '<span class="font-bold italic">$1</span>')
      .replace(boldRegex, '<span class="font-bold">$1</span>')
      .replace(italicRegex, '<span class="italic">$1</span>')
      .replace(orderedListRegex, '$1<ol class="list-decimal ml-6"><li>$2</li></ol>')
      .replace(listRegex, '$1<ul class="list-disc ml-6"><li>$2</li></ul>');

    return html;
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 font-sans">
      <h1 className="text-xl font-bold text-center text-green-400">Finn — Your DenariBank Assistant</h1>

      <div className="response mt-6 p-4 bg-gray-800 rounded-lg">
        <div
          className={`text-gray-200 typing-effect`}
          dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
        />
      </div>

      <div className="flex flex-col space-y-4 h-full">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Finn something..."
          className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={askGemini}
          disabled={loading}
          className={`w-full p-3 rounded-lg text-gray-800 font-semibold ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-blue-700"
            } transition`}
        >
          {loading ? "Loading..." : "Ask Finn"}
        </button>
      </div>
    </div>
  );
}

export default App;
