import { Component, OnInit } from '@angular/core';
import { ShortenerService } from '../shortener.service';
import { AuthService } from '../../auth/auth.service';
import { ShortURL } from '../models/short-url.model';
import { CommonModule, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UrlTableComponent } from '../../shared/components/url-table/url-table.component';

@Component({
  selector: 'app-my-urls',
  templateUrl: './my-urls.component.html',
  styleUrls: ['./my-urls.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    MatCardModule,
    MatProgressSpinnerModule,
    UrlTableComponent,
  ],
})
export class MyUrlsComponent implements OnInit {
  urls: ShortURL[] = [];
  isLoading = true;

  constructor(
    private shortenerService: ShortenerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMyURLs();
  }

  loadMyURLs(): void {
    if (this.authService.userId) {
      this.shortenerService.getMyURLs(this.authService.userId).subscribe({
        next: (urls) => {
          this.urls = urls;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
