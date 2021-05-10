import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ControlMenuComponent } from './control-menu.component';

describe('ControlMenuComponent', () => {
	let component: ControlMenuComponent;
	let fixture: ComponentFixture<ControlMenuComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ControlMenuComponent],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
