import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FaqQuestionItem {
  id: string;
  title: string;
  answer: string;
  type: string;
}

export interface FaqPageItem {
  id: string;
  title: string;
  content: FaqQuestionItem[];
}

export interface FaqCategoryItem {
  id: string;
  icon: string;
  title: string;
  route: string;
}

@Injectable({ providedIn: 'root' })
export class FaqService {
  private http = inject(HttpClient);

  getFaqCategories(): Observable<FaqCategoryItem[]> {
    return this.http.get<FaqCategoryItem[]>('/api/faq/categories');
  }

  searchFaqQuestions(query: string): Observable<FaqQuestionItem[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<FaqQuestionItem[]>('/api/faq/search', { params });
  }

  getFaqPageById(id: string): Observable<FaqPageItem> {
    return this.http.get<FaqPageItem>(`/api/faq/categories/${id}`);
  }
}