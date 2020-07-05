import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryComponent } from './pages/entry/entry.component';
import { ConferrenceComponent } from './pages/conferrence/conferrence.component';

const routes: Routes = [
  {
    path: 'home',
    component: EntryComponent,
  },
  {
    path: 'conferrence/:id',
    component: ConferrenceComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
