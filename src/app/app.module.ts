import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LolComponent } from './lol/lol.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SteamComponent } from './steam/steam.component';
import { JeuSteamComponent } from './jeu-steam/jeu-steam.component';
import { SuccesSteamComponent } from './succes-steam/succes-steam.component';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';

@NgModule({
  declarations: [
    AppComponent,
    LolComponent,
    SteamComponent,
    JeuSteamComponent,
    SuccesSteamComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,                               
    ReactiveFormsModule,
    NgxTwitterTimelineModule                        
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
