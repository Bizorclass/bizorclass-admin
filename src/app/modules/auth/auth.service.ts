import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private _user: BehaviorSubject<any> = new BehaviorSubject<any>(JSON.parse(localStorage.getItem("user")));

    constructor() { }

    set user(value: any) {
        localStorage.setItem("user", JSON.stringify(value));
        this._user.next(value);
    }

    get user(): Observable<any> {
        return this._user.asObservable();
    }


    check(): Observable<boolean> {
        // Check if the user is logged in

        if ( this._user.value ) {
            return of(true);
        }

        // Check the access token availability
        if ( !this._user.value ) {
            return of(false);
        }
    }


    signOut(): Observable<any> {
        localStorage.removeItem('user');
        this._user.next(null);
        return of(true);
    }

}
