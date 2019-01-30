import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private _http: HttpClient) { }

  /** fetchCrossword will return the crossword table and hints data.
   *  Parameters:
   *    date (string): String representation of the date for the puzzle. mm/dd/yyyy format.
  */
  fetchCrossword(date: string): Observable<Object> {
    return this._http.get("https://juanbustamante.org/crosswords/get-crossword.php?date=" + date, { responseType: "json" })
  }
}
