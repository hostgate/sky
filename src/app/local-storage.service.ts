import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  constructor() { }
  public removeStorage(name) {
    try {
      localStorage.removeItem(name);
      localStorage.removeItem(name + '_expiresIn');
    } catch(e) {
      return false;
    }
    return true;
  }
  public getStorage(key) {
    let now = Date.now(); 
    let expiresIn:any = localStorage.getItem(key+'_expiresIn');
    if (expiresIn===undefined || expiresIn===null) { expiresIn = 0; }
    if (expiresIn < now) {
        this.removeStorage(key);
        return null;
    } else {
        try {
            var value = localStorage.getItem(key);
            return value;
        } catch(e) {
            return null;
        }
    }
  }
  public setStorage(key, value, expires) {
    if (expires===undefined || expires===null) {
        expires = (24*60*60);
    } else {
        expires = Math.abs(expires);
    }
    var now = Date.now();
    var schedule:any = now + expires*1000; 
    try {
        localStorage.setItem(key, value);
        localStorage.setItem(key + '_expiresIn', schedule);
    } catch(e) {
        return false;
    }
    return true;
  }
}
