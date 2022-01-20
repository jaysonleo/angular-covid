import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CardsComponent } from './cards/cards.component';
import { CausesComponent } from './causes/causes.component';
import { SymptomsComponent } from './symptoms/symptoms.component';

const routes: Routes = [
  { path: '', component: CardsComponent, pathMatch: 'full'},
  { path: 'causes', component: CausesComponent },
  { path: 'symptoms', component: SymptomsComponent },
  { path: 'about', component: AboutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
