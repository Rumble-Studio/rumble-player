import { TestBed } from '@angular/core/testing';

import { PlayerBridgeService } from './player-bridge.service';

describe('PlayerBridgeService', () => {
  let service: PlayerBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
