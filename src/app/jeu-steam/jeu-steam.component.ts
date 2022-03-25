import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, switchMap } from 'rxjs';
import { id } from '../steam/steam.component';

export interface applist { //https://api.steampowered.com/ISteamApps/GetAppList/v2/
  applist: any;
  apps: any[];
    appid:number;
    name:string;
}

export interface appnews { //http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=440&count=3&maxlength=300&format=json
  appnews: any;
    appid:number;
    newsitems:any[];
      gid:id;
      title:string;
      url:string;
      is_external_url:boolean;
      author:string;
      contents:string;
      feedlabel:string;
      date:number;
      feedname:string;
      feed_type:number;
      tags:string[];
      //appid:number;
    count:number;
}

@Component({
  selector: 'jeu-steam-view',
  templateUrl: './jeu-steam.component.html'
})
export class JeuSteamComponent implements OnInit {
  name="";
  jeu="";
  id:number=-1;
  contenu:string[]=[];

  constructor(private http: HttpClient) { }
  
  getAppList() {
    return this.http.get<applist>('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
  }
  getAppNews(id:number) {
    return this.http.get<appnews>('http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid='+id+'&count=3&maxlength=300&format=json');
  }

  ngOnInit(): void {
  }

  setValue() {
    const apps$ = this.getAppList().pipe(shareReplay(1));
    const news$ = apps$.pipe(
      switchMap(apps => this.getAppNews(this.id)),
    shareReplay(1));

    apps$.subscribe(apps=> {
      this.id = -1;
      var i=0;
      while(i<apps.applist.apps.length || this.id == -1){
        if (apps.applist.apps[i].name == this.name){
          this.jeu = apps.applist.apps[i].name;
          this.id = apps.applist.apps[i].appid;
        }
        i++;
      }
      if(this.id==-1){
      }
      news$.subscribe(news=> {
        for (var i = 0; i < news.appnews.newsitems.length; i++){
          this.contenu[i] = news.appnews.newsitems[i].contents;
        }
      })
    })
    
    

    
    }
}
