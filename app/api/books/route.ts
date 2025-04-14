import { NextResponse } from 'next/server';

// Mock data for demonstration
const books = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    quantity: 10,
    price: 9.99,
    category: 'Classic',
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0446310789',
    quantity: 15,
    price: 12.99,
    category: 'Fiction',
  },
];

export async function GET() {
  return NextResponse.json({ books });
}

export async function POST(request: Request) {
  try {
    const book = await request.json();
    const newBook = {
      id: Date.now().toString(),
      ...book,
    };
    books.push(newBook);
    return NextResponse.json({ book: newBook });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}
