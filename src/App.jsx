import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:3001/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      let responseText = data.response || "No response received.";

      // Customized Response
      if (prompt.toLowerCase().includes("what is something i might not know about my spending?")) {
        responseText = `
Here’s a breakdown of what I’ve observed, comparing you to other students similar to you:

* You spend 500 Php more on utilities.  
* You spend 80 Php less on transportation.  
* You spend 245 Php less dining outside.  

This is based on an average I have obtained of students with similar age and interests.  

However if I compare you to students living in your city:

* You spend 350 Php more on utilities.  

Let me know if you want further insights about how you manage your finances. :)
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

  // Function to format the response (bold, italic, code, lists)
  const formatResponse = (text) => {
    if (!text) return "";

    // Escape HTML
    const escapeHTML = (str) =>
      str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const boldItalicRegex = /\*\*\_(.*?)\_\*\*/g;             // **_bold italic_**
    const boldRegex = /\*\*(.*?)\*\*/g;                        // **bold**
    const italicRegex = /\*(.*?)\*/g;                          // *italic*
    const inlineCodeRegex = /`([^`]+)`/g;                      // `inline code`
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;        // ```lang\ncode```
    const listRegex = /(^|\n)[\s]*[-*] (.*?)(?=\n|$)/g;        // - list
    const orderedListRegex = /(^|\n)[\s]*\d+\. (.*?)(?=\n|$)/g;// 1. list

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
      {/* Response of the AI */}
      <div className="response mt-6 p-4 bg-gray-800 rounded-lg">
        <div
          className="text-gray-200"
          dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
        />
      </div>

      <div className="flex flex-col space-y-4 h-full">
        <h1 className="text-md font-semibold text-center mb-10">Finn Chat</h1>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write something..."
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
