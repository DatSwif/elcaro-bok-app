import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, take, switchMap, catchError, of, tap } from 'rxjs';
import { FaqService, FaqCategoryItem, FaqQuestionItem } from '../faq-service';

@Component({
  selector: 'app-faq-help',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './faq-help.html',
  styleUrl: './faq-help.css',
})
export class FaqHelp implements OnInit {
  private faqService = inject(FaqService);

  faqCategories = signal<FaqCategoryItem[]>([]);
  searchResults = signal<FaqQuestionItem[]>([]);
  
  searchText = '';
  ready = signal(false);
  searching = signal(false);
  hasSearched = signal(false);
  emptySearchError = signal(false);

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.faqService.getFaqCategories().pipe(take(1)).subscribe({
      next: (categories) => {
        this.faqCategories.set(categories);
        this.ready.set(true);
      },
      error: () => {
        this.faqCategories.set([]);
        this.ready.set(true);
      },
    });

    this.searchSubject.pipe(
      tap(() => this.searching.set(true)),
      switchMap(query => this.faqService.searchFaqQuestions(query).pipe(
        catchError(() => of([])) 
      ))
    ).subscribe((results) => {
      this.searchResults.set(results);
      this.searching.set(false);
    });
  }

  onInputChange() {
    if (!this.searchText.trim()) {
      this.clearSearch();
    }
  }

  onSearch() {
    const query = this.searchText.trim();

    if (!query) {
      this.emptySearchError.set(true);
      this.clearSearch();
      return;
    }

    this.emptySearchError.set(false);
    this.hasSearched.set(true);
    
    this.searchSubject.next(query);
  }

  private clearSearch() {
    this.hasSearched.set(false);
    this.searching.set(false);
    this.searchResults.set([]);
  }
}