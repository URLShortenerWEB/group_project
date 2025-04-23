import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ShortenerService } from '../shortener.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { CommonModule, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-create-url',
  templateUrl: './create-url.component.html',
  styleUrls: ['./create-url.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatError,
  ],
})
export class CreateUrlComponent {
  form: FormGroup;
  shortUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private shortenerService: ShortenerService,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard
  ) {
    this.form = this.fb.group({
      original_url: [
        '',
        [Validators.required, Validators.pattern('https?://.+')],
      ],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.shortenerService.createShortURL(this.form.value).subscribe({
        next: (response) => {
          this.shortUrl = response.short_url;
          this.snackBar.open('URL успешно сокращен!', 'Закрыть', {
            duration: 3000,
          });
        },
        error: () => {
          this.snackBar.open(
            'Ошибка при создании сокращенной ссылки',
            'Закрыть',
            { duration: 3000 }
          );
        },
      });
    }
  }

  copyToClipboard(): void {
    if (this.shortUrl) {
      this.clipboard.copy(this.shortUrl);
      this.snackBar.open('Ссылка скопирована!', 'Закрыть', { duration: 2000 });
    }
  }
}
