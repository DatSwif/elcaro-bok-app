import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { OffersService } from '../offers-service';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Offer {
  id: number;
  title: string;
  subtitle: string;
  image_url: string | null;
  category: string;
  tags: string[];
  featured: boolean;
}

interface Filter {
  name: string;
  type: 'tag' | 'category';
  label: string;
}

@Component({
  selector: 'app-offers-main',
  imports: [CommonModule, CarouselModule, RouterModule],
  templateUrl: './offers-main.html',
  styleUrl: './offers-main.css',
})
export class OffersMain implements OnInit {
  private offersService = inject(OffersService);

  private labelMap: Record<string, string> = {
    'PROMO': $localize`:@@filter.tag.promo:Promocje`,
    'INTERNET': $localize`:@@filter.cat.internet:Internet`,
    'TV': $localize`:@@filter.cat.tv:Telewizja`,
    'INTERNET_TV': $localize`:@@filter.cat.bundle:Internet + Telewizja`,
    'MOBILE': $localize`:@@filter.cat.mobile:Telefon`,
    'DEVICES': $localize`:@@filter.cat.devices:Urządzenia`
  };

  carouselResponsiveOptions = [
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
  ]

  offers = signal<Offer[]>([]);
  selectedFilter = signal<Filter>({ name: 'PROMO', type: 'tag', label: this.labelMap['PROMO'] });

  constructor(
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit() {
    this.offersService.getOffers().subscribe((data) => {
      this.offers.set(data);
    });
  }

  featuredOffers = computed(() => 
    this.offers().filter(o => o.featured)
  );

  filterButtons = computed(() => {
    const allOffers = this.offers();
    
    // Extract unique tags and map them to localized labels
    const tags = Array.from(new Set(allOffers.flatMap(o => o.tags)))
      .map(t => ({ 
        name: t, 
        type: 'tag' as const, 
        label: this.labelMap[t] || t // Fallback to raw string if missing in map
      }));

    // Extract unique categories and map them
    const categories = Array.from(new Set(allOffers.map(o => o.category)))
      .map(c => ({ 
        name: c, 
        type: 'category' as const, 
        label: this.labelMap[c] || c.replace('_', ' + ')
      }));

    return [...tags, ...categories].sort();
  });

  filteredOffers = computed(() => {
    const filter = this.selectedFilter();
    const allOffers = this.offers();

    if (filter.type === 'tag') {
      return allOffers.filter(o => o.tags.includes(filter.name));
    } else {
      return allOffers.filter(o => o.category === filter.name);
    }
  });

  toggleFilter(filter: Filter) {
    this.selectedFilter.set(filter);
  }

  private failedImageIds = signal<Set<number>>(new Set());

  shouldShowGradient(offer: Offer): boolean {
    return !offer.image_url || this.failedImageIds().has(offer.id);
  }

  handleImageError(id: number) {
    this.failedImageIds.update(set => {
      const newSet = new Set(set);
      newSet.add(id);
      return newSet;
    });
  }
}
