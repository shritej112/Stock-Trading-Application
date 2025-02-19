import { Injectable } from '@angular/core';
import { IData } from '../interfaces/data';

@Injectable({
  providedIn: 'root'
})
export class CurrentStockService {
  stockTicker!: string;
  stockName!: string;

  stockData!: any;    // Full Stock Data
  stockDetails!: any;   // Watchlist and Portfolio Data
  liveStockData!: any;  // Live Stock Data

  // Charts Data
  stockChartData!: any;
  insightsData!: any;
  companyNews!: any;
  smaData!: any;

  // Flags
  stockFetchedFlag: boolean = false;
  stockExistsFlag: boolean = false;
  sellButtonFlag: boolean = true;
  buySuccessFlag: boolean = false;
  sellSuccessFlag: boolean = false;


  constructor() { }

  // Function to clear all the data
  clearData() {
    this.stockTicker = '';
    this.stockName = '';
    this.stockData = {} as IData;
    this.stockDetails = {} as IData;
    this.stockChartData = {} as IData;
    this.insightsData = {} as IData;
    this.companyNews = [];
    this.smaData = {} as IData;
    this.stockFetchedFlag = false;
    this.stockExistsFlag = false;
    this.sellButtonFlag = true;
    this.buySuccessFlag = false;
    this.sellSuccessFlag = false;
  }
}
