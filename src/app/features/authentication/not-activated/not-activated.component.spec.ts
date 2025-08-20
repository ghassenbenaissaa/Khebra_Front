import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotActivatedComponent } from './not-activated.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotActivatedComponent', () => {
  let component: NotActivatedComponent;
  let fixture: ComponentFixture<NotActivatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotActivatedComponent, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(NotActivatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 