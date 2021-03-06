import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private http: HttpClient) { }

  /** fetchCrossword will return the crossword table and hints data.
   *  Parameters:
   *    date (string): String representation of the date for the puzzle. mm/dd/yyyy format.
  */
  fetchCrossword(date: string): Observable<Object> {
    return this.http.get("https://us-central1-crosswords-92.cloudfunctions.net/fetchPuzzle?date=" + date, { responseType: "json" })
  }
}
