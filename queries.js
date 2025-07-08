/** Queries for MongoDB Assignment
 * 
 * Task 1: MongoDB Setup
 * 
 *  Create a new database named "plp_bookstore"
 *  Create a collection named "books"
 *  Insert at least 5 book documents into the "books" collection
 */

//creating and switching to the new databasse
use plp_bookstore;

// Creating the books collection
db.createCollection("books");

// loading the data
node ~/Desktop/MERN_Stack/Content/week-1-mongodb-fundamentals-assignment-Ian12467/insert_books.js


/** 
 * Task 2: Basic CRUD Operations
 *  Querying the "books" collection
*   Assuming the "books" collection has been created and populated with data
 * */

// Query 1: Find all books
db.books.find({});

// Query 2: Find books with a specific title
db.books.find({ title: "The Great Gatsby" });

// Query 3: Find books published after a certain year
db.books.find({ published_year: { $gt: 1950 } });

// Query 4: Find books by a specific author

db.books.find({ author: "F. Scott Fitzgerald" });

// Query 5: Find books with a specific genre
db.books.find({ genre: "Fiction" });

// Query 6: Find books with a specific ISBN
db.books.find({ isbn: "978-0743273565" });

// Query 7: Find books with a specific number of pages
db.books.find({ pages: { $gt: 281 } });

// Query 8: Update the price of a specific book (e.g 'The Great Gatsby'):
db.books.updateOne({ title: "The Great Gatsby" }, { $set: { price: 11.99 } });

// Query 9: Delete a book by title (e.g 'The Great Gatsby'):
db.books.deleteOne({ title: "The Great Gatsby" });

/**
 * Task 3: Advanced Queries
 */

// Query 1: find books that are both in stock and published after 2010
db.books.find({in_stock:true,published_year:{$gt: 2010}});

// Query 2: Use projection to return only the title, author, and price fields in your queries
db.books.find({},{title:1, author:1, price:1, _id:1});

// Query 3: Implement sorting to display books by price (both ascending and descending)
db.books.find({}).sort({price:1}); // Ascending order
db.books.find({}).sort({price:-1}); // Descending order

// Query 4: Use the `limit` and `skip` methods to implement pagination (5 books per page)
db.books.find({}).limit(5).skip(0); // First page
db.books.find({}).limit(5).skip(5); // Second page

/**
 * Task 4: Aggregation Pipeline
 */

// Query 1: Use an aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
    {
        $group: {
            _id: "$genre",
            averagePrice: { $avg: "$price" }
        }
    },
    {
        $sort: { averagePrice: 1 } // Sort by average price in ascending order
    }
]);

// Query 2: Use an aggregation pipeline to find the author with the most books in the collection
db.books.aggregate([
    {
        $group: {
            _id: "$author",
            bookCount: { $sum: 1 }
        }
    },
    {
        $sort: { bookCount: -1 } // Sort by book count in descending order
    },
    {
        $limit: 1 // Get the author with the most books
    }
]);

// Query 3: Implement a pipeline that groups books by publication decade and counts them
db.books.aggregate([
    {
        $group: {
            _id: { $floor: { $divide: ["$published_year", 10] } }, // Group by decade
            bookCount: { $sum: 1 }
        }
    },
    {
        $project: {
            decade: { $multiply: ["$_id", 10] }, // Convert to actual decade
            bookCount: 1
        }
    },
    {
        $sort: { decade: 1 } // Sort by decade in ascending order
    }
]);

/**
 * Task 5: Indexing
  */

// Query 1: Create an index on the title field to improve search performance
db.books.createIndex({ title: 1 });

// Query 2: Create a compound index on author and published_year to optimize queries that filter by both fields
db.books.createIndex({ author: 1, published_year: 1 });

// Query 3: Use the explain method to analyze the performance of a query
db.books.find({ author: "F. Scott Fitzgerald" }).explain("executionStats");

