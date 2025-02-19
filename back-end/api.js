const axios = require('axios');


// Creating a Finnhub Client
function createFinnhubClient(apiKey) {
    var finnhub = require('finnhub');
    var api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = apiKey;
    var finnhubClient = new finnhub.DefaultApi();

    return finnhubClient;
}

// ----------------------------- API Functions -----------------------------

// Company Description : Company Profile 2 API Call
async function companyProfile2(stockSymbol, apiKey) {
	try {
		var response_data = {}
		let url = `https://finnhub.io/api/v1/stock/profile2?symbol=${stockSymbol}&token=${apiKey}`;
		const response = await axios.get(url).then(data => {return data});

		response_data = response.data;
		return response_data;
	}
	catch (error) {
		console.error(error);
		return {};
	}
}


// Company's Historical Data : Polygon.io API Call
async function polygonAPI(stockSymbol, polygonApiKey) {
	try {
		var response_data = {}
		var currentDate = new Date();
		var previousDate = new Date();
		previousDate.setMonth(currentDate.getMonth() - 6);
		previousDate.setDate(currentDate.getDate() - 1);

		let rangeStart = previousDate.toISOString().split('T')[0];
		let rangeEnd = currentDate.toISOString().split('T')[0];

		// console.log(rangeStart, rangeEnd);

		let url = `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/day/${rangeStart}/${rangeEnd}?adjusted=true&sort=asc&apiKey=${polygonApiKey}`;
		const response = await axios.get(url).then(data => {return data});

		response_data = response.data;
		return response_data;
	}
	catch (error) {
		console.error(error);
		return {};
	}
}


// Company's Latest Price of Stock : Quote API Call
async function quote(stockSymbol, apiKey) {
	try {
		var response_data = {}
		let url = `https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${apiKey}`;
		const response = await axios.get(url).then(data => {return data});

		response_data = response.data;
		response_data['unix_time'] = response_data['t'];
		response_data['t'] = new Date(response_data['t'] * 1000).toISOString().slice(0, 19).replace('T', ' ');

		return response_data;
	}
	catch (error) {
		console.error(error);
		return {};
	}
}


// Autocomplete : Symbol Search API Call
async function symbolSearch(stockSymbol, apiKey) {
	try {
		var response_data = {};
		var return_data = {};
		let url = `https://finnhub.io/api/v1/search?q=${stockSymbol}&token=${apiKey}`;
		const response = await axios.get(url).then(data => {return data});
		response_data = response.data;

		// Data Processing
		let temp = response_data['result'];
		let temp2 = [];
		for (let i=0; i< temp.length; i++){
			if (temp[i]["type"] == "Common Stock" && !temp[i]["symbol"].includes(".")) {
				let temp_obj = {};
				temp_obj['description'] = temp[i]['description'];
				temp_obj['symbol'] = temp[i]['symbol'];
				temp2.push(temp_obj);
			}
		}

		return_data['result'] = temp2;
		// response_data['count'] = temp2.length;

		return temp2;
	}
	catch (error) {
		console.error(error);
		return {};
	}
}


// Company News : Company News API Call
async function companyNews(stockSymbol, apiKey) {
	try {
		var response_data = {}
		var temp_data = {}
		var currentDate = new Date();
		var previousDate = new Date();
		previousDate.setMonth(currentDate.getMonth() - 6);
		previousDate.setDate(currentDate.getDate() - 1);

		let rangeStart = previousDate.toISOString().split('T')[0];
		let rangeEnd = currentDate.toISOString().split('T')[0];

		let url = `https://finnhub.io/api/v1/company-news?symbol=${stockSymbol}&from=${rangeStart}&to=${rangeEnd}&token=${apiKey}`;
		const response = await axios.get(url).then(data => {return data});

		// temp_data = response.data;

		const newsKeys = ["image", "url", "headline", "datetime", "source", "summary"];
		const outputData = [];
		const maxOutputSize = 20;

		let i=0
		while (i<Object.keys(response.data).length && outputData.length<maxOutputSize) {
			if ( newsKeys.every((key) => { return (response.data[i].hasOwnProperty(key) && String(response.data[i][key]).trim() !== "") }) ) {
				response.data[i].datetime = formatTimestamp(response.data[i].datetime);
				outputData.push(response.data[i]);
			}
			i++;
			}

		return outputData;
	}
	catch (error) {
		console.error(error);
		return {};
	}
}


// Function Convert timestamp to proper format
function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


