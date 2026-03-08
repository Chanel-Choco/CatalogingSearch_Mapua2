// ================= ANGULAR CORE =================
import { Injectable } from '@angular/core';

// Used to send HTTP requests to backend
import { HttpClient } from '@angular/common/http';

// Observable for asynchronous API handling
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment'; // added this
/**
 * BookService
 * -----------
 * Centralized service for all book-related operations.
 *
 * Responsibilities:
 * - Perform bibliographic searches
 * - Handle manual cataloging
 * - Manage pinned books
 * - Update book records (Admin)
 * - Retrieve search logs
 * - Delete search logs (Admin)
 *
 * This service acts as the communication layer
 * between Angular frontend and Spring Boot backend.
 */
@Injectable({
  providedIn: 'root'
})
export class BookService {

  /**
   * Base URL for search-related endpoints
   */
  private searchUrl = `${environment.apiUrl}/api/search`;
  //private searchUrl = 'http://localhost:8080/api/search';

  /**
   * Base URL for book-related endpoints
   */
  private booksUrl = `${environment.apiUrl}/api/books`;
  //private booksUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  // =====================================================
  // GET LOGGED-IN USER EMAIL
  // =====================================================

  /**
   * Retrieves logged-in user email from localStorage.
   * Required for backend audit tracking.
   */
  private getUserEmail(): string {
    const email = localStorage.getItem('userEmail');

    if (!email) {
      throw new Error('No logged-in user found.');
    }

    return email;
  }

  // =====================================================
  // SEARCH BOOKS
  // =====================================================

  /**
   * Performs bibliographic search.
   * Search types:
   * - ISBN
   * - Title
   * - Author
   *
   * User email is passed for audit logging.
   */
  searchBooks(type: string, query: string): Observable<any> {

    const userEmail = this.getUserEmail();

    if (type === 'ISBN') {
      return this.http.get(
        `${this.searchUrl}/isbn/${query}?userEmail=${userEmail}`
      );
    }

    if (type === 'Title') {
      return this.http.get(
        `${this.searchUrl}/title?value=${query}&userEmail=${userEmail}`
      );
    }

    if (type === 'Author') {
      return this.http.get(
        `${this.searchUrl}/author?value=${query}&userEmail=${userEmail}`
      );
    }

    throw new Error('Invalid search type');
  }

  // =====================================================
  // MANUAL CATALOGING (ADMIN)
  // =====================================================

  /**
   * Saves manually entered book record.
   * Admin-only operation.
   */
  saveManualBook(book: any): Observable<any> {
    const userEmail = this.getUserEmail();

    return this.http.post(
      `${this.booksUrl}/manual?userEmail=${userEmail}`,
      book
    );
  }

  // =====================================================
  // PIN BOOK
  // =====================================================

  /**
   * Pins a book to user's collection.
   */
  pinBook(isbn: string): Observable<any> {
    const userEmail = this.getUserEmail();

    return this.http.post(
      `${this.booksUrl}/pin/${isbn}?userEmail=${userEmail}`,
      null
    );
  }

  // =====================================================
  // UNPIN BOOK
  // =====================================================

  /**
   * Removes book from pinned list.
   */
  unpinBook(isbn: string): Observable<any> {
    const userEmail = this.getUserEmail();

    return this.http.delete(
      `${this.booksUrl}/unpin/${isbn}?userEmail=${userEmail}`
    );
  }

  // =====================================================
  // GET PINNED BOOKS
  // =====================================================

  /**
   * Retrieves all pinned books for logged-in user.
   */
  getPinnedBooks(): Observable<any> {
    const userEmail = this.getUserEmail();

    return this.http.get(
      `${this.booksUrl}/pinned?userEmail=${userEmail}`
    );
  }

  // =====================================================
  // UPDATE BOOK (ADMIN)
  // =====================================================

  /**
   * Updates book metadata.
   * Admin-only operation.
   */
  updateBook(isbn: string, book: any): Observable<any> {
    const userEmail = this.getUserEmail();

    return this.http.put(
      `${this.booksUrl}/${isbn}?userEmail=${userEmail}`,
      book
    );
  }

  // =====================================================
  // GET BOOK DETAILS
  // =====================================================

  /**
   * Retrieves full book details by ISBN.
   */
  getBookByIsbn(isbn: string): Observable<any> {
    return this.http.get(
      `${this.booksUrl}/${isbn}`
    );
  }

  // =====================================================
  // GET SEARCH LOGS
  // =====================================================

  /**
   * Retrieves search logs.
   * Optional filtering by keyword and category.
   */
  getSearchLogs(keyword?: string, searchBy?: string): Observable<any> {

    let url = `${this.booksUrl}/search-logs`;
    const params = [];

    if (keyword) {
      params.push(`keyword=${keyword}`);
    }

    if (searchBy) {
      params.push(`searchBy=${searchBy}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.get(url);
  }

  // =====================================================
  // DELETE SINGLE SEARCH LOG (ADMIN)
  // =====================================================

  /**
   * Deletes a specific search log.
   */
  deleteSearchLog(id: number): Observable<any> {
    const userEmail = this.getUserEmail();

    return this.http.delete(
      `${this.booksUrl}/search-logs/${id}?userEmail=${userEmail}`
    );
  }

  // =====================================================
  // DELETE ALL SEARCH LOGS (ADMIN)
  // =====================================================

  /**
   * Deletes all search logs.
   * Admin-only operation.
   */
  deleteAllSearchLogs(): Observable<any> {
    const userEmail = this.getUserEmail();

    return this.http.delete(
      `${this.booksUrl}/search-logs?userEmail=${userEmail}`
    );
  }
}