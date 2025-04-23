import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../shortener/models/short-url.model';

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
    MatSelectModule,
  ],
})
export class EditUrlDialogComponent {
  urlControl: FormControl;
  categoryControl = new FormControl<number | null>(null);
  categories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditUrlDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      originalUrl: string;
      categoryId?: number | null;
      categories: Category[];
    }
  ) {
    this.urlControl = new FormControl(data.originalUrl, [
      Validators.required,
      Validators.pattern(/^(http|https):\/\/[^ "]+$/),
    ]);
    this.categoryControl.setValue(data.categoryId ?? null);
    this.categories = data.categories;
  }

  save(): void {
    if (this.urlControl.valid) {
      this.dialogRef.close({
        original_url: this.urlControl.value,
        category_id: this.categoryControl.value,
      });
    }
  }
}
