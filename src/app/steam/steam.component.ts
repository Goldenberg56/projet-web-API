import { Component } from '@angular/core';
import { shareReplay, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers : new HttpHeaders( {'Content-Type':'application/json'})
}

export interface id { //https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=E6D5FC96D3120B016CA30AB04137D487&vanityurl=zizou
  id: number;
  response : any;
}

export interface Profil { //https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=E6D5FC96D3120B016CA30AB04137D487&steamids=76561197961994930
  response : any;
  players:any[];
  steamid:number;
  communityvisibilitystate:number;
  profilestate:number;
  personaname:string;
  profileurl:string;
  avatar:any;
  avatarmedium:any;
  avatarfull:any;
  avatarhash:any;
  personastate:number;
  realname:string;
  primaryclanid:number;
  timecreated:number;
  personastateflags: number;
  loccountrycode:string;
  locstatecode:string;
  loccityid:number;
}

export interface Jeux { //http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=E6D5FC96D3120B016CA30AB04137D487&steamid=76561198007104782&format=json
  response : any;
  game_count:number;
  games:any[];
  appid:number;
  playtime_forever:number;
  playtime_windows_forever:number;
  playtime_mac_forever:number;
  playtime_linux_forever:number; 
}

export interface Amis { //http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=E6D5FC96D3120B016CA30AB04137D487&steamid=76561198007104782&relationship=friend
  friendslist:any;
  friends: any[];
  steamid:number;
  relationship:string;
  friend_since:number;
}

export interface Evaluation { //http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=E6D5FC96D3120B016CA30AB04137D487&steamid=76561198007104782&relationship=friend
  total_count:any;
}

@Component({
  selector: 'steam-view',
  templateUrl:'steam.component.html'
})

export class SteamComponent {
  title = 'my-app';
  name: string = '';
  clefAPI: string = 'E6D5FC96D3120B016CA30AB04137D487';
  visibilite: string = '';
  id: any;
  realname: string | undefined;
  personaname: string | undefined;
  date: any;
  pays:any;
  etat:any;
  nbjeux: any;
  nbAmis:any;
  eval:any;
  img: any;
  
  constructor(private http: HttpClient) { }


  getId(pseudo: string) {
    return this.http.get<id>('/ISteamUser/'+'ResolveVanityURL/v0001/?key='+this.clefAPI+'&vanityurl='+pseudo);
  }
  getProfil(id: string) {
    return this.http.get<Profil>('/ISteamUser/'+'GetPlayerSummaries/v0002/?key='+this.clefAPI+'&steamids='+id);
  }
  getJeux(id: string) {
    return this.http.get<Jeux>('/IPlayerService/'+'GetOwnedGames/v0001/?key='+this.clefAPI+'&steamid='+id+'&format=json');
  }
  getAmis(id: string) {
    return this.http.get<Amis>('/ISteamUser/'+'GetFriendList/v0001/?key='+this.clefAPI+'&steamid='+id+'&relationship=friend');
  }
  getEvaluation(id: string) {
    return this.http.get<Evaluation>('/comment' + '/Profile/render/'+id+'/-1/');
  }
  setValue() {
    const id$ = this.getId(this.name).pipe(shareReplay(1));
    const profil$ = id$.pipe(
      switchMap(id => this.getProfil(id.response.steamid)),
    shareReplay(1));
    const jeux$ = id$.pipe(
      switchMap(id => this.getJeux(id.response.steamid)),
    shareReplay(1));
    const amis$ = id$.pipe(
      switchMap(id => this.getAmis(id.response.steamid)),
    shareReplay(1));
    const evaluation$ = id$.pipe(
      switchMap(id => this.getEvaluation(id.response.steamid)),
    shareReplay(1));

    id$.subscribe(id=> {
      this.id = id.response.steamid;
      profil$.subscribe(profil=> {   
        var result = profil.response.players[0].communityvisibilitystate;
        this.visibilite = 'inconnue'
        if (result == 1 || result == 2) {
          this.visibilite = 'privée';
        } else if(result == 3){
          this.visibilite = 'publique';
        }
        this.personaname = profil.response.players[0].personaname;
        this.realname= profil.response.players[0].realname;
        this.date = new Date(profil.response.players[0].timecreated*1000);
        this.pays = new Intl.DisplayNames(['fr'], {type: 'region'}).of(profil.response.players[0].loccountrycode);
        result = profil.response.players[0].personastate
        this.etat = 'inconnu';
        if (result == 0) {
          this.etat = 'hors ligne';
        } else if(result == 1){
          this.etat = 'en ligne';
        } else if(result == 2){
          this.etat = 'occupé';
        } else if(result == 3){
          this.etat = 'absent';
        } else if(result == 4){
          this.etat = 'sommeil';
        } else if(result == 5){
          this.etat = 'cherche à échanger';
        } else if(result == 6){
          this.etat = 'cherche à jouer';
        } 
      })

      jeux$.subscribe(jeux=> {
        this.nbjeux = jeux.response.game_count;
      })

      amis$.subscribe(amis=> {
        this.nbAmis = amis.friendslist.friends.length;
      })

      evaluation$.subscribe(evaluation=> {
        this.eval = evaluation.total_count;
      })
      profil$.subscribe(profil=> { 
        this.img = profil.response.players[0].avatarfull;
      })
    })


    
    }
    
  
}
