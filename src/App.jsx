// Import React and hooks
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // State to store list of students
  const [students, setStudents] = useState([]);
  
  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    grade: 'A'
  });
  
  // State for editing
  const [editingId, setEditingId] = useState(null);
  
  // Backend API URL (change this after deployment)
  const API_URL = 'https://students-manager-app-backend.onrender.com/api/students';

  // Fetch students when component loads
  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to fetch all students from backend
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing student
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      setEditingId(null);
    } else {
      // Create new student
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
    }
    
    // Reset form and refresh student list
    setFormData({ name: '', email: '', age: '', grade: 'A' });
    fetchStudents();
  };

  // Handle edit button click
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      age: student.age,
      grade: student.grade
    });
    setEditingId(student._id);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      fetchStudents();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎓 Student Manager</h1>
        <p>Manage student records easily</p>
      </header>

      <main className="container">
        {/* Add/Edit Student Form */}
        <section className="form-section">
          <h2>{editingId ? 'Edit Student' : 'Add New Student'}</h2>
          <form onSubmit={handleSubmit} className="student-form">
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Enter age"
                min="16"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label>Grade:</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                required
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              {editingId ? 'Update Student' : 'Add Student'}
            </button>
            
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', email: '', age: '', grade: 'A' });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        {/* Students List */}
        <section className="list-section">
          <h2>Students List ({students.length} students)</h2>
          
          {students.length === 0 ? (
            <p className="no-data">No students found. Add your first student!</p>
          ) : (
            <div className="students-grid">
              {students.map((student) => (
                <div key={student._id} className="student-card">
                  <div className="student-info">
                    <h3>{student.name}</h3>
                    <p><strong>Email:</strong> {student.email}</p>
                    <p><strong>Age:</strong> {student.age} years</p>
                    <p><strong>Grade:</strong> 
                      <span className={`grade grade-${student.grade}`}>
                        {student.grade}
                      </span>
                    </p>
                    <p><strong>Added:</strong> {new Date(student.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="student-actions">
                    <button
                      onClick={() => handleEdit(student)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>Built with MERN Stack | Student Manager App</p>
      </footer>
    </div>
  );
}

export default App;
