import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, MatSidenavContainer, MatSidenavContent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
