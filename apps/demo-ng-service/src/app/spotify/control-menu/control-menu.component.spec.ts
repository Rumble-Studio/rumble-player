import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { ControlMenuComponent } from './control-menu.component';
import { MatIconModule } from '@angular/material/icon';

describe('ControlMenuComponent', () => {
	let component: ControlMenuComponent;
	let fixture: ComponentFixture<ControlMenuComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ControlMenuComponent],
			imports: [MatIconTestingModule, MatIconModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ControlMenuComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
