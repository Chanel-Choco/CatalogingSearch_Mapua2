// ================= ANGULAR CORE =================
import { Injectable } from '@angular/core';

// Used for sending HTTP requests
import { HttpClient, HttpParams } from '@angular/common/http';

// Observable for async handling of responses
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment'; //added this


/**
 * SearchLog Interface
 * -------------------
 * Defines the structure of a search log record.
 * Improves type safety and maintainability.
 */
export interface SearchLog {
  id: number;               // Unique identifier of search log
  isbn: string;             // Book ISBN
  title: string;            // Book title
  authors: string;          // Book authors
  coverImageUrl: string;    // Book cover image
  publicationYear: string;  // Year of publication
  searchedAt: string;       // Timestamp of search action
  isPinned?: boolean;       // Optional UI state flag
}

/**
 * SearchLogsService
 * -----------------
 * Handles all search log related API operations.
 *
 * Responsibilities:
 * - Retrieve search logs (with optional filters)
 * - Delete single log (Admin)
 * - Delete all logs (Admin)
 *
 * This service ensures audit tracking functionality
 * is separated from UI components.
 */
@Injectable({
  providedIn: 'root'
})
export class SearchLogsService {

  /**
   * Base endpoint for book-related operations
   */
  private baseUrl = `${environment.apiUrl}/api/books`;
  //private baseUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  // =====================================================
  // GET SEARCH LOGS
  // =====================================================

  /**
   * Retrieves search logs from backend.
   *
   * Optional filtering parameters:
   * - keyword
   * - searchBy (title | author | isbn)
   *
   * @returns Observable<SearchLog[]>
   */
  getBooks(
    keyword: string = '',
    searchBy: string = 'title'
  ): Observable<SearchLog[]> {

    let params = new HttpParams();

    // Add filtering parameters only if keyword is provided
    if (keyword && keyword.trim() !== '') {
      params = params
        .set('keyword', keyword)
        .set('searchBy', searchBy);
    }

    return this.http.get<SearchLog[]>(
      `${this.baseUrl}/search-logs`,
      { params }
    );
  }

  // =====================================================
  // DELETE SINGLE SEARCH LOG
  // =====================================================

  /**
   * Deletes a specific search log by ID.
   * Intended for Admin users only.
   */
  deleteLog(id: number, userEmail: string): Observable<any> {

    const params = new HttpParams()
      .set('userEmail', userEmail);

    return this.http.delete(
      `${this.baseUrl}/search-logs/${id}`,
      { params }
    );
  }
  // =====================================================
  // DELETE ALL SEARCH LOGS
  // =====================================================

  /**
   * Deletes all search logs.
   * Admin-only operation.
   */
  deleteAllLogs(userEmail: string): Observable<any> {

    const params = new HttpParams()
      .set('userEmail', userEmail);

    return this.http.delete(
      `${this.baseUrl}/search-logs`,
      { params }
    );
  }
}