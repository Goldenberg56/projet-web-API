import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { shareReplay, switchMap } from 'rxjs';

export interface id { //https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=E6D5FC96D3120B016CA30AB04137D487&vanityurl=zizou
  id: number;
  response : any;
}
export interface applist { //https://api.steampowered.com/ISteamApps/GetAppList/v2/
  applist: any;
  apps: any[];
    appid:number;
    name:string;
}
export interface stats { //http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=440&key=E6D5FC96D3120B016CA30AB04137D487&steamid=76561198007104782
  playerstats: any;
  steamID: number;
  gameName: string;
  achievements: any[];
    apiname:string;
    achieved:number;
    unlocktime:number;
}

//http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid="+getIdFromName(document.getElementById('input_username').value)+"&key="+clefAPI+"&steamid="+getId(document.getElementById('input_name').value)
@Component({
  selector: 'succes-steam-view',
  templateUrl: './succes-steam.component.html'
  
})
export class SuccesSteamComponent  {
  clefAPI="E6D5FC96D3120B016CA30AB04137D487";
  pseudo="";
  jeu="";

  myDate:string[]=[];
  html:string[]=[];
  pourcent="";

  constructor(private http: HttpClient) { }

  getId(pseudo: string) {
    return this.http.get<id>('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key='+this.clefAPI+'&vanityurl='+pseudo);
  }
  getStats(appid:number, steamid:number) {
    return this.http.get<stats>('http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid='+appid+'&key='+this.clefAPI+'&steamid='+steamid);
  }
  getAppList() {
    return this.http.get<applist>('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
  }

  setValue(){
    const id$ = this.getId(this.pseudo).pipe(shareReplay(1));
    //const stats$ = this.getStats(this.appid, this.steamid).pipe(shareReplay(1));
    const apps$ = this.getAppList().pipe(shareReplay(1));
    
    id$.subscribe(id=> {
      apps$.subscribe(apps=> {
        var appid = -1;
        var i=0;
        while(i<apps.applist.apps.length || appid == -1){
          if (apps.applist.apps[i].name == this.jeu){

            appid = apps.applist.apps[i].appid;
          }
          i++;
        }
        const stats$ = id$.pipe(
          switchMap(id => this.getStats(appid, id.response.steamid)),
        shareReplay(1));


          stats$.subscribe(stats=> {
          var obt = 0;
            var tot = 0;

            var html="<tr><td>Succès obtenus :</td></tr>";

            for (var i = 0; i < stats.playerstats.achievements.length; i++){

              if(stats.playerstats.achievements[i].achieved == 1){

                this.myDate[i] = new Date(stats.playerstats.achievements[i].unlocktime*1000).toLocaleString();
                this.html[i] =stats.playerstats.achievements[i].apiname;
                obt++;
              }
              tot++;

            }

            this.pourcent = ((obt/tot)*100).toFixed(1);
        })
      })
    })
  }

}
