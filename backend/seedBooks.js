const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to database
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Sample books data
const books = [
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    publisher: "MIT Press",
    publicationYear: 2009,
    genre: "Computer Science",
    description: "A comprehensive introduction to the modern study of computer algorithms.",
    totalCopies: 5,
    availableCopies: 3,
    location: "Main Library - Section A",
    addedBy: 1
  },
  {
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    publisher: "Prentice Hall",
    publicationYear: 2008,
    genre: "Computer Science",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
    totalCopies: 3,
    availableCopies: 2,
    location: "Main Library - Section B",
    addedBy: 1
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    isbn: "978-0201616224",
    publisher: "Addison-Wesley",
    publicationYear: 1999,
    genre: "Computer Science",
    description: "Your journey to mastery. From journeyman to master.",
    totalCopies: 4,
    availableCopies: 4,
    location: "Main Library - Section B",
    addedBy: 1
  },
  {
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    isbn: "978-0201633610",
    publisher: "Addison-Wesley",
    publicationYear: 1994,
    genre: "Computer Science",
    description: "Capturing a wealth of experience about the design of object-oriented software.",
    totalCopies: 2,
    availableCopies: 1,
    location: "Main Library - Section C",
    addedBy: 1
  },
  {
    title: "Refactoring: Improving the Design of Existing Code",
    author: "Martin Fowler",
    isbn: "978-0201485677",
    publisher: "Addison-Wesley",
    publicationYear: 1999,
    genre: "Computer Science",
    description: "Refactoring is the process of changing a software system in such a way that it does not alter the external behavior of the code.",
    totalCopies: 3,
    availableCopies: 2,
    location: "Main Library - Section C",
    addedBy: 1
  },
  {
    title: "The Art of Computer Programming",
    author: "Donald E. Knuth",
    isbn: "978-0201896831",
    publisher: "Addison-Wesley",
    publicationYear: 1997,
    genre: "Computer Science",
    description: "A comprehensive monograph written by the computer scientist Donald Knuth.",
    totalCopies: 2,
    availableCopies: 0,
    location: "Main Library - Section D",
    addedBy: 1
  },
  {
    title: "Structure and Interpretation of Computer Programs",
    author: "Harold Abelson, Gerald Jay Sussman, Julie Sussman",
    isbn: "978-0262510875",
    publisher: "MIT Press",
    publicationYear: 1996,
    genre: "Computer Science",
    description: "A textbook about the principles of computer programming, such as abstraction, modularity, recursion, and programming language design.",
    totalCopies: 4,
    availableCopies: 3,
    location: "Main Library - Section A",
    addedBy: 1
  },
  {
    title: "Code Complete: A Practical Handbook of Software Construction",
    author: "Steve McConnell",
    isbn: "978-0735619678",
    publisher: "Microsoft Press",
    publicationYear: 2004,
    genre: "Computer Science",
    description: "A practical handbook of software construction, covering the entire software development process.",
    totalCopies: 3,
    availableCopies: 2,
    location: "Main Library - Section B",
    addedBy: 1
  },
  {
    title: "The C Programming Language",
    author: "Brian W. Kernighan, Dennis M. Ritchie",
    isbn: "978-0131103627",
    publisher: "Prentice Hall",
    publicationYear: 1988,
    genre: "Computer Science",
    description: "The original book on C programming by the creators of the language.",
    totalCopies: 5,
    availableCopies: 4,
    location: "Main Library - Section A",
    addedBy: 1
  },
  {
    title: "JavaScript: The Good Parts",
    author: "Douglas Crockford",
    isbn: "978-0596517748",
    publisher: "O'Reilly Media",
    publicationYear: 2008,
    genre: "Computer Science",
    description: "Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad.",
    totalCopies: 4,
    availableCopies: 3,
    location: "Main Library - Section E",
    addedBy: 1
  },
  {
    title: "Linear Algebra and Its Applications",
    author: "David C. Lay",
    isbn: "978-0321982384",
    publisher: "Pearson",
    publicationYear: 2015,
    genre: "Mathematics",
    description: "An introduction to linear algebra and its applications.",
    totalCopies: 3,
    availableCopies: 2,
    location: "Math Library - Section 1",
    addedBy: 1
  },
  {
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    isbn: "978-0538497909",
    publisher: "Cengage Learning",
    publicationYear: 2010,
    genre: "Mathematics",
    description: "A comprehensive textbook on calculus.",
    totalCopies: 4,
    availableCopies: 2,
    location: "Math Library - Section 2",
    addedBy: 1
  },
  {
    title: "Discrete Mathematics and Its Applications",
    author: "Kenneth H. Rosen",
    isbn: "978-0073383095",
    publisher: "McGraw-Hill",
    publicationYear: 2011,
    genre: "Mathematics",
    description: "Discrete mathematics and its applications to computer science.",
    totalCopies: 3,
    availableCopies: 1,
    location: "Math Library - Section 3",
    addedBy: 1
  },
  {
    title: "Introduction to Probability and Statistics",
    author: "William Mendenhall, Robert J. Beaver, Barbara M. Beaver",
    isbn: "978-1133103752",
    publisher: "Cengage Learning",
    publicationYear: 2012,
    genre: "Mathematics",
    description: "An introduction to probability and statistics for students in engineering and the sciences.",
    totalCopies: 2,
    availableCopies: 2,
    location: "Math Library - Section 4",
    addedBy: 1
  },
  {
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway, John W. Jewett",
    isbn: "978-1133954149",
    publisher: "Cengage Learning",
    publicationYear: 2013,
    genre: "Physics",
    description: "A comprehensive introduction to physics for science and engineering students.",
    totalCopies: 3,
    availableCopies: 2,
    location: "Science Library - Physics",
    addedBy: 1
  },
  {
    title: "University Physics with Modern Physics",
    author: "Hugh D. Young, Roger A. Freedman",
    isbn: "978-0321973610",
    publisher: "Pearson",
    publicationYear: 2015,
    genre: "Physics",
    description: "University physics with modern physics.",
    totalCopies: 2,
    availableCopies: 1,
    location: "Science Library - Physics",
    addedBy: 1
  },
  {
    title: "Organic Chemistry",
    author: "Paula Yurkanis Bruice",
    isbn: "978-0321803221",
    publisher: "Pearson",
    publicationYear: 2016,
    genre: "Chemistry",
    description: "A comprehensive introduction to organic chemistry.",
    totalCopies: 2,
    availableCopies: 1,
    location: "Science Library - Chemistry",
    addedBy: 1
  },
  {
    title: "Molecular Biology of the Cell",
    author: "Bruce Alberts, Alexander Johnson, Julian Lewis",
    isbn: "978-0815344322",
    publisher: "Garland Science",
    publicationYear: 2014,
    genre: "Biology",
    description: "The definitive text in molecular cell biology.",
    totalCopies: 2,
    availableCopies: 0,
    location: "Science Library - Biology",
    addedBy: 1
  },
  {
    title: "Business Analytics",
    author: "James R. Evans",
    isbn: "978-0133555196",
    publisher: "Pearson",
    publicationYear: 2016,
    genre: "Business",
    description: "Methods, models, and decisions for business analytics.",
    totalCopies: 3,
    availableCopies: 3,
    location: "Business Library",
    addedBy: 1
  },
  {
    title: "The Lean Startup",
    author: "Eric Ries",
    isbn: "978-0307887894",
    publisher: "Crown Business",
    publicationYear: 2011,
    genre: "Business",
    description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
    totalCopies: 4,
    availableCopies: 2,
    location: "Business Library",
    addedBy: 1
  }
];

// Clear existing books and insert new ones
async function seedBooks() {
  try {
    // Clear existing books
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM books', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Cleared existing books');

    // Insert new books
    for (const book of books) {
      await new Promise((resolve, reject) => {
        const query = `
          INSERT INTO books (
            title, author, isbn, publisher, publication_year, genre, 
            description, total_copies, available_copies, location, added_by, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `;

        db.run(query, [
          book.title,
          book.author,
          book.isbn,
          book.publisher,
          book.publicationYear,
          book.genre,
          book.description,
          book.totalCopies,
          book.availableCopies,
          book.location,
          book.addedBy
        ], function(err) {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    console.log(`Successfully seeded ${books.length} books`);
  } catch (error) {
    console.error('Error seeding books:', error);
  } finally {
    db.close();
  }
}

// Run the seeding
seedBooks();
