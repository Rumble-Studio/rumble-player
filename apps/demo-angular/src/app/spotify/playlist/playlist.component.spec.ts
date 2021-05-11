import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PlaylistComponent } from './playlist.component';
import { MatIconModule } from '@angular/material/icon';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { PlaylistItemComponent } from '../playlist-item/playlist-item.component';

describe('PlaylistComponent', () => {
	let component: PlaylistComponent;
	let fixture: ComponentFixture<PlaylistComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PlaylistComponent, PlaylistItemComponent],
			imports: [MatIconModule, MatIconTestingModule],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PlaylistComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
