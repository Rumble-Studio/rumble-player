import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyComponent } from './spotify.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { SpotifyModule } from './spotify.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogHarness } from '@angular/material/dialog/testing';

describe('SpotifyComponent', () => {
	let component: SpotifyComponent;
	let fixture: ComponentFixture<SpotifyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SpotifyComponent],
			imports: [
				MatIconModule,
				MatSliderModule,
				MatIconTestingModule,
				MatDialogModule,
			],
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
