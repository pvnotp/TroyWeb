import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHttpExampleComponent } from './table-http-example.component';

describe('TableHttpExampleComponent', () => {
  let component: TableHttpExampleComponent;
  let fixture: ComponentFixture<TableHttpExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHttpExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableHttpExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
