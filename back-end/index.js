// import { companyProfile2 } from '../back-end/api';
const cors=require('cors')
const express = require('express');
const moment = require('moment');
const axios = require('axios');
const { MongoClient } = require("mongodb");

const api = require('./api.js');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const apiKey = 'cn40hc9r01qtsta4c4u0cn40hc9r01qtsta4c4ug';
const polygonApiKey = 'Z5RZpPp6r5PLAAdg7anN07ArupDRVb_S';

// const extraKey = "j8dlyGBXqBZjYbffatMqg3WxTFgAl9Ig"; 
app.use('/', express.static("static"));
app.use(cors(
	{
		origin:"https://stock-market-portal.wl.r.appspot.com",
	}
))

// origin:"https://stock-market-portal.wl.r.appspot.com"
// app.use('/', express.static("static"));

const uri = "mongodb+srv://shritejp:p8qXjnzC1nCTH1Cw@stock-market-app.jr4hojs.mongodb.net/?retryWrites=true&w=majority&appName=stock-market-app";
var client = new MongoClient(uri);
const dbName = "stockMarketApp";
const portfolioName = "portfolio";
const watchlistName = "watchlist";
const walletName = "wallet"

// const database = client.db(dbName);
// const portfolioCollection = database.collection(portfolioName);
// const watchlistCollection = database.collection(watchlistName);
// const walletCollection = database.collection(walletName);

// ----------------------------- Functions -----------------------------

async function main() {
	try {
		console.log('main function');
		await client.connect();
		console.log('Connected to MongoDB');

	} catch (error) {
		console.error(error);
	}
}

main();


// ----------------------------- Routes -----------------------------

// Sample Route
app.get('/hello', (req, res)=>{ 
	res.set('Content-Type', 'text/html'); 
	res.status(200).send("<h1>Hello GFG Learner!</h1>"); 
}); 


