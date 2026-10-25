import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FaqService, FaqPageItem, FaqQuestionItem } from '../../faq-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq-details-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './faq-details-page.html',
  styleUrl: './faq-details-page.css',
})
export class FaqDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private faqService = inject(FaqService);

  pageData = signal<FaqPageItem | undefined>(undefined);
  ready = signal(false);

  groupedQuestions = computed(() => {
    const data = this.pageData();
    if (!data) return {} as Record<string, FaqQuestionItem[]>;

    return data.content.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, FaqQuestionItem[]>);
  });

  groupNames = computed(() => Object.keys(this.groupedQuestions()));

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
        const categoryId = params.get('id');

        if (!categoryId) {
        this.ready.set(true);
        return;
        }

        this.faqService.getFaqPageById(categoryId).subscribe((data) => {
        this.pageData.set(data);
        this.ready.set(true);
        });
    });
  }
}