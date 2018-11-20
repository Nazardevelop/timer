import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ClockService } from '../clock.service';
import { takeWhile, bufferTime, filter, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'timer-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('waitBtn') waitBtn: ElementRef;
  seconds: number;
  minutes: number;
  hours: number;
  private alive;
  constructor(private clockService: ClockService) { }

  ngOnInit() {
    this.seconds = this.hours = this.minutes = 0;
  }

  ngAfterViewInit() {
    this.subscribeToWaitEvent();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  subscribeToWaitEvent() {
    const waitClickStream = fromEvent(document.getElementById('waitBtn'), 'click');
    waitClickStream.pipe(
      takeWhile(() => this.alive),
      bufferTime(300),
      map(arr => arr.length),
      filter((lngth) => lngth === 2)
    ).subscribe(() => {
      this.alive = false;
    });
  }

  resetTimer() {
    this.stopTimer();
    this.seconds = this.minutes = this.hours = 0;
  }
  changeTimerState() {
    if (this.alive) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  stopTimer() {
    this.alive = false;
  }
  startTimer() {
    this.alive = true;
    this.clockService.startTimer()
    .pipe(takeWhile(() => this.alive))
    .subscribe(res => {
      this.seconds += 1;
      this.checkSecondsAmount();
    });
  }

  checkSecondsAmount() {
    if (this.seconds === 60) {
      this.addMinutes();
      this.resetSeconds();
    }
  }

  resetSeconds() {
    this.seconds = 0;
  }

  addMinutes() {
    this.minutes += 1;
    this.checkMinutesAmount();
  }

  checkMinutesAmount() {
    if (this.minutes === 60) {
      this.hours += 1;
      this.resetMinutes();
    }
  }

  resetMinutes() {
    this.minutes = 0;
  }
  
}
