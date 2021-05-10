import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SpotifyComponent } from './spotify.component';

describe('SpotifyComponent', () => {
	let component: SpotifyComponent;
	let fixture: ComponentFixture<SpotifyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SpotifyComponent],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SpotifyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
