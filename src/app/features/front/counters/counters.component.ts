import { Component } from '@angular/core';

@Component({
  selector: 'app-counters',
  templateUrl: './counters.component.html',
  styleUrl: './counters.component.css'
})
export class CountersComponent {
  // Funfacts
  funFacts =[
    {
      icon: "icon-hourglass default-color font-50px",
      number: 352,
      desc: "Happy Clients",
      displayedNumber: 0
    },
    {
      icon: "icon-lightbulb default-color font-50px",
      number: 884,
      desc: "Year Experience",
      displayedNumber: 0
    },
    {
      icon: "icon-wine default-color font-50px",
      number: 662,
      desc: "Project Completed",
      displayedNumber: 0
    },
    {
      icon: "icon-hotairballoon default-color font-50px",
      number: 444,
      desc: "Awwwards",
      displayedNumber: 0
    }
  ]

  // funFactsTwo
  funFactsTwo =[
    {
      icon: "icon-paintbrush white-color font-40px",
      number: 3521,
      desc: "Happy Clients",
      displayedNumber: 0
    },
    {
      icon: "icon-speedometer white-color font-40px",
      number: 974,
      desc: "Cups of Coffee",
      displayedNumber: 0
    },
    {
      icon: "icon-genius white-color font-40px",
      number: 634,
      desc: "Project Delivered",
      displayedNumber: 0
    },
    {
      icon: "icon-strategy white-color font-40px",
      number: 449,
      desc: "Awards Won",
      displayedNumber: 0
    }
  ]


  // funFactsThree
  funFactsThree =[
    {
      icon: "icon-hourglass gradient-color font-50px",
      number: 350,
      desc: "Happy Clients",
      displayedNumber: 0
    },
    {
      icon: "icon-lightbulb gradient-color font-50px",
      number: 12,
      desc: "Years of Experience",
      displayedNumber: 0
    },
    {
      icon: "icon-wine gradient-color font-50px",
      number: 622,
      desc: "Project Completed",
      displayedNumber: 0
    },
    {
      icon: "icon-hotairballoon gradient-color font-50px",
      number: 444,
      desc: "Awwwards",
      displayedNumber: 0
    }
  ]

  ngOnInit(): void {
    this.startCounters(this.funFacts);
    this.startCounters(this.funFactsTwo);
    this.startCounters(this.funFactsThree);
  }

  startCounters(factsArray: any[]): void {
    factsArray.forEach(fact => {
      this.animateCounter(fact);
    });
  }

  animateCounter(fact: any): void {
    const duration = 4000; // 4 seconds
    const intervalTime = 50; // interval time in milliseconds
    const increment = fact.number / (duration / intervalTime);
  
    const interval = setInterval(() => {
      fact.displayedNumber += increment;
      if (fact.displayedNumber >= fact.number) {
        fact.displayedNumber = fact.number; // ensure final value is exact
        clearInterval(interval); // stop the interval
      }
    }, intervalTime);
  }

}
