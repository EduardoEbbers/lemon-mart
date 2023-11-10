import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-simple-dialog',
  templateUrl: './simple-dialog.component.html',
  styleUrls: ['./simple-dialog.component.css']
})
export class SimpleDialogComponent {
  constructor(public dialogRef: MatDialogRef<SimpleDialogComponent, boolean>, @Inject(MAT_DIALOG_DATA) public data: any) { }
}
