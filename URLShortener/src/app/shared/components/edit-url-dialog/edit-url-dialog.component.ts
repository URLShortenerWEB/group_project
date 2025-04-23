import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-url-dialog',
  templateUrl: './edit-url-dialog.component.html',
  styleUrls: ['./edit-url-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class EditUrlDialogComponent {
  urlControl: FormControl;

  constructor(
    public dialogRef: MatDialogRef<EditUrlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { originalUrl: string }
  ) {
    this.urlControl = new FormControl(this.data.originalUrl, [
      Validators.required,
      Validators.pattern(/^(http|https):\/\/[^ "]+$/),
    ]);
  }
}
