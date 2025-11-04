export interface SliderConfig {
  sliderSelector: string;
  prevBtnId: string;
  nextBtnId: string;
  dotsContainerSelector: string;
  cardSelector: string;
  cardWidth: number;
  gap: number;
}

export class AlbumSlider {
  private slider: HTMLElement | null;
  private prevBtn: HTMLButtonElement | null;
  private nextBtn: HTMLButtonElement | null;
  private dotsContainer: HTMLElement | null;
  private cards: NodeListOf<Element>;
  private cardWidth: number;
  private visibleCards: number;
  private totalSlides: number;
  private currentSlide: number = 0;
  private touchStartX: number = 0;
  private touchEndX: number = 0;

  constructor(config: SliderConfig) {
    this.slider = document.querySelector<HTMLElement>(config.sliderSelector);
    this.prevBtn = document.getElementById(config.prevBtnId) as HTMLButtonElement;
    this.nextBtn = document.getElementById(config.nextBtnId) as HTMLButtonElement;
    this.dotsContainer = document.querySelector<HTMLElement>(config.dotsContainerSelector);

    if (!this.slider || !this.prevBtn || !this.nextBtn || !this.dotsContainer) {
      throw new Error('Required slider elements not found');
    }

    this.cards = this.slider.querySelectorAll(config.cardSelector);
    this.cardWidth = config.cardWidth + config.gap;
    this.visibleCards = this.getVisibleCards();
    this.totalSlides = Math.ceil(this.cards.length / this.visibleCards);
  }

  private getVisibleCards(): number {
    return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  }

  public init(): void {
    this.createDots();
    this.attachEventListeners();
    this.updateSlider();
  }

  private createDots(): void {
    if (!this.dotsContainer) return;

    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir a slide ${i + 1}`);
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  private updateSlider(): void {
    if (!this.slider || !this.prevBtn || !this.nextBtn || !this.dotsContainer) return;

    const offset = -this.currentSlide * this.cardWidth * this.visibleCards;
    this.slider.style.transform = `translateX(${offset}px)`;

    const dots = this.dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });

    this.prevBtn.disabled = this.currentSlide === 0;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
  }

  private goToSlide(index: number): void {
    this.currentSlide = Math.max(0, Math.min(index, this.totalSlides - 1));
    this.updateSlider();
  }

  private handlePrev(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSlider();
    }
  }

  private handleNext(): void {
    if (this.currentSlide < this.totalSlides - 1) {
      this.currentSlide++;
      this.updateSlider();
    }
  }

  private handleTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
  }

  private handleTouchEnd(e: TouchEvent): void {
    this.touchEndX = e.changedTouches[0].clientX;
    const swipeThreshold = 50;

    if (this.touchStartX - this.touchEndX > swipeThreshold) {
      this.handleNext();
    } else if (this.touchEndX - this.touchStartX > swipeThreshold) {
      this.handlePrev();
    }
  }

  private attachEventListeners(): void {
    if (!this.prevBtn || !this.nextBtn || !this.slider) return;

    this.prevBtn.addEventListener('click', () => this.handlePrev());
    this.nextBtn.addEventListener('click', () => this.handleNext());
    this.slider.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.slider.addEventListener('touchend', (e) => this.handleTouchEnd(e));
  }
}

export function initAlbumSlider(): void {
  try {
    const slider = new AlbumSlider({
      sliderSelector: '.albums-track',
      prevBtnId: 'slider-prev',
      nextBtnId: 'slider-next',
      dotsContainerSelector: '.slider-dots',
      cardSelector: '.album-card',
      cardWidth: 320,
      gap: 24,
    });
    slider.init();
  } catch (error) {
    console.error('Failed to initialize album slider:', error);
  }
}
