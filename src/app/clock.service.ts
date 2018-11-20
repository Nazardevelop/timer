import { Injectable } from '@angular/core';
import {timer} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ClockService {
  constructor() { }
  startTimer() {
    return timer(0, 1000)
    .pipe(map(() => 1));
  }
}
