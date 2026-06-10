import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotFound } from './page-not-found';

describe('PageNotFound', () => {
  let component: PageNotFound;
  let fixture: ComponentFixture<PageNotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFound],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the 404 status code as the primary heading', () => {
    fixture.detectChanges();

    const heading: HTMLHeadingElement | null = fixture.nativeElement.querySelector('h1');

    expect(heading).toBeTruthy();
    expect(heading?.textContent?.trim()).toBe('404');
    expect(heading?.classList.contains('text-9xl')).toBeTruthy();
  });

  it('should center the not-found content in the main landmark', () => {
    fixture.detectChanges();

    const main: HTMLElement | null = fixture.nativeElement.querySelector('main');

    expect(main).toBeTruthy();
    expect(main?.classList.contains('flex')).toBeTruthy();
    expect(main?.classList.contains('flex-col')).toBeTruthy();
    expect(main?.classList.contains('justify-center')).toBeTruthy();
    expect(main?.classList.contains('items-center')).toBeTruthy();
    expect(main?.classList.contains('h-11/12')).toBeTruthy();
  });
});
