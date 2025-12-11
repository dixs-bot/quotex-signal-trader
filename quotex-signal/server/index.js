import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ====== INDICATOR FUNCTIONS ======

function SMA(values, period) {
  return values.map((v, i) => {
    if (i < period) return null;
    const slice = values.slice(i - period, i);
    const sum = slice.reduce((a, b) => a + b, 0);
    return sum / period;
  });
}

function RSI(close, period = 14) {
  let gains = 0, losses = 0;
  const deltas = [];

  for (let i = 1; i < close.length; i++) {
    deltas.push(close[i] - close[i - 1]);
  }

  for (let i = 0; i < period; i++) {
    const d = deltas[i];
    if (d >= 0) gains += d;
    else losses += Math.abs(d);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  const output = Array(period).fill(null);

  for (let i = period; i < deltas.length; i++) {
    const d = deltas[i];
    const gain = d > 0 ? d : 0;
    const loss = d < 0 ? Math.abs(d) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    output.push(rsi);
  }

  return output;
}

function EMA(values, period) {
  const k = 2 / (period + 1);
  let ema = values[0];
  return values.map((v, i) => {
    if (i === 0) return ema;
    ema = v * k + ema * (1 - k);
    return ema;
  });
}

function MACD(values) {
  const ema12 = EMA(values, 12);
  const ema26 = EMA(values, 26);
  const macd = values.map((v, i) => ema12[i] - ema26[i]);
  const signal = EMA(macd, 9);
  const hist = macd.map((v, i) => v - signal[i]);
  return { macd, signal, hist };
}

function Bollinger(values, period = 20, mult = 2) {
  const middle = SMA(values, period);
  return values.map((v, i) => {
    if (i < period) return { middle: null, upper: null, lower: null };

    const slice = values.slice(i - period, i);
    const avg = middle[i];
    const variance = slice.reduce((acc, val) => acc + (val - avg) ** 2, 0) / period;
    const sd = Math.sqrt(variance);

    return {
      middle: avg,
      upper: avg + mult * sd,
      lower: avg - mult * sd
    };
  });
}

// ====== API ENDPOINT ======
app.get("/signal", async (req, res) => {
  const { symbol, interval, apikey } = req.query;

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=200&apikey=${apikey}`;

    const response = await axios.get(url);
    const values = response.data.values.reverse();

    const close = values.map(v => Number(v.close));

    const rsi = RSI(close);
    const macd = MACD(close);
    const bb = Bollinger(close);

    res.json({
      status: "ok",
      latest: values.at(-1),
      rsi: rsi.at(-1),
      macd: macd.macd.at(-1),
      macdSignal: macd.signal.at(-1),
      bb: bb.at(-1)
    });

  } catch (e) {
    res.json({ status: "error", message: e.toString() });
  }
});

app.listen(3000, () => console.log("SERVER RUNNING on http://localhost:3000"));
