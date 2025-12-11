class TwelveDataAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.twelvedata.com';
    }

    async getRSI(pair, interval = '1min') {
        const url = `${this.baseUrl}/indicator?symbol=${pair}&interval=${interval}&indicator=RSI&apikey=${this.apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('RSI Error:', error);
            return null;
        }
    }

    async getMACD(pair, interval = '1min') {
        const url = `${this.baseUrl}/indicator?symbol=${pair}&interval=${interval}&indicator=MACD&apikey=${this.apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('MACD Error:', error);
            return null;
        }
    }

    async getBollingerBands(pair, interval = '1min') {
        const url = `${this.baseUrl}/indicator?symbol=${pair}&interval=${interval}&indicator=Bollinger%20Bands&apikey=${this.apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Bollinger Bands Error:', error);
            return null;
        }
    }

    async getPrice(pair) {
        const url = `${this.baseUrl}/quote?symbol=${pair}&apikey=${this.apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Price Error:', error);
            return null;
        }
    }
}
