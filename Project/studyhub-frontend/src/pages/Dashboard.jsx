import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- CONSTANTS ---
const FACULTY_COURSES = {
  "School of Arts and Social Sciences": ["Sociology", "Psychology", "Political Science", "History", "Literature"],
  "School of Education": ["Curriculum Studies", "Psychology of Education", "Special Needs Education", "Educational Admin"],
  "School of Biological and Physical Sciences": ["Analytical Chemistry", "Industrial Chemistry", "Physics"],
  "School of Public Health and Community Development": ["Epidemiology", "Community Health", "Human Nutrition", "Public Health"],
  "School of Environment and Earth Sciences": ["Environmental Science", "Geography", "Climate Change", "Earth Science"],
  "School of Development and Strategic Studies": ["Development Studies", "International Relations", "Strategic Management"],
  "School of Graduate Studies": ["Research Methodology", "Thesis Writing", "Advanced Statistics"],
  "School of Nursing": ["Midwifery", "Critical Care", "Pediatric Nursing", "Community Nursing"],
  "School of Business and Economics": ["Accounting", "Finance", "Marketing", "Human Resource Management", "Economics"],
  "School of Medicine": ["Human Anatomy", "Physiology", "Medical Biochemistry", "Pathology", "Surgery"],
  "School of Agriculture and Food Security": ["Agribusiness", "Horticulture", "Soil Science", "Food Security"],
  "School of Mathematics, Statistics and Actuarial Science": ["Pure Mathematics", "Applied Statistics", "Actuarial Science", "Financial Math"],
  "School of Computing and Informatics": ["Computer Science", "IT", "Software Engineering", "Cyber Security"],
  "School of Law": ["Constitutional Law", "Criminal Law", "Law of Torts", "Commercial Law"],
  "School of Planning and Architecture": ["Urban Planning", "Architectural Design", "Regional Planning"],
  "Institute of Gender Studies": ["Gender & Development", "Women's Studies", "Social Work"]
};

