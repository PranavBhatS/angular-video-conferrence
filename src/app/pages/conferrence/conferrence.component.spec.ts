import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferrenceComponent } from './conferrence.component';

describe('ConferrenceComponent', () => {
  let component: ConferrenceComponent;
  let fixture: ComponentFixture<ConferrenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConferrenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferrenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
