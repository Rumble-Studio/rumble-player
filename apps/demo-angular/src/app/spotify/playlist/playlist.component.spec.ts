import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PlaylistComponent } from './playlist.component';

describe('PlaylistComponent', () => {
	let component: PlaylistComponent;
	let fixture: ComponentFixture<PlaylistComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [PlaylistComponent],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
