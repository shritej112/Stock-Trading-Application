import { Component, Input, Inject, OnInit } from '@angular/core';
import { INewsCardData } from '../../../../interfaces/newsCard';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent{
  // @Input() newsCardData!: INewsCardData;
  newsCardData;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.newsCardData = data.newsCardData;
  }
}
