import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// --- 1. FIREBASE IMPORTS ---
import { db } from '../firebase'; 
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';

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
  const [isUploading, setIsUploading] = useState(false);
  
  // 3. Real Database State
  const [allFiles, setAllFiles] = useState([]);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const shades = ["#3949ab", "#3f51b5", "#5c6bc0", "#7986cb"];

  // --- REAL-TIME DATA FETCHING ---
  useEffect(() => {
    const q = query(
      collection(db, "materials"),
      where("school", "==", user.schoolName),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const filesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllFiles(filesData);
      },
      (error) => {
        console.error("Firestore Error:", error.message);
      }
    );

    return () => unsubscribe();
  }, [user.schoolName]);


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

  // --- NEW DELETE FUNCTION ---
  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      // Deletes the record from Firestore
      // Note: This does not delete the actual file from Cloudinary (requires backend code),
      // but removes the link from the app so no one can see it.
      await deleteDoc(doc(db, "materials", fileId));
      alert("Material deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Failed to delete material.");
    }
  };

  const handleUpload = async () => {
    if (!fileTitle || !selectedFile) return alert("Please add a title and a file!");
    setIsUploading(true);

    const CLOUD_NAME = "depq9kljq"; 
    const UPLOAD_PRESET = "StudyMaterials"; 

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      // 1. UPLOAD TO CLOUDINARY
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Cloudinary upload failed");

      const data = await response.json();
      
      const fileUrl = data.secure_url.replace('/image/upload/', '/raw/upload/'); 

      // 2. SAVE TO FIREBASE
      await addDoc(collection(db, "materials"), {
        title: fileTitle,
        fileURL: fileUrl, 
        course: activeTab,
        school: user?.schoolName || "Unknown School",
        uploader: user?.name || "Anonymous",
        createdAt: new Date(),
        date: new Date().toLocaleDateString(),
        type: selectedFile.name.split('.').pop().toUpperCase()
      });

      setFileTitle("");
      setSelectedFile(null);
      alert("Upload Successful!");

    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredFiles = allFiles.filter(file => 
    file.course === activeTab &&
    file.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`dashboard-grid ${darkMode ? 'dark-theme' : ''}`}>
      <main className="vault-content">
        
        <header className="community-header">
          <h1 style={{ color: 'var(--text-main)' }}>{user.schoolName} Vault</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome, {user.name} </p>
        </header>

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
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

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
                  
                  {/* --- UPDATED FILE ACTIONS SECTION --- */}
                  <div className="file-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <a href={file.fileURL} target="_blank" rel="noreferrer" className="download-btn" style={{textDecoration:'none', display:'flex', alignItems:'center', justifyContent:'center'}}>
                      ⬇
                    </a>

                    {/* Show delete button only if current user matches uploader */}
                    {user.name === file.uploader && (
                      <button 
                        onClick={() => handleDelete(file.id)} 
                        className="delete-btn"
                        title="Delete Material"
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#ff4d4d', 
                          cursor: 'pointer', 
                          fontSize: '1.2rem',
                          padding: '0 5px'
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  {/* --- END UPDATED SECTION --- */}

                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">📂</p>
              <h3>No materials found for "{searchQuery || activeTab}"</h3>
              <p>Be the first to upload and help your classmates!</p>
              
              <div className="ai-referral">
                <p>Need help right now?</p>
                <button className="ai-btn" onClick={() => alert("AI Feature Opening Soon!")}>
                   🤖 Ask AI
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <aside className="sidebar-right">
        <section className="section-a">
          <div className="avatar-circle" style={{backgroundColor: shades[0]}}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h3>{user.name}</h3>
          <p className="user-meta">Year {user.year} Student</p>
          
          <div className="sidebar-controls">
            <button className="sidebar-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button className="sidebar-btn signout-btn" onClick={handleLogout} style={{color:'red', borderColor:'red'}}>
              Sign Out
            </button>
          </div>
        </section>

        <section className="section-b">
          <div className="ai-card">
             <p style={{ fontSize: '2rem' }}>🤖</p>
             <h4>AI Smart Hub</h4>
             <p>Coming Soon</p>
          </div>
        </section>

        <section className="section-support">
           <h4>Need Help?</h4>
           <div className="contact-links">
             <a href="https://wa.me/254745987455" target="_blank" rel="noreferrer" className="contact-btn whatsapp">
               WhatsApp Support
             </a>
             <a href="mailto:otenyonashon@gmail.com" className="contact-btn email">
               Email Support
             </a>
           </div>
        </section>
      </aside>
    </div>
  );
}