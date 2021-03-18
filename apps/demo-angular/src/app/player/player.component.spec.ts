import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerComponent } from './player.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PlayerComponent', () => {
	let component: PlayerComponent;
	let fixture: ComponentFixture<PlayerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PlayerComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PlayerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create Angular component', () => {
		expect(component).toBeTruthy();
	});
	it('should create custom player component', () => {
		const nativeElement = fixture.nativeElement;
		expect(nativeElement.querySelector('rs-player')).toBeDefined();
	});
});
