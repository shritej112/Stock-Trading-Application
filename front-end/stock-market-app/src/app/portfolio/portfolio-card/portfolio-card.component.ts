import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BuyModalComponent } from '../../search-page/stock-details/buy-modal/buy-modal.component';
import { DataService } from '../../services/data-service.service';

@Component({
  selector: 'app-portfolio-card',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, BuyModalComponent],
  templateUrl: './portfolio-card.component.html',
  styleUrl: './portfolio-card.component.css'
})
export class PortfolioCardComponent {

  public caretType!: string;
  public caretColor!: string;
  public stockData!: any;

  @Input() refreshPortfolioFunc!: any;

  @Input() portfolioStock!: any;
  @Output() successTransaction: EventEmitter<any>  = new EventEmitter<any>();

  constructor(private dataService: DataService, private matDialog: MatDialog) {}

  openBuyModal(transactionType: string) {
    this.stockData = {
      transactionType: transactionType,
      stockTicker: this.portfolioStock?.stockSymbol,
      stockName: this.portfolioStock?.stockName,
      currentPrice: this.portfolioStock?.latestPrice,
      executableFunc: this.refreshPortfolioFunc
    };
    const dialogRef = this.matDialog.open(BuyModalComponent, {
      width: '500px',
      position: {top: '2%'},
      data: {buyStockData: this.stockData}});
    
    dialogRef.afterClosed().subscribe((signal)  => {
        console.log('aaaaaaaaaaaaaaaaaa');
        // this.sendSuccessSignal(transactionType);
        this.sendSignal(signal);
        this.refreshPortfolioFunc();
    });
  }

  sendSignal(signal: any) {
    console.log('Signal from Buy/Sell Modal: ', signal);
    this.successTransaction.emit(signal);
  }

  // sendSuccessSignal(transactionType: string) {
  //   console.log('Sending success signal');
  //   let status = 'fail';
  //   if (transactionType === 'buy') {
  //     this.dataService.checkPortfolio(this.stockData.stockTicker).subscribe(
  //       data => {
  //         console.log('Quantity: ', data.quantity, this.portfolioStock.quantity)
  //         if (this.portfolioStock.quantity === undefined) {this.portfolioStock.quantity = 0;};
  //         if (data.quantity > this.portfolioStock.quantity) {
  //           // this.portfolioStock.quantity = data.quantity;
  //           // this.buySuccessFlag = true;
  //           // setTimeout(() => { this.buySuccessFlag = false}, 2000);
  //           status = 'success';
  //         }
  //       });
      
  //   } else if (transactionType === 'sell') {
  //     this.dataService.checkPortfolio(this.stockData.stockTicker).subscribe(
  //       data => {
  //         if (Object.keys(data).length === 0) {
  //           // this.sellButtonFlag = false;
  //           // this.sellSuccessFlag = true;
  //           // setTimeout(() => { this.sellSuccessFlag = false}, 2000);
  //           status = 'success';
  //         } else {
  //           console.log('Quantity: ', data.quantity, this.portfolioStock.quantity)
  //           if (this.portfolioStock.quantity === undefined) {this.portfolioStock.quantity = 0;};
  //           if (data.quantity < this.portfolioStock.quantity) {
  //             // this.portfolioStock.quantity = data.quantity;
  //             // this.sellSuccessFlag = true;
  //             // setTimeout(() => { this.sellSuccessFlag = false}, 2000);
  //             status = 'success';
  //           }
  //         }
  //       });
  //   }

  //   const signal = { 'stockSymbol': this.portfolioStock.stockSymbol, 'action': transactionType, 'status': status };
  //   this.successTransaction.emit(signal);
  // }

  // closeModalSignal() {
  //   this.refreshPortfolio.emit();
  // }
}
