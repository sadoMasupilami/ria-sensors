import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // private url = 'http://mariadb.mklug.at:5000/api/';
  url = 'http://' + window.location.hostname + ':5000/api/';

  constructor() {
    // console.log(this.url);
  }

  getApiUrl() {
    return this.url;
  }
}
