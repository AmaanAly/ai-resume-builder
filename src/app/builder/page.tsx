'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import styles from './builder.module.css';

interface WorkExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  bullets: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  skills: string;
  photo?: string;
  experience: WorkExperience[];
  education: Education[];
  personalDetails: {
    fatherName: string;
    dob: string;
    gender: string;
    maritalStatus: string;
    nationality: string;
    languages: string;
  };
  customSections: CustomSection[];
  declaration: string;
  showSignature: boolean;
  signatureData: {
    date: string;
    place: string;
  };
}

const defaultData: ResumeData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
  summary: '',
  skills: '',
  experience: [
    { id: '1', company: '', role: '', duration: '', description: '', bullets: '' },
  ],
  education: [
    { id: '1', institution: '', degree: '', year: '' },
  ],
  personalDetails: {
    fatherName: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    languages: '',
  },
  customSections: [],
  declaration: 'I hereby declare that the information furnished above is true to the best of my knowledge.',
  showSignature: false,
  signatureData: {
    date: '',
    place: '',
  },
};

type LoadingKey = 'summary' | 'skills' | string;

export default function BuilderPage() {
  const [data, setData] = useState<ResumeData>(defaultData);
  const [loading, setLoading] = useState<Record<LoadingKey, boolean>>({});
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'additional' | 'design'>('personal');
  const [template, setTemplate] = useState<'classic' | 'professional' | 'minimalist' | 'creative' | 'executive' | 'academic'>('classic');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Chat Assistant State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Hi! I am your AI Assistant. How can I help you write your resume today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        update('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => update('photo', '');

  const update = (field: keyof ResumeData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateExp = (id: string, field: keyof WorkExperience, value: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const updateEdu = (id: string, field: keyof Education, value: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const updatePersonalDetail = (field: keyof ResumeData['personalDetails'], value: string) => {
    setData(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [field]: value }
    }));
  };

  const updateSignatureData = (field: keyof ResumeData['signatureData'], value: string) => {
    setData(prev => ({
      ...prev,
      signatureData: { ...prev.signatureData, [field]: value }
    }));
  };

  const addCustomSection = () => {
    setData(prev => ({
      ...prev,
      customSections: [...prev.customSections, { id: Date.now().toString(), title: '', content: '' }]
    }));
  };

  const updateCustomSection = (id: string, field: 'title' | 'content', value: string) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const removeCustomSection = (id: string) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.filter(s => s.id !== id)
    }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now().toString(), company: '', role: '', duration: '', description: '', bullets: '' }],
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now().toString(), institution: '', degree: '', year: '' }],
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  const setLoadingKey = (key: LoadingKey, val: boolean) => {
    setLoading(prev => ({ ...prev, [key]: val }));
  };

  const generate = async (section: string, context: string, onResult: (text: string) => void) => {
    setLoadingKey(section, true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, context }),
      });
      const json = await res.json();
      if (json.result) onResult(json.result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingKey(section, false);
    }
  };

  const generateSummary = () => {
    const ctx = `Name: ${data.name}. Experience: ${data.experience.map(e => `${e.role} at ${e.company}`).join(', ')}. Skills: ${data.skills}`;
    generate('summary', ctx, (text) => update('summary', text));
  };

  const generateBullets = (id: string) => {
    const exp = data.experience.find(e => e.id === id);
    if (!exp) return;
    const ctx = `Role: ${exp.role} at ${exp.company} (${exp.duration}). Description: ${exp.description}`;
    generate(`bullets_${id}`, ctx, (text) => updateExp(id, 'bullets', text));
  };

  const generateSkills = () => {
    const ctx = `Name: ${data.name}. Roles: ${data.experience.map(e => `${e.role} at ${e.company}`).join(', ')}. Education: ${data.education.map(e => `${e.degree} from ${e.institution}`).join(', ')}`;
    generate('skills', ctx, (text) => update('skills', text));
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      window.print();
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div className={styles.app}>
      {/* Sidebar / Input Panel */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.backBtn} id="back-home">
            ← Back
          </Link>
          <div className={styles.sidebarLogo}>
            <span className={styles.logoIcon}>◈</span>
            <span className="gradient-text">ResumeAI</span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {(['personal', 'experience', 'education', 'skills', 'additional', 'design'] as const).map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
              id={`tab-${tab}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.formPanel}>
          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div className={styles.formSection}>
              <div className="section-title">Personal Info</div>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label className="label" htmlFor="name">Full Name</label>
                  <input id="name" className="input" placeholder="Jane Doe" value={data.name} onChange={e => update('name', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className="label" htmlFor="email">Email</label>
                  <input id="email" type="email" className="input" placeholder="jane@example.com" value={data.email} onChange={e => update('email', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className="label" htmlFor="phone">Phone</label>
                  <input id="phone" className="input" placeholder="+1 (555) 000-0000" value={data.phone} onChange={e => update('phone', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className="label" htmlFor="location">Location</label>
                  <input id="location" className="input" placeholder="New York, NY" value={data.location} onChange={e => update('location', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className="label" htmlFor="linkedin">LinkedIn URL</label>
                  <input id="linkedin" className="input" placeholder="linkedin.com/in/janedoe" value={data.linkedin} onChange={e => update('linkedin', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className="label" htmlFor="website">Website / Portfolio</label>
                  <input id="website" className="input" placeholder="janedoe.dev" value={data.website} onChange={e => update('website', e.target.value)} />
                </div>
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label className="label">Photo (Optional)</label>
                  <div className={styles.photoUploadRow}>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="input" style={{ flex: 1, padding: 8 }} />
                    {data.photo && <button className="btn btn-secondary" onClick={removePhoto} style={{ padding: '8px 16px' }}>Remove</button>}
                  </div>
                </div>
              </div>

              <div className="divider" />
              <div className="section-title">Professional Summary</div>
              <div className={styles.field}>
                <label className="label" htmlFor="summary">Summary</label>
                <textarea id="summary" className="input" rows={4} placeholder="A brief overview of your career..." value={data.summary} onChange={e => update('summary', e.target.value)} />
              </div>
              <button id="gen-summary" className={`btn btn-primary ${styles.aiBtn}`} onClick={generateSummary} disabled={loading['summary']}>
                {loading['summary'] ? <><span className="spinner" /> Generating...</> : <><span>✦</span> Generate with AI</>}
              </button>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className={styles.formSection}>
              <div className="section-title">Work Experience</div>
              {data.experience.map((exp, idx) => (
                <div key={exp.id} className={styles.expCard}>
                  <div className={styles.expCardHeader}>
                    <span className={styles.expCardLabel}>Position {idx + 1}</span>
                    {data.experience.length > 1 && (
                      <button className={styles.removeBtn} onClick={() => removeExperience(exp.id)} id={`remove-exp-${exp.id}`}>✕</button>
                    )}
                  </div>
                  <div className={styles.fieldGrid}>
                    <div className={styles.field}>
                      <label className="label">Company</label>
                      <input className="input" placeholder="Google" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label className="label">Job Title</label>
                      <input className="input" placeholder="Senior Engineer" value={exp.role} onChange={e => updateExp(exp.id, 'role', e.target.value)} />
                    </div>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label className="label">Duration</label>
                      <input className="input" placeholder="Jan 2022 – Present" value={exp.duration} onChange={e => updateExp(exp.id, 'duration', e.target.value)} />
                    </div>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label className="label">What did you do? (for AI)</label>
                      <textarea className="input" rows={3} placeholder="Describe your role, achievements, and responsibilities..." value={exp.description} onChange={e => updateExp(exp.id, 'description', e.target.value)} />
                    </div>
                  </div>
                  <button className={`btn btn-primary ${styles.aiBtn}`} onClick={() => generateBullets(exp.id)} disabled={loading[`bullets_${exp.id}`]} id={`gen-bullets-${exp.id}`}>
                    {loading[`bullets_${exp.id}`] ? <><span className="spinner" /> Generating...</> : <><span>✦</span> Generate Bullet Points</>}
                  </button>
                  {exp.bullets && (
                    <div className={styles.field} style={{ marginTop: 12 }}>
                      <label className="label">Generated Bullets (editable)</label>
                      <textarea className="input" rows={5} value={exp.bullets} onChange={e => updateExp(exp.id, 'bullets', e.target.value)} />
                    </div>
                  )}
                </div>
              ))}
              <button className={`btn btn-secondary ${styles.addBtn}`} onClick={addExperience} id="add-experience">
                + Add Another Position
              </button>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className={styles.formSection}>
              <div className="section-title">Education</div>
              {data.education.map((edu, idx) => (
                <div key={edu.id} className={styles.expCard}>
                  <div className={styles.expCardHeader}>
                    <span className={styles.expCardLabel}>School {idx + 1}</span>
                    {data.education.length > 1 && (
                      <button className={styles.removeBtn} onClick={() => removeEducation(edu.id)} id={`remove-edu-${edu.id}`}>✕</button>
                    )}
                  </div>
                  <div className={styles.fieldGrid}>
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label className="label">Institution</label>
                      <input className="input" placeholder="MIT" value={edu.institution} onChange={e => updateEdu(edu.id, 'institution', e.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label className="label">Degree</label>
                      <input className="input" placeholder="B.S. Computer Science" value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label className="label">Year</label>
                      <input className="input" placeholder="2018 – 2022" value={edu.year} onChange={e => updateEdu(edu.id, 'year', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button className={`btn btn-secondary ${styles.addBtn}`} onClick={addEducation} id="add-education">
                + Add Another School
              </button>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className={styles.formSection}>
              <div className="section-title">Skills</div>
              <div className={styles.field}>
                <label className="label" htmlFor="skills-input">Skills (comma-separated)</label>
                <textarea id="skills-input" className="input" rows={5} placeholder="React, TypeScript, Node.js, Python, AWS..." value={data.skills} onChange={e => update('skills', e.target.value)} />
              </div>
              <button id="gen-skills" className={`btn btn-primary ${styles.aiBtn}`} onClick={generateSkills} disabled={loading['skills']}>
                {loading['skills'] ? <><span className="spinner" /> Generating...</> : <><span>✦</span> Suggest Skills with AI</>}
              </button>
            </div>
          )}

          {/* Additional Tab */}
          {activeTab === 'additional' && (
            <div className={styles.formSection}>
              <div className="section-title">Personal Details</div>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label className="label">Father's Name</label>
                  <input className="input" value={data.personalDetails.fatherName} onChange={e => updatePersonalDetail('fatherName', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className="label">Date of Birth</label>
                  <input className="input" placeholder="01 Jan 1990" value={data.personalDetails.dob} onChange={e => updatePersonalDetail('dob', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className="label">Gender</label>
                  <input className="input" placeholder="Male / Female" value={data.personalDetails.gender} onChange={e => updatePersonalDetail('gender', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className="label">Marital Status</label>
                  <input className="input" placeholder="Single / Married" value={data.personalDetails.maritalStatus} onChange={e => updatePersonalDetail('maritalStatus', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className="label">Nationality</label>
                  <input className="input" value={data.personalDetails.nationality} onChange={e => updatePersonalDetail('nationality', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className="label">Languages</label>
                  <input className="input" placeholder="English, Hindi" value={data.personalDetails.languages} onChange={e => updatePersonalDetail('languages', e.target.value)} />
                </div>
              </div>

              <div className="divider" />
              <div className="section-title">Custom Sections (Optional)</div>
              {data.customSections.map((s) => (
                <div key={s.id} className={styles.expCard}>
                  <div className={styles.expCardHeader}>
                    <input 
                      className="input" 
                      style={{ fontWeight: 'bold', background: 'transparent', border: 'none', padding: 0 }} 
                      placeholder="Section Title (e.g. Awards)" 
                      value={s.title} 
                      onChange={e => updateCustomSection(s.id, 'title', e.target.value)} 
                    />
                    <button className={styles.removeBtn} onClick={() => removeCustomSection(s.id)}>✕</button>
                  </div>
                  <textarea className="input" rows={3} placeholder="Content..." value={s.content} onChange={e => updateCustomSection(s.id, 'content', e.target.value)} />
                </div>
              ))}
              <button className={`btn btn-secondary ${styles.addBtn}`} onClick={addCustomSection}>
                + Add Custom Section
              </button>

              <div className="divider" />
              <div className="section-title">Declaration & Signature</div>
              <div className={styles.field}>
                <label className="label">Declaration Text</label>
                <textarea className="input" rows={3} value={data.declaration} onChange={e => update('declaration', e.target.value)} />
              </div>
              
              <div className={styles.field} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <input type="checkbox" id="show-sig" checked={data.showSignature} onChange={e => setData(prev => ({ ...prev, showSignature: e.target.checked }))} />
                <label htmlFor="show-sig" style={{ cursor: 'pointer' }}>Show Signature Block</label>
              </div>

              {data.showSignature && (
                <div className={styles.fieldGrid} style={{ marginTop: 10 }}>
                  <div className={styles.field}>
                    <label className="label">Place</label>
                    <input className="input" value={data.signatureData.place} onChange={e => updateSignatureData('place', e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label className="label">Date</label>
                    <input className="input" value={data.signatureData.date} onChange={e => updateSignatureData('date', e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Design Tab */}
          {activeTab === 'design' && (
            <div className={styles.formSection}>
              <div className="section-title">Choose Template</div>
              <div className={styles.templateGrid}>
                {['classic', 'professional', 'minimalist', 'creative', 'executive', 'academic'].map(t => (
                  <button
                    key={t}
                    className={`${styles.templateBtn} ${template === t ? styles.templateBtnActive : ''}`}
                    onClick={() => setTemplate(t as any)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebarFooter}>
          <button className={`btn btn-primary ${styles.downloadBtn}`} onClick={downloadPDF} disabled={isDownloading} id="download-pdf">
            {isDownloading ? <><span className="spinner" /> Preparing...</> : <>↓ Download PDF</>}
          </button>
        </div>
      </aside>

      {/* Resume Preview */}
      <main className={styles.previewWrapper}>
        <div className={styles.previewHeader}>
          <span className="badge badge-emerald">● Live Preview</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Updates as you type</span>
        </div>
        <div className={styles.previewOuter}>
          <div className={`${styles.resumePreview} ${styles[`template${template.charAt(0).toUpperCase() + template.slice(1)}`]}`} ref={previewRef} id="resume-preview">
            {/* Header */}
            <div className={`${styles.resumeHeader} ${data.photo ? styles.resumeHeaderWithPhoto : ''}`}>
              {data.photo && (
                <div className={styles.resumePhotoWrapper}>
                  <img src={data.photo} alt="Profile" className={styles.resumePhoto} />
                </div>
              )}
              <div className={styles.resumeHeaderContent}>
                <h1 className={styles.resumeName}>{data.name || 'Your Name'}</h1>
                <div className={styles.resumeContact}>
                  {data.email && <span>{data.email}</span>}
                  {data.phone && <><span>·</span><span>{data.phone}</span></>}
                  {data.location && <><span>·</span><span>{data.location}</span></>}
                  {data.linkedin && <><span>·</span><span>{data.linkedin}</span></>}
                  {data.website && <><span>·</span><span>{data.website}</span></>}
                </div>
              </div>
            </div>

            {/* Summary */}
            {data.summary && (
              <div className={styles.resumeSection}>
                <h2 className={styles.resumeSectionTitle}>Professional Summary</h2>
                <div className={styles.resumeSectionLine} />
                <p className={styles.resumeSummary}>{data.summary}</p>
              </div>
            )}

            {/* Experience */}
            {data.experience.some(e => e.company || e.role) && (
              <div className={styles.resumeSection}>
                <h2 className={styles.resumeSectionTitle}>Work Experience</h2>
                <div className={styles.resumeSectionLine} />
                {data.experience.map(exp => (
                  (exp.company || exp.role) ? (
                    <div key={exp.id} className={styles.resumeEntry}>
                      <div className={styles.resumeEntryHeader}>
                        <div>
                          <strong className={styles.resumeRole}>{exp.role || 'Role'}</strong>
                          {exp.company && <span className={styles.resumeCompany}> · {exp.company}</span>}
                        </div>
                        {exp.duration && <span className={styles.resumeDuration}>{exp.duration}</span>}
                      </div>
                      {exp.bullets ? (
                        <ul className={styles.resumeBullets}>
                          {exp.bullets.split('\n').filter(b => b.trim()).map((b, i) => (
                            <li key={i}>{b.replace(/^[•\-]\s*/, '')}</li>
                          ))}
                        </ul>
                      ) : exp.description ? (
                        <p className={styles.resumeDesc}>{exp.description}</p>
                      ) : null}
                    </div>
                  ) : null
                ))}
              </div>
            )}

            {/* Education */}
            {data.education.some(e => e.institution || e.degree) && (
              <div className={styles.resumeSection}>
                <h2 className={styles.resumeSectionTitle}>Education</h2>
                <div className={styles.resumeSectionLine} />
                {data.education.map(edu => (
                  (edu.institution || edu.degree) ? (
                    <div key={edu.id} className={styles.resumeEntry}>
                      <div className={styles.resumeEntryHeader}>
                        <div>
                          <strong className={styles.resumeRole}>{edu.degree || 'Degree'}</strong>
                          {edu.institution && <span className={styles.resumeCompany}> · {edu.institution}</span>}
                        </div>
                        {edu.year && <span className={styles.resumeDuration}>{edu.year}</span>}
                      </div>
                    </div>
                  ) : null
                ))}
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className={styles.resumeSection}>
                <h2 className={styles.resumeSectionTitle}>Skills</h2>
                <div className={styles.resumeSectionLine} />
                <div className={styles.resumeSkills}>
                  {skills.map((skill, i) => (
                    <span key={i} className={styles.resumeSkillTag}>{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Sections */}
            {data.customSections.map(s => (s.title || s.content) && (
              <div key={s.id} className={styles.resumeSection}>
                <h2 className={styles.resumeSectionTitle}>{s.title || 'Untitled Section'}</h2>
                <div className={styles.resumeSectionLine} />
                <div className={styles.resumeDesc} style={{ whiteSpace: 'pre-wrap' }}>{s.content}</div>
              </div>
            ))}

            {/* Personal Details (Table) */}
            {Object.values(data.personalDetails).some(v => v) && (
              <div className={styles.resumeSection}>
                <h2 className={styles.resumeSectionTitle}>Personal Details</h2>
                <div className={styles.resumeSectionLine} />
                <table className={styles.personalInfoTable}>
                  <tbody>
                    {data.personalDetails.fatherName && <tr><td><strong>Father's Name</strong></td><td>: {data.personalDetails.fatherName}</td></tr>}
                    {data.personalDetails.dob && <tr><td><strong>Date of Birth</strong></td><td>: {data.personalDetails.dob}</td></tr>}
                    {data.personalDetails.gender && <tr><td><strong>Gender</strong></td><td>: {data.personalDetails.gender}</td></tr>}
                    {data.personalDetails.maritalStatus && <tr><td><strong>Marital Status</strong></td><td>: {data.personalDetails.maritalStatus}</td></tr>}
                    {data.personalDetails.nationality && <tr><td><strong>Nationality</strong></td><td>: {data.personalDetails.nationality}</td></tr>}
                    {data.personalDetails.languages && <tr><td><strong>Languages Known</strong></td><td>: {data.personalDetails.languages}</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {/* Declaration */}
            {data.declaration && (
              <div className={styles.resumeSection} style={{ marginTop: 25 }}>
                <h2 className={styles.resumeSectionTitle}>Declaration</h2>
                <div className={styles.resumeSectionLine} />
                <p className={styles.resumeDesc}>{data.declaration}</p>
              </div>
            )}

            {/* Signature Block */}
            {data.showSignature && (
              <div className={styles.signatureBlock}>
                <div className={styles.sigLeft}>
                  <p><strong>Place:</strong> {data.signatureData.place}</p>
                  <p><strong>Date:</strong> {data.signatureData.date}</p>
                </div>
                <div className={styles.sigRight}>
                  <div className={styles.sigLine} />
                  <p><strong>{data.name || 'Your Name'}</strong></p>
                  <p>(Signature)</p>
                </div>
              </div>
            )}

            {/* Placeholder when empty */}
            {!data.name && !data.summary && !data.experience.some(e => e.company) && (
              <div className={styles.emptyPlaceholder}>
                <div className={styles.emptyIcon}>📄</div>
                <p>Start filling in your details on the left to see your live resume preview here.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Chat Assistant */}
      <div className={styles.chatWrapper}>
        {!chatOpen ? (
          <button className={styles.chatToggleBtn} onClick={() => setChatOpen(true)}>
            🤖 AI
          </button>
        ) : (
          <div className={styles.chatWindow}>
            <div className={styles.chatHeader}>
              <span>🤖 Resume AI</span>
              <button onClick={() => setChatOpen(false)}>✕</button>
            </div>
            <div className={styles.chatBody}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={`${styles.chatMsgRow} ${msg.role === 'user' ? styles.chatMsgRowUser : styles.chatMsgRowAi}`}>
                  <div className={styles.chatBubble}>
                    {msg.content}
                    {msg.role === 'ai' && (
                      <button className={styles.copyBtn} onClick={() => navigator.clipboard.writeText(msg.content)} title="Copy Content">
                        📋
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && <div className={`${styles.chatMsgRow} ${styles.chatMsgRowAi}`}><div className={styles.chatBubble}><span className="spinner" style={{width:14, height:14, borderColor:'#888', borderTopColor:'#fff'}} /></div></div>}
            </div>
            <div className={styles.chatInputRow}>
              <input
                className="input"
                placeholder="Ask me to write a summary in Hinglish..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
                    setChatInput('');
                    setChatLoading(true);
                    
                    fetch('/api/chat', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ message: chatInput, context: data })
                    }).then(r => r.json()).then(json => {
                      setChatMessages(prev => [...prev, { role: 'ai', content: json.reply || 'Sorry, error occurred.' }]);
                      setChatLoading(false);
                    });
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
