import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PlayerComponent } from './player.component';

describe('PlayerComponent', () => {
	let component: PlayerComponent;
	let fixture: ComponentFixture<PlayerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PlayerComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PlayerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
