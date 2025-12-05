// API Base URL
const API_URL = "http://localhost:3000/api/movies";

// DOM Elements
const form = document.getElementById("movieForm");
const moviesContainer = document.getElementById("moviesContainer");
const cancelBtn = document.getElementById("cancelBtn");

// State
let isEditMode = false;
let currentEditId = null;

// Event Listeners
form.addEventListener("submit", handleFormSubmit);
cancelBtn.addEventListener("click", resetForm);

// Initialize
fetchMovies();

// Fetch all movies
async function fetchMovies() {
    try {
        moviesContainer.innerHTML = '<p class="loading">Loading movies...</p>';
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        moviesContainer.innerHTML = `<p class="error">Error loading movies: ${error.message}</p>`;
    }
}

// Display movies on the page
function displayMovies(movies) {
    if (movies.length === 0) {
        moviesContainer.innerHTML = `
            <div class="empty-state">
                <h3>No movies yet</h3>
                <p>Add your first movie using the form above!</p>
            </div>
        `;
        return;
    }

    moviesContainer.innerHTML = movies.map(movie => `
        <div class="movie-card">
            <h3>${escapeHtml(movie.title)}</h3>
            <div class="movie-info">
                <strong>Director:</strong> ${escapeHtml(movie.director)}
            </div>
            <div class="movie-info">
                <strong>Genre:</strong> ${escapeHtml(movie.genre || "Unknown")}
            </div>
            <div class="movie-info">
                <strong>Release Year:</strong> ${movie.release_year || "N/A"}
            </div>
            <div class="movie-rating ${getRatingClass(movie.rating)}">
                Rating: ${movie.rating}/10
            </div>
            <div class="movie-actions">
                <button class="btn btn-edit" onclick="editMovie('${movie._id}')">Edit</button>
                <button class="btn btn-delete" onclick="deleteMovie('${movie._id}')">Delete</button>
            </div>
        </div>
    `).join("");
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const movieData = {
        title: document.getElementById("title").value,
        director: document.getElementById("director").value,
        genre: document.getElementById("genre").value || "unknown",
        rating: parseFloat(document.getElementById("rating").value) || 0,
        release_year: parseInt(document.getElementById("release_year").value) || null,
    };

    try {
        if (isEditMode) {
            // Update existing movie
            const response = await fetch(`${API_URL}/${currentEditId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movieData),
            });

            if (!response.ok) {
                throw new Error("Failed to update movie");
            }

            showMessage("Movie updated successfully!", "success");
        } else {
            // Create new movie
            const response = await fetch(`${API_URL}/createMovie`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movieData),
            });

            if (!response.ok) {
                throw new Error("Failed to create movie");
            }

            showMessage("Movie added successfully!", "success");
        }

        resetForm();
        fetchMovies();
    } catch (error) {
        console.error("Error:", error);
        showMessage(`Error: ${error.message}`, "error");
    }
}

// Edit movie
async function editMovie(movieId) {
    try {
        const response = await fetch(`${API_URL}/${movieId}`);
        
        if (!response.ok) {
            throw new Error("Failed to fetch movie");
        }

        const movie = await response.json();

        // Populate form with movie data
        document.getElementById("title").value = movie.title;
        document.getElementById("director").value = movie.director;
        document.getElementById("genre").value = movie.genre;
        document.getElementById("rating").value = movie.rating;
        document.getElementById("release_year").value = movie.release_year || "";

        // Set edit mode
        isEditMode = true;
        currentEditId = movieId;
        cancelBtn.style.display = "inline-block";

        // Scroll to form
        document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });

        // Update submit button text
        const submitBtn = form.querySelector("button[type='submit']");
        submitBtn.textContent = "Update Movie";
    } catch (error) {
        console.error("Error editing movie:", error);
        showMessage(`Error: ${error.message}`, "error");
    }
}

// Delete movie
async function deleteMovie(movieId) {
    if (!confirm("Are you sure you want to delete this movie?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${movieId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete movie");
        }

        showMessage("Movie deleted successfully!", "success");
        fetchMovies();
    } catch (error) {
        console.error("Error deleting movie:", error);
        showMessage(`Error: ${error.message}`, "error");
    }
}

// Reset form
function resetForm() {
    form.reset();
    isEditMode = false;
    currentEditId = null;
    cancelBtn.style.display = "none";

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.textContent = "Add Movie";
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = type;
    messageDiv.textContent = message;

    moviesContainer.insertAdjacentElement("beforebegin", messageDiv);

    // Auto remove message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Get rating class for styling
function getRatingClass(rating) {
    if (rating >= 7) return "high";
    if (rating >= 5) return "medium";
    return "low";
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
