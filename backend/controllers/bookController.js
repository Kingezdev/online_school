const { getQuery, getSingle, runQuery } = require('../config/database');
const fs = require('fs');
const path = require('path');

// @desc    Get all books
// @route   GET /api/books
// @access  Private
const getAllBooks = async (req, res) => {
  try {
    const books = await getQuery('SELECT * FROM books WHERE isActive = 1 ORDER BY title');
    res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res) => {
  try {
    const bookQuery = 'SELECT * FROM books WHERE id = ? AND isActive = 1';
    const book = await getSingle(bookQuery, [req.params.id]);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({
      success: true,
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search books
// @route   GET /api/books/search/:term
// @access  Private
const searchBooks = async (req, res) => {
  try {
    const { term } = req.params;
    const books = await getQuery('SELECT * FROM books WHERE isActive = 1 AND (title LIKE ? OR author LIKE ? OR genre LIKE ?) ORDER BY title', [`%${term}%`, `%${term}%`, `%${term}%`]);
    
    res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get books by genre
// @route   GET /api/books/genre/:genre
// @access  Private
const getBooksByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const books = await getQuery('SELECT * FROM books WHERE isActive = 1 AND genre = ? ORDER BY title', [genre]);
    
    res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available books
// @route   GET /api/books/available
// @access  Private
const getAvailableBooks = async (req, res) => {
  try {
    const books = await getQuery('SELECT * FROM books WHERE isActive = 1 AND availableCopies > 0 ORDER BY title');
    
    res.json({
      success: true,
      count: books.length,
      books
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Admin/Librarian only)
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      publisher,
      publicationYear,
      genre,
      description,
      totalCopies,
      location
    } = req.body;

    // Validate required fields
    if (!title || !author || !isbn) {
      return res.status(400).json({ 
        message: 'Title, author, and ISBN are required' 
      });
    }

    // Check if book with same ISBN already exists
    const existingBook = await getQuery('SELECT * FROM books WHERE isbn = ? AND isActive = 1', [isbn]);
    if (existingBook.length > 0) {
      return res.status(400).json({ 
        message: 'Book with this ISBN already exists' 
      });
    }

    const bookData = {
      title,
      author,
      isbn,
      publisher: publisher || 'Unknown',
      publicationYear: publicationYear || new Date().getFullYear(),
      genre: genre || 'General',
      description: description || '',
      totalCopies: totalCopies || 1,
      availableCopies: totalCopies || 1,
      location: location || 'Main Library',
      addedBy: req.user.id
    };

    const insertQuery = `
      INSERT INTO books (title, author, isbn, publisher, publicationYear, genre, description, totalCopies, availableCopies, location, addedBy, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))
    `;
    const result = await runQuery(insertQuery, [title, author, isbn, publisher, publicationYear, genre, description, totalCopies, availableCopies, location, req.user.id]);
    const book = await getSingle('SELECT * FROM books WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      book
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Admin/Librarian only)
const updateBook = async (req, res) => {
  try {
    const bookQuery = 'SELECT * FROM books WHERE id = ? AND isActive = 1';
    const book = await getSingle(bookQuery, [req.params.id]);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const updateData = {
      title: req.body.title || book.title,
      author: req.body.author || book.author,
      isbn: req.body.isbn || book.isbn,
      publisher: req.body.publisher || book.publisher,
      publicationYear: req.body.publicationYear || book.publicationYear,
      genre: req.body.genre || book.genre,
      description: req.body.description || book.description,
      totalCopies: req.body.totalCopies || book.totalCopies,
      availableCopies: req.body.availableCopies !== undefined 
        ? req.body.availableCopies 
        : book.availableCopies,
      location: req.body.location || book.location
    };

    const updateQuery = `
      UPDATE books 
      SET title = ?, author = ?, isbn = ?, publisher = ?, publicationYear = ?, genre = ?, description = ?, totalCopies = ?, availableCopies = ?, location = ?, updatedAt = datetime('now')
      WHERE id = ?
    `;
    await runQuery(updateQuery, [updateData.title, updateData.author, updateData.isbn, updateData.publisher, updateData.publicationYear, updateData.genre, updateData.description, updateData.totalCopies, updateData.availableCopies, updateData.location, req.params.id]);
    const updatedBook = await getSingle('SELECT * FROM books WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      book: updatedBook
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Admin only)
const deleteBook = async (req, res) => {
  try {
    const bookQuery = 'SELECT * FROM books WHERE id = ? AND isActive = 1';
    const book = await getSingle(bookQuery, [req.params.id]);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const result = await runQuery('UPDATE books SET isActive = 0 WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download book as text file
// @route   GET /api/books/:id/download
// @access  Private
const downloadBook = async (req, res) => {
  try {
    const bookQuery = 'SELECT * FROM books WHERE id = ? AND isActive = 1';
    const book = await getSingle(bookQuery, [req.params.id]);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Generate content for the book as text
    const bookContent = generateBookContent(book);
    
    // Create filename
    const filename = `${book.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}_${book.author.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}.txt`;
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send the book content
    res.send(bookContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to generate book content
const generateBookContent = (book) => {
  return `
================================================================================
                        ${book.title.toUpperCase()}
================================================================================

Author: ${book.author}
ISBN: ${book.isbn}
Publisher: ${book.publisher}
Publication Year: ${book.publicationYear}
Genre: ${book.genre}
Location: ${book.location}

${book.description ? `
DESCRIPTION:
${book.description}
` : ''}

================================================================================
                            TABLE OF CONTENTS
================================================================================

Chapter 1: Introduction to ${book.title}
Chapter 2: Fundamental Concepts
Chapter 3: Advanced Topics
Chapter 4: Practical Applications
Chapter 5: Case Studies
Chapter 6: Best Practices
Chapter 7: Future Directions
Chapter 8: Conclusion

================================================================================
                            CHAPTER 1: INTRODUCTION
================================================================================

This chapter introduces the fundamental concepts and principles discussed in
"${book.title}" by ${book.author}. 

The book explores the following key areas:
- Core theoretical foundations
- Practical implementation strategies
- Real-world applications
- Current industry standards
- Emerging trends and technologies

Readers will gain a comprehensive understanding of the subject matter through
clear explanations, practical examples, and insightful analysis.

================================================================================
                            CHAPTER 2: FUNDAMENTAL CONCEPTS
================================================================================

Building on the introduction, this chapter delves deeper into the core
concepts that form the foundation of ${book.title}.

Key topics covered:
- Basic terminology and definitions
- Historical context and development
- Theoretical frameworks
- Mathematical foundations (where applicable)
- Core principles and axioms

Each concept is explained with clarity and precision, making complex ideas
accessible to readers at various levels of expertise.

================================================================================
                            CHAPTER 3: ADVANCED TOPICS
================================================================================

This chapter explores more advanced and specialized topics within the field,
assuming readers have mastered the fundamentals covered in previous chapters.

Advanced topics include:
- Complex theoretical frameworks
- Sophisticated analytical techniques
- Cutting-edge research developments
- Interdisciplinary connections
- Expert-level applications

The material challenges readers to think critically and develop deeper
understanding of the subject matter.

================================================================================
                            CHAPTER 4: PRACTICAL APPLICATIONS
================================================================================

Theory meets practice in this comprehensive chapter that demonstrates how the
concepts from ${book.title} apply to real-world scenarios.

Applications covered:
- Industry case studies
- Practical examples and exercises
- Step-by-step implementation guides
- Troubleshooting common issues
- Optimization strategies

Readers will learn how to apply theoretical knowledge to solve practical
problems effectively.

================================================================================
                            CHAPTER 5: CASE STUDIES
================================================================================

This chapter presents detailed case studies that illustrate the principles and
techniques discussed throughout the book.

Case studies include:
- Real-world success stories
- Failure analysis and lessons learned
- Comparative analysis of different approaches
- Industry-specific applications
- Cross-disciplinary examples

Each case study provides valuable insights into practical implementation and
problem-solving strategies.

================================================================================
                            CHAPTER 6: BEST PRACTICES
================================================================================

Drawing from extensive experience and research, this chapter outlines the best
practices for working with ${book.title} concepts and applications.

Best practices covered:
- Industry standards and conventions
- Quality assurance methodologies
- Performance optimization techniques
- Security considerations (where applicable)
- Collaboration and teamwork strategies

These practices help readers avoid common pitfalls and achieve optimal results.

================================================================================
                            CHAPTER 7: FUTURE DIRECTIONS
================================================================================

Looking ahead, this chapter explores emerging trends and future directions in
the field of ${book.title}.

Future directions include:
- Emerging technologies and methodologies
- Research opportunities and challenges
- Industry evolution and transformation
- Interdisciplinary developments
- Global perspectives and considerations

This forward-looking perspective helps readers prepare for future developments
and stay current in their field.

================================================================================
                            CHAPTER 8: CONCLUSION
================================================================================

In this final chapter, we summarize the key concepts, insights, and practical
applications covered throughout "${book.title}".

Key takeaways:
- Comprehensive review of major concepts
- Integration of theory and practice
- Practical recommendations for implementation
- Resources for further learning
- Final thoughts and reflections

The conclusion reinforces the importance of the subject matter and provides
guidance for continued learning and professional development.

================================================================================
                            ADDITIONAL RESOURCES
================================================================================

Recommended Reading:
- Related academic journals and publications
- Industry reports and white papers
- Online courses and tutorials
- Professional organizations and communities
- Software tools and resources (where applicable)

References and Bibliography:
- Academic sources cited throughout the book
- Industry standards and specifications
- Research papers and articles
- Books and publications for further study

================================================================================
                            ABOUT THE AUTHOR
================================================================================

${book.author} is a recognized expert in the field of ${book.genre.toLowerCase()} 
with extensive experience in both academic research and practical applications.

This book represents years of research, teaching, and professional experience,
designed to provide readers with comprehensive knowledge and practical skills
in ${book.title.toLowerCase()}.

================================================================================
                            BOOK INFORMATION
================================================================================

Title: ${book.title}
Author: ${book.author}
ISBN: ${book.isbn}
Publisher: ${book.publisher}
Publication Year: ${book.publicationYear}
Genre: ${book.genre}
Total Copies Available: ${book.availableCopies}/${book.totalCopies}
Library Location: ${book.location}

For more information about this book or to access additional resources,
please visit the library or contact the administration.

================================================================================
                            END OF BOOK
================================================================================

This text file is a digital representation of "${book.title}" for educational
purposes only. The full printed version contains additional content,
illustrations, and supplementary materials.

© ${book.publicationYear} ${book.publisher}. All rights reserved.
Generated on: ${new Date().toLocaleString()}
`.trim();
};

module.exports = {
  getAllBooks,
  getBookById,
  searchBooks,
  getBooksByGenre,
  getAvailableBooks,
  createBook,
  updateBook,
  deleteBook,
  downloadBook
};