// Company Recommendation Trends API Call
async function companyRecommendations(stockSymbol, apiKey) {
	try {
		var response_data = {}
		let url = `https://finnhub.io/api/v1/stock/recommendation?symbol=${stockSymbol}&token=${apiKey}`;
		const response = await axios.get(url).then(data => {return data});

		response_data = response.data;

		const outputData = {
            xAxis: [],
            yAxis: {
                strongBuy: [],
                buy: [],
                hold: [],
                sell: [],
                strongSell: []
            }
        };
    
        for (const [key, value] of Object.entries(response.data)) {
            outputData.xAxis.push(value.period);
            outputData.yAxis.strongBuy.push(value.strongBuy);
            outputData.yAxis.buy.push(value.buy);
            outputData.yAxis.hold.push(value.hold);
            outputData.yAxis.sell.push(value.sell);
            outputData.yAxis.strongSell.push(value.strongSell);
		}
		return outputData;
	}
	catch (error) {
		console.error(error);
		return {};
	}
}


// Company's Insider Sentiment API Call
async function companyInsiderSentiment(stockSymbol, apiKey) {
	try {
		var response_data = {}
		var currentDate = new Date();
		let rangeEnd = currentDate.toISOString().split('T')[0];

		let url = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${stockSymbol}&from=2022-01-01&to=${rangeEnd}&token=${apiKey}`;
		const response = await axios.get(url).then(data => {return data});

		response_data = response.data;

		let outputData = {
			mspr_total: 0,
			mspr_positve: 0,
			mspr_negative: 0,
			change_total: 0,
			change_positive: 0,
			change_negative: 0
		};

		response_data.data.forEach(function (item) {
			outputData.mspr_total+=item.mspr;
            outputData.mspr_positve+=item.mspr>0?item.mspr:0;
            outputData.mspr_negative+=item.mspr<0?item.mspr:0;
            outputData.change_total+=item.change;
            outputData.change_positive+=item.change>0?item.change:0;
            outputData.change_negative+=item.change<0?item.change:0;
		});

		return outputData;
	}
	catch (error) {
		console.error(error);
		return {};
	}
}


// Company's Peers API Call
async function companyPeers(stockSymbol, apiKey) {
	try {
		var response_data = {}
		let url = `https://finnhub.io/api/v1/stock/peers?symbol=${stockSymbol}&token=${apiKey}`;
		const response = await axios.get(url).then(data => {return data});

		response_data = response.data;

		let filteredData = response_data.filter(peer => !(peer.includes(".")));
		return filteredData;
	}
	catch (error) {
		console.error(error);
		return {};
	}
}


// Company's Earnings API Call
async function companyEarnings(stockSymbol, apiKey) {
	try {
		var response_data = {}
		let url = `https://finnhub.io/api/v1/stock/earnings?symbol=${stockSymbol}&token=${apiKey}`;
		const response = await axios.get(url).then(data => {return data});
		response_data = response.data;

		const outputData = {
			xAxis: [],
			yAxis: {
				actual: [],
				estimate: []
			}
		};

		response_data.sort((a,b) => new Date(b.period) - new Date(a.period));

		for(const [key, value] of Object.entries(response_data)) {
			outputData.xAxis.push(`${value.period} Surprise: ${value.surprise}`);
			outputData.yAxis.actual.push(value.actual?value.actual:0);
			outputData.yAxis.estimate.push(value.estimate?value.estimate:0);
		}

		return outputData;
	}
	catch (error) {
		console.error(error);
		return {};
	}
}





// ----------------------------- Mongo Functions -----------------------------

async function insertDocument(collection, document) {
	const insertResult = await collection.insertOne(document);
	return result.insertedId;
}

async function BuyStock(){}


// Function to get the wallet balance from MongoDb
async function getWalletBalance(walletCollection) {
	try {
		console.log('getWallatBalance function called');
		const walletData = await walletCollection.findOne();
		const balance = Number(walletData['balance']);
		console.log(balance);

		return balance
	}
	catch (error) {
		console.error(error);
		return 0;
	}
}

// Function to update wallet balance in MongoDb
async function updateWalletBalance(walletCollection, newBalance) {
	try {
		responseData = {};
		console.log('updateWalletBalance function called');
		const result = await walletCollection.updateOne({}, { $set: { balance: newBalance } });
		console.log(result);
		if (result.modifiedCount === 1) {
			responseData = { message: 'Wallet balance updated successfully' };
		  } else {
			responseData = { error: 'User data not found' };
		  }

		return responseData
	}
	catch (error) {
		console.error(error);
		return 0;
	}
}


module.exports = { companyProfile2, polygonAPI, quote, symbolSearch, companyNews, companyRecommendations, companyInsiderSentiment, companyPeers, companyEarnings, getWalletBalance, updateWalletBalance }