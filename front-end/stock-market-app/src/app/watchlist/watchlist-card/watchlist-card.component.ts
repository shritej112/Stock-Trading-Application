import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data-service.service';
import { RouterModule } from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-watchlist-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './watchlist-card.component.html',
  styleUrl: './watchlist-card.component.css'
})
export class WatchlistCardComponent {
  public caretType!: string;
  public caretColor!: string;
  
  constructor(private dataService: DataService) {}

  @Input() watchlistStock!: any;
  @Output() refreshWatchlistStocks = new EventEmitter<string>();

  removeStock() {
    console.log('watchlisting clicked: ', this.watchlistStock?.stockSymbol, this.watchlistStock?.stockName);
    this.dataService.updateStockToWatchlist(this.watchlistStock?.stockSymbol, this.watchlistStock?.stockName, 'remove').subscribe((watchlistStatus) => {
      // location.reload();
      this.refreshWatchlistStocks.emit(this.watchlistStock?.stockSymbol);
    });
  }
}
