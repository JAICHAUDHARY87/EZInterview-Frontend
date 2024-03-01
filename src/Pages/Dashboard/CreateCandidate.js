import React, { useState } from 'react';
import './CreateCandidate.css'; 
import { useSelector } from 'react-redux';

const CreateCandidate = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        skills: [],
        role: '',
        current_status: '',
        company_id: currentUser._id, // Assigning the current user's company ID
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'skills') {
            // Convert comma-separated string to an array
            const skillsArray = value.split(',').map(skill => skill.trim());
            setFormData(prevState => ({
                ...prevState,
                [name]: skillsArray,
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8080/api/candidate/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create candidate');
            }

            // Reset the form data after successful submission
            setFormData({
                name: '',
                email: '',
                contact: '',
                skills: [],
                role: '',
                current_status: '',
                company_id: currentUser._id,
            });

            // Optionally, you can display a success message or perform other actions here
            console.log('Candidate created successfully');
        } catch (error) {
            console.error('Error creating candidate:', error.message);
            // Optionally, you can display an error message to the user here
        }
    };

    return (
        <div className="create-candidate-container">
            <h2>Create Candidate</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Contact:</label>
                    <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Skills:</label>
                    <input type="text" name="skills" value={formData.skills.join(', ')} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Role:</label>
                    <input type="text" name="role" value={formData.role} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select name="current_status" value={formData.current_status} onChange={handleChange} required>
                        <option value="">Select Status</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Screening In Progress">Screening In Progress</option>
                        <option value="Screening Passed">Screening Passed</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Hired">Hired</option>
                        <option value="Not Selected">Not Selected</option>
                    </select>
                </div>
                {/* Assuming company_id will be filled dynamically */}
                <div className="form-group">
                    <label>Company ID:</label>
                    <input type="text" name="company_id" value={currentUser._id} onChange={handleChange} required />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateCandidate;
