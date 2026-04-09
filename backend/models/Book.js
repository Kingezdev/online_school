const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

class Book {
  // Create a new book
  static async create(bookData) {
    return new Promise((resolve, reject) => {
      const {
        title,
        author,
        isbn,
        publisher,
        publicationYear,
        genre,
        description,
        totalCopies,
        availableCopies,
        location,
        addedBy
      } = bookData;

      const query = `
        INSERT INTO books (
          title, author, isbn, publisher, publication_year, genre, 
          description, total_copies, available_copies, location, added_by, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `;

      db.run(query, [
        title, author, isbn, publisher, publicationYear, genre,
        description, totalCopies, availableCopies, location, addedBy
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...bookData });
        }
      });
    });
  }

  // Get all books
  static async getAll() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, u.username as added_by_name
        FROM books b
        LEFT JOIN users u ON b.added_by = u.id
        ORDER BY b.title ASC
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const books = rows.map(row => ({
            id: row.id,
            title: row.title,
            author: row.author,
            isbn: row.isbn,
            publisher: row.publisher,
            publicationYear: row.publication_year,
            genre: row.genre,
            description: row.description,
            totalCopies: row.total_copies,
            availableCopies: row.available_copies,
            location: row.location,
            addedBy: row.added_by,
            addedByName: row.added_by_name,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }));
          resolve(books);
        }
      });
    });
  }

  // Get book by ID
  static async findById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, u.username as added_by_name
        FROM books b
        LEFT JOIN users u ON b.added_by = u.id
        WHERE b.id = ?
      `;

      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const book = {
            id: row.id,
            title: row.title,
            author: row.author,
            isbn: row.isbn,
            publisher: row.publisher,
            publicationYear: row.publication_year,
            genre: row.genre,
            description: row.description,
            totalCopies: row.total_copies,
            availableCopies: row.available_copies,
            location: row.location,
            addedBy: row.added_by,
            addedByName: row.added_by_name,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          };
          resolve(book);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Search books by title, author, or ISBN
  static async search(searchTerm) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, u.username as added_by_name
        FROM books b
        LEFT JOIN users u ON b.added_by = u.id
        WHERE b.title LIKE ? OR b.author LIKE ? OR b.isbn LIKE ? OR b.genre LIKE ?
        ORDER BY b.title ASC
      `;

      const searchPattern = `%${searchTerm}%`;

      db.all(query, [searchPattern, searchPattern, searchPattern, searchPattern], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const books = rows.map(row => ({
            id: row.id,
            title: row.title,
            author: row.author,
            isbn: row.isbn,
            publisher: row.publisher,
            publicationYear: row.publication_year,
            genre: row.genre,
            description: row.description,
            totalCopies: row.total_copies,
            availableCopies: row.available_copies,
            location: row.location,
            addedBy: row.added_by,
            addedByName: row.added_by_name,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }));
          resolve(books);
        }
      });
    });
  }

  // Update book
  static async update(id, updateData) {
    return new Promise((resolve, reject) => {
      const {
        title,
        author,
        isbn,
        publisher,
        publicationYear,
        genre,
        description,
        totalCopies,
        availableCopies,
        location
      } = updateData;

      const query = `
        UPDATE books SET
          title = ?, author = ?, isbn = ?, publisher = ?, publication_year = ?,
          genre = ?, description = ?, total_copies = ?, available_copies = ?,
          location = ?, updated_at = datetime('now')
        WHERE id = ?
      `;

      db.run(query, [
        title, author, isbn, publisher, publicationYear, genre,
        description, totalCopies, availableCopies, location, id
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, ...updateData });
        }
      });
    });
  }

  // Delete book
  static async delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM books WHERE id = ?';

      db.run(query, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ deleted: this.changes > 0 });
        }
      });
    });
  }

  // Get books by genre
  static async getByGenre(genre) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, u.username as added_by_name
        FROM books b
        LEFT JOIN users u ON b.added_by = u.id
        WHERE b.genre = ?
        ORDER BY b.title ASC
      `;

      db.all(query, [genre], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const books = rows.map(row => ({
            id: row.id,
            title: row.title,
            author: row.author,
            isbn: row.isbn,
            publisher: row.publisher,
            publicationYear: row.publication_year,
            genre: row.genre,
            description: row.description,
            totalCopies: row.total_copies,
            availableCopies: row.available_copies,
            location: row.location,
            addedBy: row.added_by,
            addedByName: row.added_by_name,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }));
          resolve(books);
        }
      });
    });
  }

  // Get available books (books with available copies > 0)
  static async getAvailable() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT b.*, u.username as added_by_name
        FROM books b
        LEFT JOIN users u ON b.added_by = u.id
        WHERE b.available_copies > 0
        ORDER BY b.title ASC
      `;

      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const books = rows.map(row => ({
            id: row.id,
            title: row.title,
            author: row.author,
            isbn: row.isbn,
            publisher: row.publisher,
            publicationYear: row.publication_year,
            genre: row.genre,
            description: row.description,
            totalCopies: row.total_copies,
            availableCopies: row.available_copies,
            location: row.location,
            addedBy: row.added_by,
            addedByName: row.added_by_name,
            createdAt: row.created_at,
            updatedAt: row.updated_at
          }));
          resolve(books);
        }
      });
    });
  }
}

module.exports = Book;
