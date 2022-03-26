import { Component } from '@angular/core';
import { shareReplay, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Highcharts from 'highcharts';



export interface Summoner { //https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/WaZaKil?api_key=RGAPI-4e7ebf95-7a9d-499c-a1e5-67ffc26d8c46
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel : number;
}

export interface Masteries { //https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/hCIVxYzL600fc_Rdn2QXqQIUIPC9EVoiQPd6oxPNDEwB-Rk?api_key=RGAPI-81ce5445-d2b4-4b07-99a7-21d3dceaa530
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  chestGranted : boolean;
  tokensEarned: number;
  summonerId: string;
}

export interface Champions { //https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/fr_fr/v1/champion-summary.json
  id: number;
  name: string;
  alias: string;
  squarePortraitPath: string;
  roles: string[];
}


export interface LastMatchs { //'https://europe.api.riotgames.com/lol/match/v5/matches/EUW1_5789237724?api_key=RGAPI-01f07e5e-b62a-40b1-89a0-0db716624a33
}

export interface Match{ //'https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/rcaqchcQBfBhoDPjOxMpVdu3WcEMo9Kt8cbchwJH8asdiwqxcWiQGOsh16BJQbDz8KypXW9-uuxEfw/ids?start=0&count=20&api_key=RGAPI-d01eeac7-7534-4f26-b617-c14e653d0c3d
  info : any;
  participants: any[];
  win : boolean;
  totalDamageDealtToChampions : number;
}

@Component({
  selector: 'lol-view',
  template :
  `API KEY :  
    <input [(ngModel)]="key">
    PSEUDO : 
    <input [(ngModel)]="name">
    <button (click)="rechercher()">Rechercher</button>
    <h1> Résultat : </h1> 
    <p> {{ invocateur }} </p>
    <table>
      <tr *ngFor="let champion of champions;">
        <td> {{ champion }} </td>
      </tr>
    </table>
    <div id="container"></div>
  `})

export class LolComponent {
  name: string = '';
  key: string = '';
  invocateur: string = "";
  champions: string[] = [];
  public series: any[] = [];
  public options: any = {}
  
  constructor(private http: HttpClient) { }

  //Fonctions 
  getSummoner(Name: string) {
    return this.http.get<Summoner>
    ('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
    + Name + '?api_key=' + this.key);
  }
  getMasteries(SummonerId: string) {
    return this.http.get<Masteries[]>('https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/'+ SummonerId +'?api_key='+this.key);
  }
  getChampions() {
    return this.http.get<Champions[]>('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/fr_fr/v1/champion-summary.json');
  }
  getLastMatchs(SummonerPuuid: string) {
    return this.http.get<LastMatchs[]>('https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/' + SummonerPuuid + '/ids?start=0&this.count=20&api_key=' + this.key);
  }
  getMatch(Match: string) {
    return this.http.get<Match>('https://europe.api.riotgames.com/lol/match/v5/matches/' + Match + '?api_key=' + this.key);
  }

  // Fonction rechercher : 

  rechercher() {
    
    // Initialisation / Réinitialisation :

    this.invocateur = "Chargement...";
    for(let i=0; i<this.champions.length; i++){
      this.champions[i]="";
    }
    for(let i=0; i<this.series.length; i++){
      this.series[i]="";
    }
    this.options = {}
    Highcharts.chart('container', this.options);

    // Récuperer valeurs et les transformer :

    const summoner$ = this.getSummoner(this.name).pipe(shareReplay(1));
    const masteries$ = summoner$.pipe(
      switchMap(summoner => this.getMasteries(summoner.id)),
    shareReplay(1));
    const champions$ = this.getChampions().pipe(shareReplay(1));
    const lastMatchs$ = summoner$.pipe(
      switchMap(summoner => this.getLastMatchs(summoner.puuid)),
    shareReplay(1));
    const match0$ = lastMatchs$.pipe(
      switchMap(matches => this.getMatch(matches[0].toString())),
    shareReplay(1));
    
    // Gérer les valeurs à afficher :

    summoner$.subscribe(summoner=> {
      this.invocateur = "INVOCATEUR -> ";     
      this.invocateur += " Nom : "+ summoner.name;
      this.invocateur += " Niveau : "+ summoner.summonerLevel;
    })
    if(this.invocateur == "Chargement..."){
      this.invocateur = "Erreur chargement (clé ou pseudo invalide)";
    }
      

    masteries$.subscribe(masteries=> {
      if(masteries.length>0){
        this.champions[0] = "MEILLEURS CHAMPIONS -> ";
        for(let i=1; i<4; i++){
          this.champions[i] = " CHAMPION n°"+(i)+"-> ";
          champions$.subscribe(champions=> {
            let j=-1;
            do
            {
              j++;
              if(champions[j].id == masteries[i-1].championId){
                this.champions[i] += " Nom : "+ champions[j].name;
              }
                
              
            }while(j<champions.length && champions[j].id != masteries[i-1].championId)
              
          }) 
          this.champions[i] += " Niveau : "+ masteries[i-1].championLevel;
          this.champions[i] += " Points : "+ masteries[i-1].championPoints;
        }
      }
      else{
        this.champions[0] = "Erreur chargement champions : compte trop bas niveau";
      }
    })


        match0$.subscribe(match=> {
          summoner$.subscribe(summoner=> {
            const sid = summoner.id;
            for(let i=0; i<match.info.participants.length; i++){
              this.series[i] ={name: match.info.participants[i].summonerName ,data: [match.info.participants[i].visionScore] };
              if(match.info.participants[i].summonerId == sid){
                this.series[i] ={name: match.info.participants[i].summonerName+ " (<- VOUS) " ,data: [match.info.participants[i].visionScore] }; 
              }
            }
            if(this.series[0] != ""){
              this.options={ chart: {
                type: 'column'
            },
            title: {
                text: 'Score de vision par personne (dernière partie)'
            },
            xAxis: {
                categories: [
                    'Joueurs',
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Score de vision (points)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} points</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: this.series
            }
            Highcharts.chart('container', this.options);
          
            }
          })  
        })
        
    
    
    }
   
}
