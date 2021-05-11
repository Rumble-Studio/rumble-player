import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlComponent } from './control.component';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatIconModule } from '@angular/material/icon';

describe('ControlComponent', () => {
	let component: ControlComponent;
	let fixture: ComponentFixture<ControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ControlComponent],
			imports: [MatIconTestingModule, MatIconModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ControlComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
