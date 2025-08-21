import React, { useEffect, useState } from 'react';
import UploadResume from '../components/UploadResume';
interface User {
  id: number;
  name: string;
  email: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // ⭐ new state
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [extractedData, setExtractedData] = useState<any>(null);

    
  const USERS_PER_PAGE = 7;
  const PAGE_WINDOW = 4;

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const currentWindowStart = Math.floor((currentPage - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1;
  const currentWindowEnd = Math.min(currentWindowStart + PAGE_WINDOW - 1, totalPages);

  const goToNextWindow = () => {
    if (currentWindowEnd < totalPages) {
      setCurrentPage(currentWindowEnd + 1);
    }
  };

  const goToPrevWindow = () => {
    if (currentWindowStart > 1) {
      setCurrentPage(currentWindowStart - PAGE_WINDOW);
    }
  };

  // ⭐ Add this effect to clear extracted data when user changes
  useEffect(() => {
    setExtractedSkills([]);
    setExtractedData(null);
    // If you have a file input, you can also clear its value here if needed
  }, [selectedUser]);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
      {/* Left: Users List */}
      <div style={{ flex: 2, maxWidth: '400px' }}>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '8px',
            width: '100%',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />

        {/* User Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentUsers.map((u) => (
            <div
              key={u.id}
              onClick={() => setSelectedUser(u)} // 👈 set selected user
              style={{
                padding: '12px',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <strong style={{ fontSize: '16px' }}>{u.name}</strong>
              <span style={{ fontSize: '14px', color: '#555' }}>{u.email}</span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '5px',
          }}
        >
          <button
            onClick={goToPrevWindow}
            disabled={currentWindowStart === 1}
          >
            Prev
          </button>

          {Array.from(
            { length: currentWindowEnd - currentWindowStart + 1 },
            (_, i) => currentWindowStart + i
          ).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              style={{
                background: currentPage === pageNum ? '#007bff' : '#f0f0f0',
                color: currentPage === pageNum ? '#fff' : '#000',
              }}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={goToNextWindow}
            disabled={currentWindowEnd >= totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Right: Side Panel */}
      <div
        style={{
          width: '800px',
          padding: '20px',
          background: '#f9f9f9',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}
      >
        <h3>Employee Details</h3>
        {/* {selectedUser ? (
          <div>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
          </div>
        ) : (
          <p>Click on a card to view details here.</p>
        )} */}
        {selectedUser ? (
          <div>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>

            {/* Upload Resume Form */}
            <h4 style={{ marginTop: '20px' }}>Upload Resume</h4>
           
            <form
    onSubmit={async (e) => {
      e.preventDefault();
      if (!selectedUser) return;
      const fileInput = e.currentTarget.querySelector<HTMLInputElement>('input[type="file"]');
      if (!fileInput?.files?.[0]) return;

      const formData = new FormData();
      formData.append("resume", fileInput.files[0]);

      const res = await fetch(`http://localhost:5000/api/resumes/upload/${selectedUser.id}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.matchedSkills) {
        // alert(`Matched Skills: ${data.matchedSkills.join(", ")}`);
        setExtractedSkills(data.matchedSkills);
      }
    }}
  >
    <input type="file" accept=".pdf,.doc,.docx" />
    <br />
    <button type="submit" style={{ marginTop: '10px', padding: '6px 12px' }}>
      Upload
    </button>
  </form>
  {extractedSkills.length > 0 && (
    <div style={{ marginTop: '20px' }}>
      <h4>Extracted Skills</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {extractedSkills.map((skill, i) => (
          <span
            key={i}
            style={{
              padding: '6px 10px',
              background: '#007bff',
              color: '#fff',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )}

  <UploadResume />
          </div>
        ) : (
          <p>Click on a card to view details here.</p>
        )}

      </div>
    </div>
  );
};

export default UsersList;
