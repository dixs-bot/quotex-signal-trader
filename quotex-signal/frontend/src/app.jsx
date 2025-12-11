import React, { useState, useEffect } from "react";

export default function App() {
  const [apikey, setApikey] = useState("");
  const [symbol, setSymbol] = useState("EUR/USD");
  const [interval, setInterval] = useState("1min");
  const [auto, setAuto] = useState(false);
  const [result, setResult] = useState(null);

  async function fetchSignal() {
    if (!apikey) return;

    const url = `http://localhost:3000/signal?symbol=${symbol}&interval=${interval}&apikey=${apikey}`;
    const req = await fetch(url);
    const data = await req.json();
    setResult(data);
  }

  useEffect(() => {
    if (auto) {
      const timer = setInterval(fetchSignal, 5000);
      return () => clearInterval(timer);
    }
  }, [auto]);

  return (
    <div className="p-4 max-w-lg mx-auto text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">Quotex Signal</h1>

      <input
        className="w-full p-2 mb-2 rounded bg-gray-700"
        placeholder="Twelve Data API Key"
        onChange={(e) => setApikey(e.target.value)}
      />

      <button
        onClick={() => setAuto(!auto)}
        className={`w-full p-3 mb-2 rounded ${auto ? "bg-red-500" : "bg-green-500"}`}
      >
        {auto ? "STOP" : "START"} AUTO SIGNAL
      </button>

      <button
        onClick={fetchSignal}
        className="w-full p-3 bg-blue-600 rounded mb-2"
      >
        Manual Fetch
      </button>

      {result && (
        <div className="p-3 bg-gray-800 rounded mt-4">
          <p><b>Price:</b> {result.latest.close}</p>
          <p><b>RSI:</b> {result.rsi}</p>
          <p><b>MACD:</b> {result.macd}</p>
          <p><b>Signal:</b> {result.macdSignal}</p>
          <p><b>Bollinger:</b> {JSON.stringify(result.bb)}</p>

          <h2 className="text-xl mt-4 text-yellow-400">
            Score: {Math.round(result.rsi < 30 ? 90 : result.rsi > 70 ? -90 : 0)}
          </h2>
        </div>
      )}
    </div>
  );
}
