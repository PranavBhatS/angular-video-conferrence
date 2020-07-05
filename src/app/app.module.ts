import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { NgxAgoraModule } from 'ngx-agora';
import { MaterialsModule } from './modules/material/materials.module';
import { EntryComponent } from './pages/entry/entry.component';
import { ConferrenceComponent } from './pages/conferrence/conferrence.component';
import { MeetingJoinComponent } from './pages/meeting-join/meeting-join.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EntryComponent,
    ConferrenceComponent,
    MeetingJoinComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialsModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxAgoraModule.forRoot({ AppID: environment.agora.appId }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [MeetingJoinComponent],
  entryComponents:[MeetingJoinComponent]
})
export class AppModule { }
