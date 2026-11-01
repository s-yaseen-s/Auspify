document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const searchInput = document.getElementById('searchInput');
    const booksTableBody = document.getElementById('booksTableBody');

    let allBooks = [];

    // 1. Fetch all books from the server
    async function fetchBooks() {
        try {
            const response = await fetch('/api/books');
            if (!response.ok) throw new Error('Failed to fetch books');
            
            allBooks = await response.json();
            renderBooks(allBooks);
        } catch (error) {
            console.error('Error:', error);
            booksTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--danger-color);">Error loading books.</td></tr>`;
        }
    }

    // 2. Render book records dynamically into the DOM
    function renderBooks(books) {
        booksTableBody.innerHTML = '';

        if (books.length === 0) {
            booksTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No books found.</td></tr>`;
            return;
        }

        books.forEach(book => {
            const tr = document.createElement('tr');
            
            const isAvailable = book.status.toLowerCase() === 'available';
            const badgeClass = isAvailable ? 'badge-available' : 'badge-borrowed';
            const toggleText = isAvailable ? 'Mark Borrowed' : 'Mark Available';
            const nextStatus = isAvailable ? 'borrowed' : 'available';

            tr.innerHTML = `
                <td>${book.id}</td>
                <td><strong>${escapeHtml(book.title)}</strong></td>
                <td>${escapeHtml(book.author)}</td>
                <td><code>${escapeHtml(book.isbn)}</code></td>
                <td>${escapeHtml(book.genre)}</td>
                <td><span class="badge ${badgeClass}">${escapeHtml(book.status)}</span></td>
                <td>
                    <button class="btn-action btn-status" data-id="${book.id}" data-next="${nextStatus}">${toggleText}</button>
                    <button class="btn-action btn-delete" data-id="${book.id}">Delete</button>
                </td>
            `;

            booksTableBody.appendChild(tr);
        });
    }

    // 3. Handle Form Submission (POST /api/books)
    bookForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const isbn = document.getElementById('isbn').value.trim();
        const genre = document.getElementById('genre').value.trim();

        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, isbn, genre })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Failed to add book.');
                return;
            }

            bookForm.reset();
            fetchBooks();
        } catch (error) {
            console.error('Error adding book:', error);
            alert('An unexpected error occurred.');
        }
    });

    // 4. Handle Table Actions (Toggle Status & Delete via Event Delegation)
    booksTableBody.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;

        if (!id) return;

        // Status Toggle Action
        if (target.classList.contains('btn-status')) {
            const status = target.dataset.next;
            try {
                const response = await fetch(`/api/books/${id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status })
                });

                if (response.ok) {
                    fetchBooks();
                } else {
                    const data = await response.json();
                    alert(data.error || 'Failed to update status.');
                }
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }

        // Delete Action
        if (target.classList.contains('btn-delete')) {
            if (!confirm('Are you sure you want to delete this book record?')) return;

            try {
                const response = await fetch(`/api/books/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    fetchBooks();
                } else {
                    const data = await response.json();
                    alert(data.error || 'Failed to delete book.');
                }
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    });

    // 5. Live Search Filter
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allBooks.filter(book => 
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.genre.toLowerCase().includes(query) ||
            book.isbn.toLowerCase().includes(query)
        );
        renderBooks(filtered);
    });

    // Helper function to sanitize text rendering
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Initial Load
    fetchBooks();
});