import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MedusaStore } from './medusa-store.';

describe('MedusaStore', () => {
  let component: MedusaStore;
  let fixture: ComponentFixture<MedusaStore>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MedusaStore],
    }).compileComponents();

    fixture = TestBed.createComponent(MedusaStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
