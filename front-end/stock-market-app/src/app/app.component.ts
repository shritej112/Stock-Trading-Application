import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SearchBarComponent } from './search-page/search-bar/search-bar.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { StockDetailsComponent } from './search-page/stock-details/stock-details.component';
import { NewsCardComponent } from './search-page/stock-details/news-card/news-card.component';
import { ModalComponent } from './search-page/stock-details/news-card/modal/modal.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, RouterOutlet, RouterModule, NavBarComponent, SearchBarComponent, SearchPageComponent, StockDetailsComponent, NewsCardComponent, ModalComponent, WatchlistComponent, PortfolioComponent, FooterComponent, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stock-market-app';
}
