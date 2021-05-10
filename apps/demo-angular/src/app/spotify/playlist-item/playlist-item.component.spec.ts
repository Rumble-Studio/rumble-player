import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PlaylistItemComponent } from './playlist-item.component';

describe('PlaylistItemComponent', () => {
	let component: PlaylistItemComponent;
	let fixture: ComponentFixture<PlaylistItemComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PlaylistItemComponent],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PlaylistItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
