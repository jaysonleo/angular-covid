import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() deviceXs: Boolean;
  @Output() public sidenavToggle = new EventEmitter();
  constructor() {}
  ngOnInit() {}
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