export default function Dashboard({ setUser: setGlobalUser }) {
  // 1. User State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { name: 'Guest', schoolName: 'School of Computing and Informatics', year: 1 };
  });

  // 2. Dashboard State
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState(FACULTY_COURSES[user.schoolName]?.[0] || "General");
  const [searchQuery, setSearchQuery] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  
  // 3. "Database" State (The list of all uploaded files)
  const [allFiles, setAllFiles] = useState(() => {
    const savedFiles = localStorage.getItem('vault_files');
    return savedFiles ? JSON.parse(savedFiles) : [];
  });

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const shades = ["#3949ab", "#3f51b5", "#5c6bc0", "#7986cb"];

  // --- ACTIONS ---

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (setGlobalUser) setGlobalUser(null);
    navigate('/login');
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!fileTitle || !selectedFile) {
      alert("Please enter a title and select a file!");
      return;
    }

    const newFile = {
      id: Date.now(), // Unique ID
      title: fileTitle,
      fileName: selectedFile.name,
      course: activeTab,
      school: user.schoolName,
      uploader: user.name,
      date: new Date().toLocaleDateString(),
      type: selectedFile.name.split('.').pop().toUpperCase() // e.g., PDF, DOCX
    };

    const updatedFiles = [newFile, ...allFiles];
    setAllFiles(updatedFiles);
    localStorage.setItem('vault_files', JSON.stringify(updatedFiles));
    
    // Reset Form
    setFileTitle("");
    setSelectedFile(null);
    alert("Upload Successful!");
  };

  // --- FILTERING LOGIC ---
  const filteredFiles = allFiles.filter(file => 
    file.school === user.schoolName && 
    file.course === activeTab &&
    file.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`dashboard-grid ${darkMode ? 'dark-theme' : ''}`}>
      <main className="vault-content">
        
        {/* HEADER */}
        <header className="community-header">
          <h1 style={{ color: 'var(--text-main)' }}>{user.schoolName} Vault</h1>
          {/* FIX: Changed text to Welcome */}
          <p style={{ color: 'var(--text-muted)' }}>Welcome, {user.name}</p>
        </header>

        {/* COURSE TABS */}
        <nav className="course-tabs">
          {FACULTY_COURSES[user.schoolName]?.map((course, index) => (
            <button 
              key={course}
              style={{ 
                backgroundColor: activeTab === course ? shades[index % 4] : "transparent",
                color: activeTab === course ? "#fff" : "var(--text-main)",
                borderColor: shades[index % 4]
              }}
              className={`tab-btn ${activeTab === course ? 'active' : ''}`}
              onClick={() => setActiveTab(course)}
            >
              {course}
            </button>
          ))}
        </nav>

        {/* UPLOAD & SEARCH SECTION */}
        <div className="vault-card upload-section">
          <h3>Contribute to {activeTab}</h3>
          
          <div className="upload-controls">
            <input 
              type="text" 
              placeholder="Document Title (e.g. Lab Report 1)..." 
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              className="input-field"
            />
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileSelect}
            />
            
            <button 
              onClick={() => fileInputRef.current.click()} 
              className="action-btn select-btn"
            >
              {selectedFile ? "📂 " + selectedFile.name : "Select File"}
            </button>

            <button 
              onClick={handleUpload} 
              className="action-btn upload-btn"
            >
              Upload
            </button>
          </div>
        </div>

        {/* MATERIAL LIST / SEARCH RESULTS */}
        <div className="materials-container">
          <div className="search-bar-container">
            <input 
              type="text" 
              placeholder={`🔍 Search ${activeTab} materials...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
          </div>

          {filteredFiles.length > 0 ? (
            <div className="file-grid">
              {filteredFiles.map(file => (
                <div key={file.id} className="file-card">
                  <div className="file-icon">{file.type}</div>
                  <div className="file-info">
                    <h4>{file.title}</h4>
                    <p className="meta">By {file.uploader} • {file.date}</p>
                  </div>
                  <button className="download-btn">⬇</button>
                </div>
              ))}
            </div>
          ) : (
            // EMPTY STATE / AI REFERRAL
            <div className="empty-state">
              <p className="empty-icon">📂</p>
              <h3>No materials found for "{searchQuery || activeTab}"</h3>
              <p>Be the first to upload and help your classmates!</p>
              
              <div className="ai-referral">
                <p>Need help right now?</p>
                {/* FIX: Simplified button text */}
                <button className="ai-btn" onClick={() => alert("AI Feature Opening Soon!")}>
                   🤖 Ask AI
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* SIDEBAR */}
      <aside className="sidebar-right">
        {/* Profile Section */}
        <section className="section-a">
          {/* FIX: Avatar styling is handled in CSS to ensure visibility */}
          <div className="avatar-circle" style={{backgroundColor: shades[0]}}>
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <h3>{user.name}</h3>
          <p className="user-meta">Year {user.year} Student</p>
          
          {/* FIX: Layout fixed in CSS using flex-column and gap */}
          <div className="sidebar-controls">
            <button className="sidebar-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/*added this to fix the logout button visibility issue, also added a red color scheme to make it more distinct and recognizable as a critical action,handle all show no go*/}
         <button className="sidebar-btn signout-btn" onClick={handleLogout}>
  Sign Out
</button>

          
          </div>
        </section>

        {/* AI Placeholder */}
        <section className="section-b">
          <div className="ai-card">
             <p style={{ fontSize: '2rem' }}>🤖</p>
             <h4>AI Smart Hub</h4>
             <p>Coming Soon</p>
          </div>
        </section>

        {/* CONTACT / SUPPORT SECTION */}
        <section className="section-support">
           <h4>Need Help?</h4>
           <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Have a suggestion or facing an issue?</p>
           
           <div className="contact-links">
             <a href="https://wa.me/254745987455" target="_blank" rel="noreferrer" className="contact-btn whatsapp">
               WhatsApp Support
             </a>
             {/* FIX: Kept as mailto, logic relies on system mail app */}
             <a 
           href="mailto: otenyonashon@gmail.com" 
           className="contact-btn email"
   >
          Email Support
      </a>
           </div>
        </section>
      </aside>
    </div>
  );
}