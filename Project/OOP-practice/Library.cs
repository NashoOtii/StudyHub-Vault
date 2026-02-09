using System.Collections.Generic;

public class Library
{
    private List<Book> books = new List<Book>();

    public void AddBook(Book book)
    {
        books.Add(book);
    }

    public void RemoveBook(Book book)
    {
        books.Remove(book);
    }

    public void ListAllBooks()
    {
        foreach (var book in books)
        {
            System.Console.WriteLine($"{book.Title} by {book.Author} ({book.Year})");
        }
    }

    public void SearchByAuthor(string author)
    {
        foreach (var book in books)
        {
            if (book.Author == author)
            {
                System.Console.WriteLine($"{book.Title} ({book.Year})");
            }
        }
    }
}
