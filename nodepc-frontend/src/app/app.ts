import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query } from '@angular/animations';
import { IconRegistry } from './services/icon-registry';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':leave', [
          animate('0.3s ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('1.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class App {
  protected readonly title = signal('nodepc-frontend');

  constructor(private iconRegistry: IconRegistry) {}
}