// Company Profile 2 Route
app.get('/company-profile2', async function (req, res) {
	try {
		let stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// console.log(stockSymbol);
		const companyData = await api.companyProfile2(stockSymbol, apiKey);
		
		if (companyData != {}) {
			console.log(companyData)
			res.status(200);
			res.send(companyData);
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.send({});
	}
});


// Company's Latest Stock Price : Quote API Route
app.get('/quote', async function (req, res) {
	try {
		let stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// console.log(stockSymbol);
		const latestStockPriceData = await api.quote(stockSymbol, apiKey);
		
		if (latestStockPriceData != {}) {
			console.log(latestStockPriceData)
			res.status(200);
			res.send(latestStockPriceData);
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.send({});
	}
});


// Autocomplete : Symbol Search API Route
app.get('/symbol-search', async function (req, res) {
	try {
		let stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// console.log(stockSymbol);
		const symbolSearchData = await api.symbolSearch(stockSymbol, apiKey);
		
		if (symbolSearchData != {}) {
			console.log(symbolSearchData)
			res.status(200);
			res.send(symbolSearchData);
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.send({});
	}
});


// Company News API Route
app.get('/company-news', async function (req, res) {
	try {
		let stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// console.log(stockSymbol);
		const companyNewsData = await api.companyNews(stockSymbol, apiKey);
		
		if (companyNewsData != {}) {
			// console.log(companyNewsData)
			res.status(200);
			res.send(companyNewsData);
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.send({});
	}
});


// Company Recommendations API Route
app.get('/company-recommendations', async function (req, res) {
	try {
		let stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// console.log(stockSymbol);
		const companyRecommendationsData = await api.companyRecommendations(stockSymbol, apiKey);
		
		if (companyRecommendationsData != {}) {
			console.log(companyRecommendationsData)
			res.status(200);
			res.send(companyRecommendationsData);
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.send({});
	}
});


// Company Insider Sentiment API Route
app.get('/company-insider-sentiment', async function (req, res) {
	try {
		let stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// console.log(stockSymbol);
		const companyInsiderSentimentData = await api.companyInsiderSentiment(stockSymbol, apiKey);
		
		if (companyInsiderSentimentData != {}) {
			console.log(companyInsiderSentimentData)
			res.status(200);
			res.send(companyInsiderSentimentData);
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.send({});
	}
});


// Company Peers API Route
app.get('/company-peers', async function (req, res) {
	try {
		let stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// console.log(stockSymbol);
		const companyPeersData = await api.companyPeers(stockSymbol, apiKey);
		
		if (companyPeersData != {}) {
			console.log(companyPeersData)
			res.status(200);
			res.send(companyPeersData);
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.send({});
	}
});


// Company's Earnings API Route
app.get('/company-earnings', async function (req, res) {
	try {
		let stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// console.log(stockSymbol);
		const companyEarningsData = await api.companyEarnings(stockSymbol, apiKey);
		
		if (companyEarningsData != {}) {
			console.log(companyEarningsData)
			res.status(200);
			res.send(companyEarningsData);
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.send({});
	}
});


// Company Historical Data Route - Polygon.io
app.get('/company-historical-polygon', async function (req, res) {
	try {
		let stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// console.log(stockSymbol);
		const companyHistoricalData = await api.polygonAPI(stockSymbol, polygonApiKey);
		
		if (companyHistoricalData != {}) {
			console.log(companyHistoricalData)
			res.status(200);
			res.send(companyHistoricalData);
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.send({});
	}
});


// Stock Charts Route - Polygon.io
app.get("/stock_charts", async (req, res) => {
    try {
		let stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		let quoteData = await api.quote(stockSymbol, apiKey);
		// console.log(stockSymbol);

        const param = {
            "adjusted": true,
            "sort": "asc",
            "apiKey": polygonApiKey
        }
        console.log("Params: ", param);
    
		
		start = moment.unix(quoteData.unix_time).subtract(1, "days").format("YYYY-MM-DD");
        end = moment.unix(quoteData.unix_time).format("YYYY-MM-DD");
		let url = `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/${start}/${end}`;

		// let url = `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/2024-03-27/2024-03-29`;

        const response = await axios.get(url, { params: param });
		// const response = await axios.get(url).then(data => {return data});
        console.log(`Stock Charts API Status: ${response.status}`);
        console.log("Body Size: ", Object.keys(response.data).length);
        console.log("Type: ", typeof response.data);

        const outputData = response.data.results.map(arrayItem => [arrayItem.t, arrayItem.c]);
		console.log('aaaaaaaaaaaaaaa', outputData);

        res.json(outputData);

    } catch(err) {
        console.error("Error: ", err);
		res.json({})
    }
})


// SMA Charts Route - Polygon.io
app.get("/sma_charts", async (req, res) => {

    try {
		let stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// // console.log(stockSymbol);

        const param = {
            "adjusted": true,
            "sort": "asc",
            "apiKey": polygonApiKey
        }
        console.log("Params: ", param);

		let url = `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/day/${moment().subtract(2, "years").format("YYYY-MM-DD")}/${moment().format("YYYY-MM-DD")}`;

        const response = await axios.get(url, { params: param });
        console.log(`Status: ${response.status}`);
        console.log("Body Size: ", Object.keys(response.data).length);
        console.log("Type: ", typeof response.data);
        
        const outputData = {
            ohlc: [],
            volume: []
        }
    
        for (const [key, value] of Object.entries(response.data.results)) {
            outputData.ohlc.push([value.t, value.o, value.h, value.l, value.c]);
            outputData.volume.push([value.t, value.v]);
        }
    
        res.json(outputData);
    
    } catch(err) {
        console.error("Error: ", err);
		const outputData = {
            ohlc: [],
            volume: []
        };
		res.json(outputData);
    }

})

// MongoDB Routes

// Get Wallet Balance
app.get('/wallet-balance', async function (req, res) {
	try {
		console.log('wallet-balance endpoint hit');
		// await client.connect();
		const database = client.db(dbName);
		const walletCollection = database.collection(walletName);

		const balance = await api.getWalletBalance(walletCollection);
		console.log('aaaaa' + balance)
		if (balance != 0) {
			console.log(balance)
			res.status(200);
			res.json({'balance': balance});
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.json({});
	}
	finally {
		// await client.connect
		console.log("Function Execution finished")
	}
});


// Update wallet balance
app.post('/wallet-balance', async (req, res) => {
	const { newBalance } = req.body;
  
	try {
		console.log('wallet-balance endpoint hit');
		// await client.connect();
		const database = client.db(dbName);
		const walletCollection = database.collection(walletName);
	
		const result = await walletCollection.updateOne({}, { $set: { balance: newBalance } });
		if (result.modifiedCount === 1) {
			res.json({ message: 'Wallet balance updated successfully' });
		} else {
			res.status(404).json({ error: 'User data not found' });
		}
		} catch (error) {
		console.error('Error updating wallet balance:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
	finally {
		// await client.connect
		console.log("Function Execution finished")
	}
  });


// Function to get the watchlist
app.get('/watchlist/retrieve', async (req, res) => {
	try {
		console.log('watchlist endpoint hit');
		// await client.connect();
		const database = client.db(dbName);
		const watchlistCollection = database.collection(watchlistName);

		const watchlist = await watchlistCollection.find({}).toArray();

		for (let stock of watchlist) {
			const latestStockPriceData = await api.quote(stock.stockSymbol, apiKey);
			stock.latestPrice = latestStockPriceData.c;
			stock.change = latestStockPriceData.d;
			stock.changePercent = latestStockPriceData.dp;
		}

		console.log(watchlist)
		if (watchlist != []) {
			res.status(200);
			res.json(watchlist);
		}
		else {
			res.status(404);
			res.json({});
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.json({});
	}
	finally {
		// await client.connect
		console.log("Function Execution finished")
	}
});


// Function to update watchlist, either to add or remove a stock from the watchlist
app.post('/watchlist/update', async (req, res) => {
	try {
		console.log('watchlist/update endpoint hit');
		const { stockSymbol, stockName, action } = req.body;
		// console.log(req_data);
		// await client.connect();
		const database = client.db(dbName);
		const watchlistCollection = database.collection(watchlistName);

		if (action === 'add') {
			const result = await watchlistCollection.insertOne({
				stockSymbol,
				stockName,
			});
			if (result.insertedId) {
				res.json({ message: 'Stock added to watchlist successfully' });
			} else {
				res.status(500).json({ error: 'Failed to add stock to watchlist' });
			}
		} else if (action === 'remove') {
			const result = await watchlistCollection.deleteOne({ stockSymbol });
			if (result.deletedCount === 1) {
				res.json({ message: 'Stock removed from watchlist successfully' });
			} else {
				res.status(500).json({ error: 'Failed to remove stock from watchlist' });
			}
		} else {
			res.status(400).json({ error: 'Invalid action' });
		}
	} catch (error) {
		console.error('Error updating watchlist:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
	finally {
		// await client.connect
		console.log("Function Execution finished")
	}
});


// Function to get the portfolio
app.get('/portfolio/retrieve', async (req, res) => {
	try {
		console.log('portfolio endpoint hit');
		// await client.connect();
		const database = client.db(dbName);
		const portfolioCollection = database.collection(portfolioName);
		const walletCollection = database.collection(walletName);

		const portfolioList = await portfolioCollection.find({}).toArray();
		const balance = await api.getWalletBalance(walletCollection);

		for (let stock of portfolioList) {
			const latestStockPriceData = await api.quote(stock.stockSymbol, apiKey);
			stock.latestPrice = latestStockPriceData.c;
			stock.changePercent = ((stock.latestPrice - stock.averagePrice)/stock.averagePrice) * 100;
			stock.totalCost = stock.quantity * stock.averagePrice;
			stock.marketValue = stock.quantity * stock.latestPrice;
		}

		console.log(portfolioList)
		if (portfolioList != []) {
			res.status(200);
			res.json({portfolioList, balance});
		}
		else {
			res.status(404);
			res.json({});
		}
	}
	catch (error) {
		console.error(error);
		res.status(500);
		res.json({});
	}
	finally {
		// await client.connect
		console.log("Function Execution finished")
	}
});


// Function to check if a stock is in the portfolio (Unused)
app.get('/portfolio/check', async (req, res) => {
	try {
		console.log('portfolio/check endpoint hit');
		const stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// await client.connect();
		const database = client.db(dbName);
		const portfolioCollection = database.collection(portfolioName);

		const stock = await portfolioCollection.findOne({ stockSymbol });
		if (stock) {
			res.json(stock);
		} else {
			res.json({});
		}
	} catch (error) {
		console.error('Error checking portfolio:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
	finally {
		// await client.connect
		console.log("Function Execution finished")
	}
});


// Function to check if the stock exists in the portfolio and the watchlist for stock-details page
app.get('/stock-details', async (req, res) => {
	try {
		console.log('stock-details endpoint hit');
		const stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// await client.connect();
		const database = client.db(dbName);
		const portfolioCollection = database.collection(portfolioName);
		const watchlistCollection = database.collection(watchlistName);

		const stockInPortfolio = await portfolioCollection.findOne({ stockSymbol });
		const stockInWatchlist = await watchlistCollection.findOne({ stockSymbol });

		if (stockInPortfolio && stockInWatchlist) {
			console.log('Stock exists in portfolio and watchlist');
			res.json({stockInWatchlist, stockInPortfolio})	
		} else if (stockInWatchlist && !stockInPortfolio) {
			res.json({stockInWatchlist, stockInPortfolio: {}})
		} else if (stockInPortfolio && !stockInWatchlist) {
			res.json({stockInWatchlist: {}, stockInPortfolio})
		} else {
			res.json({stockInWatchlist: {}, stockInPortfolio: {}})
		}
	}
	catch (error) {
		console.error('Error checking stock existence:', error);
		res.status(500).json({ error: 'Internal server error' });
	} finally {
		// await client.connect
		console.log("Function Execution finished")
	}
});


// Function to get the stock details from portfolio and wallet-balance for the buy-modal component
app.get('/buy-modal', async (req, res) => {
	try {
		console.log('buy-modal endpoint hit');
		const stockSymbol = req.query.stockSymbol.toString().toUpperCase();
		// await client.connect();
		const database = client.db(dbName);
		const portfolioCollection = database.collection(portfolioName);
		const walletCollection = database.collection(walletName);

		const stockInPortfolio = await portfolioCollection.findOne({ stockSymbol });
		const walletData = await walletCollection.findOne({});
		const walletBalance = walletData.balance;

		if (stockInPortfolio) {
			console.log('Stock exists in portfolio and wallet');
			res.json({stockInPortfolio, walletBalance})	
		} else {
			res.json({stockInPortfolio: {}, walletBalance})
		}
	}
	catch (error) {
		console.error('Error fetching stock details:', error);
		res.status(500).json({ error: 'Internal server error' });
	} finally {
		// await client.connect
		console.log("Function Execution finished")
	}
});



// Function to update the portfolio
app.post('/portfolio/update', async (req, res) => {
	try {
		console.log('portfolio/update endpoint hit');
		const { stockSymbol, stockName, quantity, price, action } = req.body;
		// console.log(req_data);
		// await client.connect();
		const database = client.db(dbName);
		const portfolioCollection = database.collection(portfolioName);

		if (action === 'buy') {
			const existingStock = await portfolioCollection.findOne({ stockSymbol });
			if (existingStock) {
				const updatedQuantity = existingStock.quantity + quantity;
				const updatedAveragePrice = (existingStock.averagePrice * existingStock.quantity + price * quantity) / updatedQuantity;
				const result = await portfolioCollection.updateOne(
					{ stockSymbol },
					{
						$set: {
							quantity: updatedQuantity,
							averagePrice: updatedAveragePrice,
						},
					}
				);
				if (result.modifiedCount === 1) {
					res.json({ message: 'Stock bought successfully | Update' });
				} else {
					res.status(500).json({ error: 'Failed to update stock' });
				}
			} else {
				const result = await portfolioCollection.insertOne({
					stockSymbol,
					stockName,
					quantity,
					averagePrice: price,
				});
				if (result.insertedId) {
					res.json({ message: 'Stock bought successfully | Insert' });
				} else {
					console.log(result.insertedCount)
					res.status(500).json({ error: 'Failed to insert stock' });
				}
			}
		} else if (action === 'sell') {
			const existingStock = await portfolioCollection.findOne({ stockSymbol });
			if (existingStock) {
				if (existingStock.quantity >= quantity) {
					const updatedQuantity = existingStock.quantity - quantity;
					if (updatedQuantity === 0) {
						const result = await portfolioCollection.deleteOne({
							stockSymbol,
						});
						if (result.deletedCount === 1) {
							res.json({ message: 'Stock sold successfully' });
						} else {
							res.status(500).json({ error: 'Failed to delete stock' });
						}
					} else {
						const result = await portfolioCollection.updateOne(
							{ stockSymbol },
							{
								$set: {
									quantity: updatedQuantity,
								},
							}
						);
						if (result.modifiedCount === 1) {
							res.json({ message: 'Stock sold successfully' });
						} else {
							res.status(500).json({ error: 'Failed to update stock' });
						}
					}
				} else {
					res.status(400).json({ error: 'Insufficient quantity to sell' });
				}
			} else {
				res.status(400).json({ error: 'Stock not found in portfolio' });
			}
		} else {
			res.status(400).json({ error: 'Invalid action' });
		}
	} catch (error) {
		console.error('Error updating portfolio:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
	finally {
		// await client.connect
		console.log("Function Execution finished")
	}
});



app.listen(process.env.PORT, (error) =>{ 
	if(!error) 
		console.log("Server is Successfully Running, and App is listening on port "+ PORT) 
	else
		console.log("Error occurred, server can't start", error); 
	} 
);