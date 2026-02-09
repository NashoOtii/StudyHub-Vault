var library = new Library();

library.AddBook(new Book("1984", "George Orwell", 1949));
library.AddBook(new Book("Animal Farm", "George Orwell", 1945));
library.AddBook(new Book("The Alchemist", "Paulo Coelho", 1988));

library.ListAllBooks();

System.Console.WriteLine("\nBooks by George Orwell:");
library.SearchByAuthor("George Orwell");
