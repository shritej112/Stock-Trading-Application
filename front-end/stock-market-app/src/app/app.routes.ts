import { Routes } from '@angular/router';
import { SearchPageComponent } from './search-page/search-page.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { StockDetailsComponent } from './search-page/stock-details/stock-details.component';

export const routes: Routes = [
    {
        path: 'search/home',
        component: SearchPageComponent,
        title: 'Search Page',
    },
    {
        path: 'search/:stockTicker',
        component: StockDetailsComponent,
        title: 'Stock Details'
    },
    {
        path: 'watchlist',
        component: WatchlistComponent,
        title: 'Watchlist'
    },
    {
        path: 'portfolio',
        component: PortfolioComponent,
        title: 'Portfolio'
    },
    {
        path: '',
        redirectTo: '/search/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'search/home'
    }
];
