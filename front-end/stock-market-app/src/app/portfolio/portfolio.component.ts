import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioCardComponent } from './portfolio-card/portfolio-card.component';
import { DataService } from '../services/data-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, PortfolioCardComponent, MatProgressSpinnerModule, FooterComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit{

  portfolioStocks: any[] = [];
  portfolioAlert: boolean = true;
  walletBalance!: number;
  progressSpinnerFlag: boolean = true;

  buySuccessFlag: boolean = false;
  sellSuccessFlag: boolean = false;

  stockSymbol!: string;

  constructor(private dataService: DataService) {

  }

  ngOnInit() {
    this.fetchPortfolio();
  }

  fetchPortfolio() {
    this.dataService.fetchPortfolioData().subscribe((portfolioData: any) => {
      this.walletBalance = portfolioData.balance;
      this.portfolioStocks = portfolioData.portfolioList;
      this.portfolioStocks.length > 0 ? this.portfolioAlert = false : this.portfolioAlert = true;
      this.progressSpinnerFlag = false;
    });
  }

  refreshPortfolioFunc = () => {
    console.log('Refreshing portfolio');
    this.fetchPortfolio();
  }

  onSuccessTransaction(signal: any){
    console.log('From porfolio card: ', signal);
    if (signal.status === 'success') {
      this.stockSymbol = signal.stockSymbol;
      if (signal.action === 'buy') {
        this.buySuccessFlag = true;
        setTimeout(() => { this.buySuccessFlag = false}, 2000);
      } else {
        this.sellSuccessFlag = true;
        setTimeout(() => { this.sellSuccessFlag = false}, 2000);
      }
    }
  }
}
