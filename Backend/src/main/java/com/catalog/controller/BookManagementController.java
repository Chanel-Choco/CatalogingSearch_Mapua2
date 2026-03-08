package com.catalog.controller;

import com.catalog.dto.BookResponseDTO;
import com.catalog.dto.SearchLogDTO;
import com.catalog.service.BookManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Book Management Controller
 *
 * This controller handles all book-related operations including:
 * - Manual book creation
 * - Book updates
 * - Pin and unpin functionality
 * - Retrieval of pinned books
 * - Viewing and managing search logs
 * - Fetching book details
 *
 * Base URL: /api/books
 *
 * Cross-Origin is configured to allow requests from the Angular
 * frontend running on http://localhost:4200.
 */
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:4200",
        "https://cataloging-search-mapua2.vercel.app")
public class BookManagementController {

    private final BookManagementService service;

    /**
     * Constructor-based dependency injection of BookManagementService.
     *
     * @param service service layer responsible for business logic
     */
    public BookManagementController(BookManagementService service) {
        this.service = service;
    }

    /**
     * Creates a book manually and enriches it using external APIs.
     * Restricted to users with ADMIN role (validated in service layer).
     *
     * Endpoint: POST /api/books/manual
     *
     * @param dto BookResponseDTO containing book details
     * @param userEmail email of the logged-in user
     * @return created and enriched book data
     */
    @PostMapping("/manual")
    public ResponseEntity<BookResponseDTO> createManualBook(
            @RequestBody BookResponseDTO dto,
            @RequestParam String userEmail) {

        return ResponseEntity.ok(
                service.createManualBook(dto, userEmail)
        );
    }

    /**
     * Pins a book to the user's pinned list.
     *
     * Endpoint: POST /api/books/pin/{isbn}
     *
     * @param isbn unique identifier of the book
     * @param userEmail email of the logged-in user
     * @return pinned book data
     */
    @PostMapping("/pin/{isbn}")
    public ResponseEntity<BookResponseDTO> pinBook(
            @PathVariable String isbn,
            @RequestParam String userEmail) {

        return ResponseEntity.ok(
                service.pinBook(isbn, userEmail)
        );
    }

    /**
     * Updates an existing book's metadata.
     * Restricted to users with ADMIN role (validated in service layer).
     *
     * Endpoint: PUT /api/books/{isbn}
     *
     * @param isbn unique identifier of the book
     * @param dto updated book data
     * @param userEmail email of the logged-in user
     * @return updated book data
     */
    @PutMapping("/{isbn}")
    public ResponseEntity<BookResponseDTO> updateBook(
            @PathVariable String isbn,
            @RequestBody BookResponseDTO dto,
            @RequestParam String userEmail) {

        return ResponseEntity.ok(
                service.updateBook(isbn, dto, userEmail)
        );
    }

    /**
     * Removes a pinned book from the user's pinned list.
     *
     * Endpoint: DELETE /api/books/unpin/{isbn}
     *
     * @param isbn unique identifier of the book
     * @param userEmail email of the logged-in user
     * @return success message
     */
    @DeleteMapping("/unpin/{isbn}")
    public ResponseEntity<String> unpinBook(
            @PathVariable String isbn,
            @RequestParam String userEmail) {

        service.unpinBook(isbn, userEmail);
        return ResponseEntity.ok("Book unpinned successfully");
    }

    /**
     * Retrieves all pinned books for a specific user.
     *
     * Endpoint: GET /api/books/pinned
     *
     * @param userEmail email of the logged-in user
     * @return list of pinned books
     */
    @GetMapping("/pinned")
    public ResponseEntity<List<BookResponseDTO>> getPinnedBooks(
            @RequestParam String userEmail) {

        return ResponseEntity.ok(
                service.getAllPinnedBooks(userEmail)
        );
    }

    /**
     * Retrieves search logs with optional filtering.
     *
     * Endpoint: GET /api/books/search-logs
     *
     * @param keyword optional search keyword
     * @param searchBy optional filter type (title, author, isbn)
     * @return list of search logs
     */
    @GetMapping("/search-logs")
    public ResponseEntity<List<SearchLogDTO>> getSearchLogs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "title") String searchBy
    ) {

        return ResponseEntity.ok(
                service.getAllBooks(keyword, searchBy)
        );
    }

    /**
     * Deletes a specific search log.
     * Restricted to users with ADMIN role (validated in service layer).
     *
     * Endpoint: DELETE /api/books/search-logs/{id}
     *
     * @param id search log identifier
     * @param userEmail email of the logged-in user
     * @return success message
     */
    @DeleteMapping("/search-logs/{id}")
    public ResponseEntity<String> deleteSearchLog(
            @PathVariable Long id,
            @RequestParam String userEmail) {

        service.deleteSearchLog(id, userEmail);
        return ResponseEntity.ok("Search log deleted successfully");
    }

    /**
     * Deletes all search logs except pinned entries.
     * Restricted to users with ADMIN role (validated in service layer).
     *
     * Endpoint: DELETE /api/books/search-logs
     *
     * @param userEmail email of the logged-in user
     * @return success message
     */
    @DeleteMapping("/search-logs")
    public ResponseEntity<String> deleteAllSearchLogs(
            @RequestParam String userEmail) {

        service.deleteAllSearchLogs(userEmail);
        return ResponseEntity.ok("All search logs deleted successfully");
    }

    /**
     * Retrieves detailed book information by ISBN.
     *
     * Endpoint: GET /api/books/{isbn}
     *
     * @param isbn unique identifier of the book
     * @return book details
     */
    @GetMapping("/{isbn}")
    public ResponseEntity<BookResponseDTO> getBookByIsbn(
            @PathVariable String isbn) {

        return ResponseEntity.ok(
                service.getBookByIsbn(isbn)
        );
    }
}