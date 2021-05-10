import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ControlComponent } from './control.component';

describe('ControlComponent', () => {
	let component: ControlComponent;
	let fixture: ComponentFixture<ControlComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ControlComponent],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
