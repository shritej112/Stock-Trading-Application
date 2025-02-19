import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { BuyModalComponent } from './buy-modal/buy-modal.component';
import { NewsCardComponent } from './news-card/news-card.component';
import { FooterComponent } from '../../footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, interval } from 'rxjs';
import { DataService } from '../../services/data-service.service';
import { CurrentStockService } from '../../services/current-stock.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { IBuyStockData } from '../../interfaces/buyStock';
import { IData } from '../../interfaces/data';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// HighCharts Imports
import * as Highcharts from 'highcharts';
import HC_stock from 'highcharts/modules/stock';
import indicators from "highcharts/indicators/indicators";
import vbpa from "highcharts/indicators/volume-by-price";
HC_stock(Highcharts);
indicators(Highcharts);
vbpa(Highcharts);


@Component({
  selector: 'app-stock-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTabsModule, 
    MatGridListModule, 
    SearchBarComponent, 
    NewsCardComponent, 
    BuyModalComponent, 
    HighchartsChartModule,
    MatProgressSpinnerModule,
    FooterComponent
  ],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.css'
})
export class StockDetailsComponent implements OnInit, OnDestroy{
  // route: ActivatedRoute = inject(ActivatedRoute);
  // stockTicker = '';

  // ngOnInit(): void {
  //   this.stockTicker = String(this.route.snapshot.params['stockTicker']);
  // }

  private fetchMarketData: Subscription | undefined;

  // public companyProfile$!: Observable<any>;
  public stockFetchedFlag: boolean = false;
  public stockExistsFlag: boolean = false;
  public stockData: any;
  public companyNews: any;
  public marketStatusFlag!: boolean;
  public marketOpen !: string;
  public marketDivColor !: string;
  public buyStockData!: IBuyStockData;
  public sellButtonFlag: boolean = true;
  public starType!: string;
  public starColor: string = 'black';
  public stockDetails!: any;        //  Stock details from watchlist and portfolio

  public liveStockData: any;

  public addedWatchlistFlag: boolean = false;
  public removedWatchlistFlag: boolean = false;
  public buySuccessFlag: boolean = false;
  public sellSuccessFlag: boolean = false;

  // MongoDb Variables
  public walletBalance!: any;
  public walletBalanceValue!: any;

  stockChartData: IData = {};
  insightsData!: IData;
  // newsData: IData[] = [];
  smaData: IData = {};

  // Charts Flags
  priceChartFlag: boolean = false;
  recommendationChartFlag: boolean = false;
  earningsChartFlag: boolean = false;
  smaChartFlag: boolean = false;

