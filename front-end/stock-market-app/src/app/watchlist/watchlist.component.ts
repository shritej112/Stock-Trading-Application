import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchlistCardComponent } from './watchlist-card/watchlist-card.component';
import { DataService } from '../services/data-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [WatchlistCardComponent, CommonModule, MatProgressSpinnerModule, FooterComponent],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent {

  watchlistStocks: any[] = [];
  watchlistAlert: boolean = false;
  progressSpinnerFlag: boolean = true;

  constructor(private dataService: DataService) {
    this.fetchWatchlist();
  }

  fetchWatchlist() {
    this.dataService.fetchWatchlistData().subscribe((watchlistStocks: any[]) => {
      this.watchlistStocks = watchlistStocks;
      this.watchlistStocks.length > 0 ? this.watchlistAlert = false : this.watchlistAlert = true;
      
      this.progressSpinnerFlag = false;
    });
  }

  refreshWatchlistStocks(tickerSymbol: string) {
    console.log("removing stock from watchlist:", tickerSymbol);
    // this.watchlistedStocks.filter((arrayItem) => arrayItem['ticker']===tickerSymbol);
    this.fetchWatchlist();
  }
}
