import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { INewsCardData } from '../../../interfaces/newsCard';
import { ModalComponent } from './modal/modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-news-card',
  standalone: true,
  imports: [ModalComponent, NgbModule],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css'
})
export class NewsCardComponent {

  @Input() newsCardData!: INewsCardData;

  constructor(private dialog: MatDialog) {}

  openModal() {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.position = {
      top: '2%',
    };

    dialogConfig.width = '500px';

    dialogConfig.data = {newsCardData: this.newsCardData};
    
    // const dialogRef = this.dialog.open(ModalComponent, {
    //   width: '40%',
    //   height: '50%',
    //   minWidth: '50vw',
    //   minHeight: '90vh',
    //   position: {top: '2%', left: '30%'},
    //   data: {newsCardData: this.newsCardData}});

  const dialogRef = this.dialog.open(ModalComponent, dialogConfig);
  }
}
