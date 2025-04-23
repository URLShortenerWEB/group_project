import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShortURL, CreateShortURL } from './models/short-url.model';

@Injectable({ providedIn: 'root' })
export class ShortenerService {
  private readonly API_URL = 'http://localhost:8000/api/shortener/';

  constructor(private http: HttpClient) {}

  createShortURL(data: CreateShortURL): Observable<ShortURL> {
    return this.http.post<ShortURL>(this.API_URL, data);
  }

  getMyURLs(ownerId: number): Observable<ShortURL[]> {
    return this.http.get<ShortURL[]>(`${this.API_URL}owner/${ownerId}/`);
  }
}
