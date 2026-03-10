package com.catalog.repository;

// Import the SearchLog entity
import com.catalog.entity.SearchLog;

// Spring Data JPA core repository
import org.springframework.data.jpa.repository.JpaRepository;

// Used for update/delete custom queries
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

// Required for database transaction handling
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * SearchLogRepository
 *
 * Handles all database operations related to search logs.
 * This stores the history of searched books in the system.
 *
 * By extending JpaRepository, it automatically provides:
 * - save()
 * - findById()
 * - findAll()
 * - deleteById()
 * - and other CRUD operations
 */
public interface SearchLogRepository extends JpaRepository<SearchLog, Long> {

    /**
     * Retrieves all search logs ordered by most recent search first.
     *
     * Used for displaying search history in descending order.
     */
    List<SearchLog> findAllByOrderBySearchedAtDesc();

    /**
     * Searches logs by book title (case-insensitive),
     * ordered by most recent.
     *
     * Used when filtering search history by title.
     */
    List<SearchLog> findByBook_TitleContainingIgnoreCaseOrderBySearchedAtDesc(String keyword);

    /**
     * Searches logs by book authors (case-insensitive),
     * ordered by most recent.
     *
     * Useful when filtering logs by author name.
     */
    List<SearchLog> findByBook_AuthorsContainingIgnoreCaseOrderBySearchedAtDesc(String keyword);

    /**
     * Searches logs by ISBN (partial match),
     * ordered by most recent.
     *
     * Used when filtering logs using ISBN.
     */
    List<SearchLog> findByBook_IsbnContainingOrderBySearchedAtDesc(String keyword);

    /**
     * Deletes all search logs.
     *
     * 🔥 Important:
     * - @Transactional is required because this modifies data.
     * - @Modifying tells Spring this is a DELETE operation.
     */
    @Transactional
    @Modifying
    @Query("DELETE FROM SearchLog s")
    void deleteAllExceptPinned();
}