import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data-service.service';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-buy-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatFormField, MatFormFieldModule],
  templateUrl: './buy-modal.component.html',
  styleUrl: './buy-modal.component.css'
})
export class BuyModalComponent {
  buyStockData;
  buyFlag;
  public walletBalance!: any;
  quantity!: number;
  existingQuantity: number = 0;
  totalPrice: number = 0;

  signal = { 'stockSymbol': '', 'action': '', 'status': '' };

  // executableFunc!: any;

  btnFlag: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService, public buyModalComponent: MatDialogRef<BuyModalComponent>) {
    this.buyStockData = data.buyStockData;
    // this.executableFunc = this.buyStockData.executableFunc;

    // console.log('Function:  aaaaaaa ', this.executableFunc);
    this.quantity = 0;
    
    if (this.buyStockData.transactionType == 'buy') {
      this.buyFlag = true
    }
    else {
      this.buyFlag = false
    }

    // Fetch stock details from portfolio and wallet balance
    this.dataService.fetchBuyModalData(this.buyStockData.stockTicker).subscribe(
      data => {
        this.walletBalance = data.walletBalance;
        this.existingQuantity = data.stockInPortfolio.quantity;
        console.log('Wallet balance: ', this.walletBalance);
        console.log('Existing quantity: ', this.existingQuantity);
      },
      (error) => {
        console.error('Failed to fetch stock data', error);
      }
    );
  }


  // Function to buy stock
  buyStock(): void {
    try{
      console.log('Quantity: ', this.quantity);
      if (this.quantity > 0) {
        const totalPrice = this.quantity * this.buyStockData.currentPrice;
        if (totalPrice <= this.walletBalance) {
          this.dataService.buyStock(this.buyStockData.stockTicker, this.buyStockData.stockName, this.quantity, this.buyStockData.currentPrice).subscribe(
            (response) => {
              // Update wallet balance
              this.walletBalance -= totalPrice;
              // Handle success response
              console.log('Stock bought successfully');
              this.dataService.updateWalletBalance(this.walletBalance).subscribe((response) => {
                console.log('Wallet balance updated successfully');
              });
              this.signal = { 'stockSymbol': this.buyStockData.stockTicker, 'action': 'buy', 'status': 'success' };
              this.buyModalComponent.close(this.signal)
              // return response;
            },
            (error) => {
              // Handle error response
              console.error('Failed to buy stock', error);
              this.signal = { 'stockSymbol': this.buyStockData.stockTicker, 'action': 'buy', 'status': 'fail' };
              this.buyModalComponent.close(this.signal)
            }
          );
        } else {
          console.error('Insufficient balance in wallet');
          this.signal = { 'stockSymbol': this.buyStockData.stockTicker, 'action': 'buy', 'status': 'fail' };
          this.buyModalComponent.close(this.signal)
        }
      } else {
        console.error('Invalid quantity');
        this.signal = { 'stockSymbol': this.buyStockData.stockTicker, 'action': 'buy', 'status': 'fail' };
              this.buyModalComponent.close(this.signal)
      }
    } catch (error) {
      console.error('Failed to buy stock', error);
      this.signal = { 'stockSymbol': this.buyStockData.stockTicker, 'action': 'buy', 'status': 'fail' };
      this.buyModalComponent.close(this.signal)
    }
  }

  // Function to sell stock
  sellStock(): void {
    console.log('Quantity: ', this.quantity);
    if (this.quantity > 0 && this.quantity <= this.existingQuantity) {
      const totalPrice = this.quantity * this.buyStockData.currentPrice;
      this.dataService.sellStock(this.buyStockData.stockTicker, this.buyStockData.stockName, this.quantity, this.buyStockData.currentPrice).subscribe(
        (response) => {
          // Update wallet balance
          this.walletBalance += totalPrice;
          // Handle success response
          console.log('Stock sold successfully');
          this.dataService.updateWalletBalance(this.walletBalance).subscribe((response) => {
            console.log('Wallet balance updated successfully');
          });
          this.signal = { 'stockSymbol': this.buyStockData.stockTicker, 'action': 'sell', 'status': 'success' };
          this.buyModalComponent.close(this.signal)
        },
        (error) => {
          // Handle error response
          console.error('Failed to sell stock', error);
          this.signal = { 'stockSymbol': this.buyStockData.stockTicker, 'action': 'sell', 'status': 'fail' };
      this.buyModalComponent.close(this.signal)
        }
      );
    } else {
      console.error('Invalid quantity');
      this.signal = { 'stockSymbol': this.buyStockData.stockTicker, 'action': 'sell', 'status': 'fail' };
      this.buyModalComponent.close(this.signal)
    }
  }
}