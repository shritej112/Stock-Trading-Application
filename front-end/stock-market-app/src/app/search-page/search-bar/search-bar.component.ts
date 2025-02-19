import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrentStockService } from '../../services/current-stock.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [RouterModule, CommonModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule, AsyncPipe, HttpClientModule, MatProgressSpinnerModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  providers: [HttpClient]
})
export class SearchBarComponent implements OnInit {

  public stockTicker = '';
  // Declare variables
  control = new FormControl();
  filteredSearchData!: Observable<string[]>;
  filteredResult!: Observable<any[]>;

  stocksDataFetchingFlag: boolean = false;

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, private currentStockService: CurrentStockService, private router: Router) {
    this.putStockTickerInSearchBar();
  }

  // Function to initialize component
  ngOnInit() {
    
    // this.filteredResult = this.control.valueChanges.pipe(
    //   debounceTime(200),
    //   distinctUntilChanged(),
    //   switchMap(value => this.dataService.fetchSearchData(value)),
    //   catchError(() => []),
    //   tap(() => {
    //   this.changeStocksDataFetchedFlag();
    //   })
    // );

    this.filteredResult = this.control.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => this.stocksDataFetchingFlag = true),
      switchMap(value => this.dataService.fetchSearchData(value)),
      catchError(() => []),
      tap(() => this.stocksDataFetchingFlag = false)
    );
  }

  // Function to put the stock ticker in the search bar
  putStockTickerInSearchBar() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (params.has('stockTicker')) {
        this.control.setValue(params.get('stockTicker'));
      }
    });
  }

  // Function to clear data
  clearData() {
    this.currentStockService.clearData();
    this.router.navigate(['/search/home']);

  }

// private getData(value: string): string[] {
//   let temp: any; 
//   let return_data: string[] = [];
//   this.dataService.fetchSearchData(value).subscribe(data => {
//     temp = data;
//     for (let i=0; i< temp.length; i++){
//       return_data.push(`${temp[i]['symbol']} | ${temp[i]['description']}`);
//     }
//   })
  
//   return return_data;
// }

}