import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ShortURL } from '../../../shortener/models/short-url.model';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-url-table',
  templateUrl: './url-table.component.html',
  styleUrls: ['./url-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    TruncatePipe,
  ],
})
export class UrlTableComponent {
  @Input() urls: ShortURL[] = [];
  displayedColumns: string[] = [
    'original_url',
    'short_url',
    'click_count',
    'created_at',
    'actions',
  ];

  constructor(private clipboard: Clipboard, private snackBar: MatSnackBar) {}

  copyToClipboard(text: string): void {
    this.clipboard.copy(text);
    this.snackBar.open('Ссылка скопирована!', 'Закрыть', { duration: 2000 });
  }
}
