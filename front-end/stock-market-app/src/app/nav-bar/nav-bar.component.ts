import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CurrentStockService } from '../services/current-stock.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [ RouterModule, CommonModule ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  activeTab = 'search';

  constructor(private router: Router, private currentStockService: CurrentStockService) { }

  redirectSearch() {
    if (this.currentStockService.stockTicker) {
      this.router.navigate(['/search',`${this.currentStockService.stockTicker}`]);
    } else {
      this.router.navigate(['/search', 'home']);
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
