import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';
import { NewsCardComponent } from './stock-details/news-card/news-card.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [RouterModule, RouterOutlet, SearchBarComponent, StockDetailsComponent, NewsCardComponent, FooterComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {

}
