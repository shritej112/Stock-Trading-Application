import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, forkJoin } from 'rxjs';
import { ISearchData } from '../interfaces/searchData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public marketStatusFlag: boolean = false;
  public marketStatusString!: string;

  private expressApiUrl = 'https://stock-market-portal.wl.r.appspot.com'
  
  constructor(private http: HttpClient) { }

  // Function to hit the symbol-search endpoint (Express)
  fetchSearchData(stockTicker: string): Observable<ISearchData[]> {
    if (!stockTicker){
      return new Observable((observer) => {
      observer.next([]);
    });
    };
    
    let endpointUrl = this.expressApiUrl + `/symbol-search?stockSymbol=${stockTicker}`;
    return this.http.get<ISearchData[]>(endpointUrl);
  }

  // /Function to get all the Stock data
  fetchStockData(stockTicker: string): Observable<any> {
    if (!stockTicker){
      return new Observable((observer) => {
      observer.next([]);
    });
    };

    let endpointUrl1 = this.expressApiUrl + `/company-profile2?stockSymbol=${stockTicker}`;
    let endpointUrl2 = this.expressApiUrl + `/quote?stockSymbol=${stockTicker}`;
    let endpointUrl3 = this.expressApiUrl + `/company-peers?stockSymbol=${stockTicker}`;
    let endpointUrl4 = this.expressApiUrl + `/stock_charts?stockSymbol=${stockTicker}`;

    const data1 = this.http.get<any[]>(endpointUrl1);
    const data2 = this.http.get<any[]>(endpointUrl2);
    const data3 = this.http.get<any[]>(endpointUrl3);
    const data4 = this.http.get<any[]>(endpointUrl4);

    return forkJoin({ companyProfile2: data1, quote: data2, companyPeers: data3, stockCharts: data4});
  }

  // Function to get Live stock Data
  fetchLiveStockData(stockTicker: string): Observable<any> {
    if (!stockTicker){
      return new Observable((observer) => {
      observer.next([]);
    });
    };

    let endpointUrl1 = this.expressApiUrl + `/quote?stockSymbol=${stockTicker}`;
    let endpointUrl2 = this.expressApiUrl + `/stock_charts?stockSymbol=${stockTicker}`;

    const data1 = this.http.get<any[]>(endpointUrl1);
    const data2 = this.http.get<any[]>(endpointUrl2);

    return forkJoin({ quote: data1, stockCharts: data2});
  }

  // Function to get insights data
  fetchInsightsData(stockTicker: string): Observable<any> {
    if (!stockTicker){
      return new Observable((observer) => {
      observer.next([]);
    });
    };

    let endpointUrl1 = this.expressApiUrl + `/company-insider-sentiment?stockSymbol=${stockTicker}`;
    let endpointUrl2 = this.expressApiUrl + `/company-recommendations?stockSymbol=${stockTicker}`;
    let endpointUrl3 = this.expressApiUrl + `/company-earnings?stockSymbol=${stockTicker}`;

    const data1 = this.http.get<any[]>(endpointUrl1);
    const data2 = this.http.get<any[]>(endpointUrl2);
    const data3 = this.http.get<any[]>(endpointUrl3);
    
    return forkJoin({ insiderSentiment: data1, recommendations: data2, earnings: data3});
  }

  // Function to get SMA Charts data
  fetchSMAChartsData(stockTicker: string): Observable<any> {
    if (!stockTicker){
      return new Observable((observer) => {
      observer.next([]);
    });
    };

    let endpointUrl = this.expressApiUrl + `/sma_charts?stockSymbol=${stockTicker}`;
    const data = this.http.get<any[]>(endpointUrl);

    return data;
  }

  // Function to hit company-profile2 endpoint (Express)
  fetchCompanyNewsData(stockTicker: string): Observable<any[]> {
    if (!stockTicker){
      return new Observable((observer) => {
      observer.next([]);
    });
    };

    let endpointUrl = this.expressApiUrl + `/company-news?stockSymbol=${stockTicker}`;
    const data =  this.http.get<any[]>(endpointUrl);

    // return forkJoin({ companyNews: data })
    return data
  }


  // Function to get today's date in PDT timezone
  timestampToPDTDateTime(timestamp: number): string {
    const date = new Date(timestamp);
    // Convert to PDT timezone (UTC-7)
    date.setHours(date.getHours() - 7);
    // Format the date to yyyy-mm-dd hh:mm:ss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }


  // Function to get the Market Status
  async getMarketStatus(stockTicker: string) {
    console.log("getMarketStatus called");
    // let marketStatus: boolean = false; // Initialize with default value
    const data:any = await firstValueFrom( this.fetchQuoteData(stockTicker))

    const currentPDT = new Date();
    currentPDT.setHours(currentPDT.getHours() - 7);
    const currentUtcTimestamp = currentPDT.getTime();

    this.marketStatusFlag = currentUtcTimestamp - Date.parse(data?.t) < 300000;
    console.log('aaaaaaaaaaaaaaa',currentUtcTimestamp - Date.parse(data?.t), this.marketStatusFlag);

    if (this.marketStatusFlag) {
      this.marketStatusString = "is Open";
    } else {
      this.marketStatusString =  `Closed on ${this.timestampToPDTDateTime(data?.t)}`;
    }

    console.log("*********marketStatusString: ", this.marketStatusString);
    return this.marketStatusString;
  }


  // Function to hit company-historical-polygon endpoint (Express)
  fetchPolygonApiData(stockTicker: string): Observable<any[]> {
    if (!stockTicker){
      return new Observable((observer) => {
      observer.next([]);
    });
    };

    let endpointUrl = this.expressApiUrl + `/company-historical-polygon?stockSymbol=${stockTicker}`;
    return this.http.get<any[]>(endpointUrl);
  }


  // Function to hit company-profile2 endpoint (Express)
  fetchCompanyProfile2Data(stockTicker: string): Observable<any[]> {
    if (!stockTicker){
      return new Observable((observer) => {
      observer.next([]);
    });
    };

    let endpointUrl = this.expressApiUrl + `/company-profile2?stockSymbol=${stockTicker}`;
    return this.http.get<any[]>(endpointUrl);
  }


  // Function to hit quote endpoint (Express)
  fetchQuoteData(stockTicker: string): Observable<any[]> {
    if (!stockTicker){
      return new Observable((observer) => {
      observer.next([]);
    });
    };

    let endpointUrl = this.expressApiUrl + `/quote?stockSymbol=${stockTicker}`;
    return this.http.get<any[]>(endpointUrl);
  }


  // -------------------------------MongoDb Functions-------------------------------

  // Function to hit wallet-balance endpoint to get balance (Express)
  fetchWalletBalance(): Observable<any[]> {
    let endpointUrl = this.expressApiUrl + `/wallet-balance`;
    const data =  this.http.get<any[]>(endpointUrl);

    return data
  }

  // Function to hit wallet-balance endpoint to update balance (Express)
  updateWalletBalance(newBalance: number): Observable<any> {
    let endpointUrl = this.expressApiUrl + `/wallet-balance`;
    return this.http.post(endpointUrl, { newBalance: newBalance });
  }

  // Function to hit buy-stock endpoint (Express)
  buyStock(stockSymbol: string, stockName: string, quantity: number, price: number): Observable<any> {
    if (!stockSymbol || !stockName || !quantity || !price) {
      return new Observable((observer) => {
        observer.next([]);
      });
    }

    let endpointUrl = this.expressApiUrl + `/portfolio/update`;
    return this.http.post(endpointUrl, { stockSymbol, stockName, quantity, price, action: "buy" });
  }

  // Function to hit sell-stock endpoint (Express)
  sellStock(stockSymbol: string, stockName: string, quantity: number, price: number): Observable<any> {
    if (!stockSymbol || !stockName || !quantity || !price) {
      return new Observable((observer) => {
        observer.next([]);
      });
    }

    let endpointUrl = this.expressApiUrl + `/portfolio/update`;
    return this.http.post(endpointUrl, { stockSymbol, stockName, quantity, price, action: "sell" });
  }

  // Function to hit portfolio/retrieve endpoint (Express)
  fetchPortfolioData(): Observable<any[]> {
    let endpointUrl = this.expressApiUrl + `/portfolio/retrieve`;
    return this.http.get<any[]>(endpointUrl);
  }

  // Function to hit portfolio/check endpoint to check if a stock is in portfolio (Express)
  checkPortfolio(stockSymbol: string): Observable<any> {
    if (!stockSymbol) {
      return new Observable((observer) => {
        observer.next([]);
      });
    }

    let endpointUrl = this.expressApiUrl + `/portfolio/check?stockSymbol=${stockSymbol}`;
    return this.http.get<any[]>(endpointUrl);
  }

   // Function to hit the watchlist/retrieve endpoint (Express)
   fetchWatchlistData(): Observable<any[]> {
    let endpointUrl = this.expressApiUrl + `/watchlist/retrieve`;
    return this.http.get<any[]>(endpointUrl);
  }

  // Function to add stock to watchlist (Express)
  updateStockToWatchlist(stockSymbol: string, stockName: string, action: string): Observable<any> {
    if (!stockSymbol || !stockName) {
      return new Observable((observer) => {
        observer.next([]);
      });
    } else {
      let endpointUrl = this.expressApiUrl + `/watchlist/update`;
      return this.http.post(endpointUrl, { stockSymbol, stockName, action });
    }
  }

  //  Funtion to get stock details page data, watchlist data and portfolio data (Express)
  fetchStockDetailsPageData(stockSymbol: string): Observable<any> {
    if (!stockSymbol) {
      return new Observable((observer) => {
        observer.next([]);
      });
    }

    let endpointUrl = this.expressApiUrl + `/stock-details?stockSymbol=${stockSymbol}`;
    return this.http.get<any[]>(endpointUrl);
    }

    // Funtion to get buy modal component data, portfolio data and wallet balance (Express)
    fetchBuyModalData(stockSymbol: string): Observable<any> {
      if (!stockSymbol) {
        return new Observable((observer) => {
          observer.next([]);
        });
      }

      let endpointUrl = this.expressApiUrl + `/buy-modal?stockSymbol=${stockSymbol}`;
      return this.http.get<any[]>(endpointUrl);
    }

}



