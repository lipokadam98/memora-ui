import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notes } from './notes';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('Notes', () => {
  let component: Notes;
  let fixture: ComponentFixture<Notes>;

  @Component({ template: '' })
  class DummyComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Notes,
        TranslateModule.forRoot(),
        RouterModule.forRoot([
          {
            path: 'authentication',
            component: DummyComponent,
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Notes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the notes title with the correct translation key', () => {
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('h1.text-4xl');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('notes.title');
  });
});