  Highcharts: typeof Highcharts=Highcharts;
  priceChartOptions!: Highcharts.Options;
  recommendationChartOptions!: Highcharts.Options;
  earningsChartOptions!: Highcharts.Options;
  smaChartOptions!: Highcharts.Options;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private currentStockService: CurrentStockService,
    private dialog: MatDialog
  ) {}

  
  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(async (params) => {
      const ticker = params.get('stockTicker');
      if (ticker && ticker !== '') {

        //  Alternative Approach
        this.getStockData(ticker);
        // this.checkMarketStatus(this.liveStockData["quote"]?.unix_time, this.liveStockData["quote"]?.t);

        let cycle = 0;
        this.fetchMarketData?.unsubscribe();
        this.fetchMarketData = interval(15000).subscribe(() => {
          // while (this.marketStatusFlag) {
            console.log("Refetch Cycle: ", cycle);
            this.dataService.fetchLiveStockData(ticker).subscribe((liveStockData) => {
                this.liveStockData = liveStockData;

                console.log('*************Live Stock Data: ', this.liveStockData);

                this.checkMarketStatus(this.liveStockData["quote"]?.unix_time, this.liveStockData["quote"]?.t);

                console.log("AAAA",this.marketStatusFlag);
                if (this.marketStatusFlag===true) {
                  console.log(`Refreshing data.`);           
                  // this.drawPriceChart(this.liveStockData);
                } else {
                  console.log(`No need to refresh data.`);
                } 

                this.currentStockService.liveStockData = this.liveStockData;
              
              });

              cycle+=1;

            // }

          });

      }
    });
  }

  // Function to get stock data if stored in cache or fetch from API
  getStockData(ticker: string): void {
    // Checking cached stock data

    // Stock data exists in cache
    if (this.currentStockService.stockTicker === ticker) {
      console.log('Stock Data Found in Cache');
      this.stockData = this.currentStockService.stockData;
      // console.log('Stock Data after fetching from Cache: ', this.stockData);
      this.stockExistsFlag = this.currentStockService.stockExistsFlag;

      this.liveStockData = this.currentStockService.liveStockData;

      // Fetch the Insights Data
      this.insightsData = this.currentStockService.insightsData;
      console.log('Insights Data: ', this.insightsData);

      // Fetch the SMA Charts Data
      this.smaData = this.currentStockService.smaData;

      // Fetching Company News Data for Latest News tab
      this.companyNews = this.currentStockService.companyNews;
      console.log('Company News' + this.companyNews);

      // Fetch the stock details from watchlist and portfolio
      this.dataService.fetchStockDetailsPageData(ticker).subscribe(data => {
        this.stockDetails = data;
        if (Object.keys(data.stockInWatchlist).length === 0) {
          console.log('Stock Not Found in Watchlist');
          this.starType = 'bi bi-star';
          this.starColor = 'black';
        } else {
          console.log('Stock Found in Watchlist');
          this.starType = 'bi bi-star-fill';
          this.starColor = 'yellow';
        }

        if (Object.keys(data.stockInPortfolio).length === 0) {
          console.log('Stock Not Found in Portfolio');
          this.sellButtonFlag = false;
        } else {
          console.log('Stock Found in Portfolio');
          this.sellButtonFlag = true;
        }

        // Caching the stock data
        this.currentStockService.stockDetails = this.stockDetails;
      });

      // Draw all the Charts
      if (Object.keys(this.stockData).length === 0) {
        console.log('Live Stock Data Not Found');
        this.priceChartFlag = false;
      } else {
        this.drawPriceChart(this.stockData);
        this.priceChartFlag = true;
      }

      if (Object.keys(this.insightsData).length === 0) {
        console.log('Insights Data Not Found');
        this.recommendationChartFlag = false;
        this.earningsChartFlag = false;
      } else {
        this.drawRecommendationChart(this.insightsData);
        this.drawEarningsChart(this.insightsData);
        this.recommendationChartFlag = true;
        this.earningsChartFlag = true;
      }

      if (Object.keys(this.smaData).length === 0) {
        console.log('SMA Data Not Found');
        this.smaChartFlag = false;
      } else {
        this.drawSMAChart(this.smaData, ticker);
        this.smaChartFlag = true;
      }

      this.stockFetchedFlag = this.currentStockService.stockFetchedFlag;
    }

    
    // Stock data does not exist in cache
    else {
      console.log('Stock Data Not Found in Cache. Fetching Data from APIs');
      this.stockFetchedFlag = false;

      // Fetch the complete Stock Data
      this.dataService.fetchStockData(ticker).subscribe(data => {
        this.stockData = data;
        console.log('Stock Data after fetchStockData Function: ', this.stockData);
        this.stockFetchedFlag = true;
        this.stockExistsFlag = Object.keys(this.stockData.companyProfile2).length !== 0 ? true : false;

        if (Object.keys(this.stockData).length === 0) {
          console.log('Live Stock Data Not Found');
          this.priceChartFlag = false;
        } else {
          this.drawPriceChart(this.stockData);
          this.priceChartFlag = true;
        }
        // this.drawPriceChart(this.stockData);

        // Caching the stock data
        this.currentStockService.stockTicker = ticker;
        this.currentStockService.stockData = this.stockData;
        this.currentStockService.stockFetchedFlag = this.stockFetchedFlag;
        this.currentStockService.stockExistsFlag = this.stockExistsFlag;
      

      // Fetch the live data
      this.dataService.fetchLiveStockData(ticker).subscribe(liveData => {
        this.liveStockData = liveData;
        console.log('Live Stock Data: ', this.liveStockData);
        this.checkMarketStatus(this.liveStockData["quote"]?.unix_time, this.liveStockData["quote"]?.t);

        // this.drawPriceChart(this.liveStockData);
        // if (Object.keys(this.liveStockData).length === 0) {
        //   console.log('Live Stock Data Not Found');
        //   this.priceChartFlag = false;
        // } else {
        //   this.drawPriceChart(this.liveStockData);
        //   this.priceChartFlag = true;
        // }
        this.currentStockService.liveStockData = this.liveStockData;
      });

      // Fetch the Insights Data
      this.dataService.fetchInsightsData(ticker).subscribe(data => {
        this.insightsData = data;
        console.log('Insights Data: ', this.insightsData);

        if (Object.keys(this.insightsData).length === 0) {
          console.log('Insights Data Not Found');
          this.recommendationChartFlag = false;
          this.earningsChartFlag = false;
        } else {
          this.drawRecommendationChart(this.insightsData);
          this.drawEarningsChart(this.insightsData);
          this.recommendationChartFlag = true;
          this.earningsChartFlag = true;
        }
        // Caching the stock data
        this.currentStockService.insightsData = this.insightsData;
      });

      // Fetch the SMA Charts Data
      this.dataService.fetchSMAChartsData(ticker).subscribe(data => {
        this.smaData = data;
        console.log('SMA Data: ', this.smaData);

        if (Object.keys(this.smaData).length === 0) {
          console.log('SMA Data Not Found');
          this.smaChartFlag = false;
        } else {
          this.drawSMAChart(this.smaData, ticker);
          this.smaChartFlag = true;
        }
        // this.drawSMAChart(this.smaData, ticker);

        // Caching the stock data
        this.currentStockService.smaData = this.smaData;
      });

      // Fetching Company News Data for Latest News tab
      this.companyNews = this.dataService.fetchCompanyNewsData(ticker);
      console.log('Company News' + this.companyNews);

      // Caching the stock data
      this.currentStockService.companyNews = this.companyNews;

      // Fetch the stock details from watchlist and portfolio
      this.dataService.fetchStockDetailsPageData(ticker).subscribe(data => {
        this.stockDetails = data;
        if (Object.keys(data.stockInWatchlist).length === 0) {
          console.log('Stock Not Found in Watchlist');
          this.starType = 'bi bi-star';
          this.starColor = 'black';
        } else {
          console.log('Stock Found in Watchlist');
          this.starType = 'bi bi-star-fill';
          this.starColor = 'yellow';
        }

        if (Object.keys(data.stockInPortfolio).length === 0) {
          console.log('Stock Not Found in Portfolio');
          this.sellButtonFlag = false;
        } else {
          console.log('Stock Found in Portfolio');
          this.sellButtonFlag = true;
        }

        // Caching the stock data
        this.currentStockService.stockDetails = this.stockDetails;
      });

    });
      
    }
  }


  // Function to check market status
  checkMarketStatus(unixTime: number, formattedTime: String): string {

    console.log('Unix Time: ', unixTime, 'Formatted Time: ', formattedTime);

    this.marketStatusFlag = ((new Date().getTime()-(unixTime*1000))/(1000))>300 ? false:true;

    if (this.marketStatusFlag === true) {
      this.marketDivColor = 'text-success';
      this.marketOpen = `Market is Open`;
    } else {
      this.marketDivColor = 'text-danger';
      this.marketOpen = `Market Closed on ${formattedTime.split(' ')[0]} 13:00:00`;
    }

    console.log(`${this.marketOpen}: `, (new Date().getTime()-(unixTime*1000))/(1000));

    return status
  }


  // Function to draw all the charts
  // drawCharts(): void {
  //   this.drawPriceChart(this.stockData);
  //   this.drawRecommendationChart(this.insightsData);
  //   this.drawEarningsChart(this.insightsData);
  //   this.drawSMAChart(this.smaData, this.stockData?.companyProfile2.ticker);
  // }


  ngOnDestroy() {
    this.fetchMarketData?.unsubscribe(); // Unsubscribe to prevent memory leaks
  }


  // Function to get today's date in PDT timezone
  getPDTDate(): string {
    const currentDate = new Date();
    const currentHour = currentDate.getUTCHours();
    const currentMinute = currentDate.getUTCMinutes();
    const currentPDTHour = (currentHour - 7) % 24; // UTC - 7 for PDT
    const currentPDTDate = new Date(currentDate.setHours(currentPDTHour));
    return currentPDTDate.toISOString().split('T')[0];
  }

  // Function to open the buy-modal component for buying or selling the stock
  openBuyModal(transactionType: string) {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.position = {
      top: '2%',
    };

    dialogConfig.width = '500px';

    this.buyStockData = {
      transactionType: transactionType,
      stockTicker: this.stockData?.companyProfile2.ticker,
      stockName: this.stockData?.companyProfile2.name,
      currentPrice: this.stockData?.quote.c
    };

    dialogConfig.data = {buyStockData: this.buyStockData};
    const dialogRef = this.dialog.open(BuyModalComponent, dialogConfig);


    dialogRef.afterClosed().subscribe(() => {
      console.log('Checking portfoliose');
      this.dataService.checkPortfolio(this.stockData?.companyProfile2.ticker).subscribe(
        data => {
          if (Object.keys(data).length === 0) {
            console.log('Checking Portfolio: Not Found', data);
            this.sellButtonFlag = false;
          } else {
            console.log('Checking Portfolio: Found', data);
            this.sellButtonFlag = true;
          }

          if (transactionType === 'buy') {
            this.dataService.checkPortfolio(this.stockData?.companyProfile2.ticker).subscribe(
              data => {
                console.log('Quantity: ', data.quantity, this.stockDetails.stockInPortfolio.quantity)
                if (this.stockDetails.stockInPortfolio.quantity === undefined) {this.stockDetails.stockInPortfolio.quantity = 0;};
                if (data.quantity > this.stockDetails.stockInPortfolio.quantity) {
                  this.stockDetails.stockInPortfolio.quantity = data.quantity;
                  this.buySuccessFlag = true;
                  setTimeout(() => { this.buySuccessFlag = false}, 2000);
                }
              });
            
          } else if (transactionType === 'sell') {
            this.dataService.checkPortfolio(this.stockData?.companyProfile2.ticker).subscribe(
              data => {
                if (Object.keys(data).length === 0) {
                  this.sellButtonFlag = false;
                  this.sellSuccessFlag = true;
                  setTimeout(() => { this.sellSuccessFlag = false}, 2000);
                } else {
                  console.log('Quantity: ', data.quantity, this.stockDetails.stockInPortfolio.quantity)
                  if (this.stockDetails.stockInPortfolio.quantity === undefined) {this.stockDetails.stockInPortfolio.quantity = 0;};
                  if (data.quantity < this.stockDetails.stockInPortfolio.quantity) {
                    this.stockDetails.stockInPortfolio.quantity = data.quantity;
                    this.sellSuccessFlag = true;
                    setTimeout(() => { this.sellSuccessFlag = false}, 2000);
                  }
                }
              });
          }
        },
        (error) => {
          console.error('Failed to fetch stock data', error);
        }
      );
    });
  }

  // Function to add or remove stock to watchlist, update watchlist and update star icon 
  updateStockInWatchlist(): void {
    if (this.starType === 'bi bi-star') {
      this.dataService.updateStockToWatchlist(this.stockData?.companyProfile2.ticker, this.stockData?.companyProfile2.name, 'add').subscribe(
        (response) => {
          console.log('Stock added to watchlist');
          this.starType = 'bi bi-star-fill';
          this.starColor = 'yellow';
          this.addedWatchlistFlag = true;
          setTimeout(() => { this.addedWatchlistFlag = false}, 2000);
        },
        (error) => {
          console.error('Failed to add stock to watchlist', error);
        }
      );
    } else {
      this.dataService.updateStockToWatchlist(this.stockData?.companyProfile2.ticker, this.stockData?.companyProfile2.name, 'remove').subscribe(
        (response) => {
          console.log('Stock removed from watchlist');
          this.starType = 'bi bi-star';
          this.starColor = 'black';
          this.removedWatchlistFlag = true;
          setTimeout(() => { this.removedWatchlistFlag = false}, 2000);
        },
        (error) => {
          console.error('Failed to remove stock from watchlist', error);
        }
      );
    }
  }

  // Functions to Display the HighCharts
  drawPriceChart(stockData: any): void {
    console.log('Draw Price Chart Function Called');
    console.log(stockData?.companyProfile2);
    this.priceChartOptions= {
      chart: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
      },
      accessibility: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        line: {
        marker: {
          enabled: false
        }
      }
    },
      title:
      {
        text: `${stockData?.companyProfile2?.ticker} Hourly Price Variation`
      },

      xAxis: {
        type: 'datetime'
      },

      yAxis: {
        labels: {
          align: 'left',
        },
        title: {
              text: ''
          },
          opposite: true,
          lineWidth: 0,
          resize: {
            enabled: false
          }
        },
      tooltip: {
        split: true
      },
      series: [
          {
            type: 'line',
            name: `${stockData?.companyProfile2.ticker}`,
            data: stockData?.stockCharts,
            yAxis: 0,
            threshold: null,
            tooltip: {
                valueDecimals: 2
            },
            color: stockData?.quote.d < 0 ? 'red': 'green'
          }
        ],
      };
  };

  // Function to draw the Recommendation Chart
  drawRecommendationChart(insightsData: any): void {
    console.log('Recommendation Price Chart Function Called');
    console.log(insightsData?.recommendations);
    this.recommendationChartOptions = {

      accessibility: {
          enabled: false
      },
      chart: {
          type: 'column',
          backgroundColor: 'rgba(0, 0, 0, 0.05)'
      },
  
      yAxis: {
          title: {
              text: 'Analysis'
          },
          stackLabels: {
              enabled: false
          },
          opposite: false,
          lineWidth: 0,
          resize: {
              enabled: false
          }
      },
      title: {
          text: 'Recommendation Trends',
          align: 'center'
      },
  
  
  
      plotOptions: {
          column: {
              stacking: 'normal',
              dataLabels: {
                  enabled: true
              }
          }
      },
  
  
      xAxis: {
          categories: insightsData?.recommendations.xAxis
      },

  
      series: [{
          name: 'Strong Buy',
          data: insightsData?.recommendations.yAxis.strongBuy,
          type:'column',
          color: '#008000'
      }, {
          name: 'Buy',
          data: insightsData?.recommendations.yAxis.buy,
          type:'column',
          color: '#04af70'
      }, {
          name: 'Hold',
          data: insightsData?.recommendations.yAxis.hold,
          type:'column',
          color: '#a68004'
      },
      {
        name: 'Sell',
        data: insightsData?.recommendations.yAxis.sell,
        type:'column',
        color: '#f28500'
    },
    {
      name: 'Strong Sell',
      data: insightsData?.recommendations.yAxis.strongSell,
      type:'column',
      color: '#800080'
  }] 
  
  };
  
  };
 
  // Function to draw the Earnings Chart
  drawEarningsChart(insightsData: any): void {
    console.log('Draw Earnings Chart Function Called');
    console.log(insightsData?.earnings);
    this.earningsChartOptions = {
        chart: {
            type: 'spline',
            backgroundColor: 'rgba(0, 0, 0, 0.05)'
        },
        accessibility: {
            enabled: false
        },
        title: {
            text: 'Historical EPS Suprises',
            align: 'center'
        },

        xAxis: {
          crosshair: true,
          categories: insightsData?.earnings.xAxis,
        },
        yAxis: {
            title: {
                text: 'Quarterly EPS'
            },
            opposite: false,
            lineWidth: 0,
            resize: {
                enabled: false
            }
        },
        tooltip: {
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 3
                }
            }
        },
        series: [{
            type: 'spline',
            name: 'Actual',
            marker: {
                symbol: 'circle'
            },
            data: insightsData["earnings"].yAxis.actual

        }, {
          type: 'spline',
          name: 'Estimate',
            marker: {
                symbol: 'diamond'
            },
            data: insightsData["earnings"].yAxis.estimate
        }]
    }
  };

  // Function to draw the SMA Chart
  drawSMAChart(smaData: any, ticker: string): void {
    console.log('Draw SMA Chart Function Called');
    console.log(smaData['ohlc']);
    this.smaChartOptions = {
        accessibility: {
            enabled: false
        },

        legend: {
          enabled: false
        },

        exporting: {
            enabled: true
        },

        rangeSelector: {
          enabled: true,
          inputEnabled: true,
          allButtonsEnabled: true,
          selected: 2,
          buttons: [
            {
              type: 'month',
              count: 1,
              text: '1m',
              title: 'View 1 month'
          }, {
              type: 'month',
              count: 3,
              text: '3m',
              title: 'View 3 months'
          }, {
              type: 'month',
              count: 6,
              text: '6m',
              title: 'View 6 months'
          }, {
              type: 'ytd',
              text: 'YTD',
              title: 'View year to date'
          }, {
              type: 'year',
              count: 1,
              text: '1y',
              title: 'View 1 year'
          }, {
              type: 'all',
              text: 'All',
              title: 'View all'
          }
          ]
        },

        title: {
            text: `${ticker} Historical`
        },

        subtitle: {
            text: 'With SMA and Volume by Price technical indicators'
        },

        navigator: {
            enabled: true
            // series: {
            //     accessibility: {
            //         exposeAsGroupOnly: true
            //     }
            // }
        },

        xAxis: {
          type: 'datetime'
        },

        yAxis: [{
            opposite: true,
            startOnTick: false,
            endOnTick: false,
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '60%',
            lineWidth: 2,
            resize: {
                enabled: true
            }
        }, {
            opposite: true,
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
        }],

        tooltip: {
            split: true
        },

        plotOptions: {
            series: {
                dataGrouping: {
                    units: [[
                        'week',                         // unit name
                        [2]                             // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]]
                }
            }
        },

        series: [{
            type: 'candlestick',
            name: ticker,
            id: ticker,
            zIndex: 2,
            data: smaData['ohlc']
        }, {
            type: 'column',
            name: 'Volume',
            id: 'volume',
            data: smaData['volume'],
            yAxis: 1
        }, {
            type: 'vbp',
            linkedTo: ticker,
            params: {
                volumeSeriesID: 'volume'
            },
            dataLabels: {
                enabled: false
            },
            zoneLines: {
                enabled: false
            }
        }, {
            type: 'sma',
            linkedTo: ticker,
            zIndex: 1,
            marker: {
                enabled: false
            }
        }]
    }
  }
}