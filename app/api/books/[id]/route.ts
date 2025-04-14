import { NextResponse } from 'next/server';

// Mock data for demonstration (same as in route.ts)
let books = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    quantity: 10,
    price: 9.99,
    category: 'Classic'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0446310789',
    quantity: 15,
    price: 12.99,
    category: 'Fiction'
  }
];

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updatedBook = await request.json();
    
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    books[bookIndex] = { ...books[bookIndex], ...updatedBook };
    return NextResponse.json({ book: books[bookIndex] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    books = books.filter(book => book.id !== id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    );
  }
} 