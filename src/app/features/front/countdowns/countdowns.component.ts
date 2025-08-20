import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-countdowns',
  templateUrl: './countdowns.component.html',
  styleUrl: './countdowns.component.css'
})
export class CountdownsComponent implements OnInit, OnDestroy {
  countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  private targetDate!: Date;
  private countdownInterval: any;

  ngOnInit(): void {
    // Set your target date here
    this.targetDate = new Date('2024-12-31T00:00:00');
    this.startCountdown();
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = this.targetDate.getTime() - now;

      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        this.countdown = {
          days,
          hours,
          minutes,
          seconds
        };
      } else {
        clearInterval(this.countdownInterval); 
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval); 
  }
}
