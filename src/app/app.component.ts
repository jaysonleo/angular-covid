import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'covid';
  mediaSub: Subscription;
  deviceXs: boolean;

  paddingVal;
  constructor(public mediaObserver: MediaObserver) {}

  ngOnInit() {
    this.mediaSub = this.mediaObserver.media$.subscribe(
      (result: MediaChange) => {
        this.deviceXs = ((result.mqAlias === 'xs') ? true : false);
        // if(result.mqAlias === 'xs'){
        //   this.paddingVal = 'calc(var(--vh, .20vh) * 100);';
        // } else {
        //   this.paddingVal = '7vh';
        // }
      }
    );
  }

  ngOnDestroy() {
    this.mediaSub.unsubscribe();
  }
}
