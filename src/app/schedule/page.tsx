"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Schedule.module.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Image from "next/image";
import { Anton } from "next/font/google";

const anton = Anton({ weight: "400", subsets: ["latin"] });

interface WorkoutSession {
  id: string;
  dateStr: string; 
  title: string;
  subtitle: string;
  imageUrl: string;
}

const generateMonthDays = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({ 
      id: dateStr,
      dateNum: String(i).padStart(2, '0')
    });
  }
  return { 
    days, 
    monthName: d.toLocaleString('default', { month: 'long' }), 
    year 
  };
};

export default function SchedulePage() {
  const [calendar, setCalendar] = useState<{ days: any[], monthName: string, year: number } | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [selectedDay, setSelectedDay] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({ title: "", subtitle: "", imageUrl: "" });

  useEffect(() => {
    const cal = generateMonthDays();
    setCalendar(cal);
    setSessions([]);
  }, []);

  const handleCellClick = (day: any) => {
    setSelectedDay(day);
    setFormData({ title: "", subtitle: "", imageUrl: "" });
  };

  const handleSave = () => {
    if (!selectedDay || !formData.title.trim()) return;
    
    // Check if we are under the 5 limit
    const existingCount = sessions.filter(s => s.dateStr === selectedDay.id).length;
    if (existingCount >= 5) return;
    
    setSessions(prev => [
      ...prev, 
      {
        id: Math.random().toString(36).substr(2, 9), // unique session ID
        dateStr: selectedDay.id, 
        title: formData.title,
        subtitle: formData.subtitle,
        imageUrl: formData.imageUrl
      }
    ]);
    setFormData({ title: "", subtitle: "", imageUrl: "" });
  };

  const handleDelete = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  if (!calendar) return null;

  return (
    <SmoothScroll>
      <CustomCursor />
      
      <div className={styles.container}>
        
        {/* MASSIVE TITLE AREA */}
        <div className={styles.titleArea}>
          <h1 className={`${styles.massiveTitle} ${anton.className}`} style={{ display: 'flex', flexWrap: 'wrap' }}>
            {"CALENDAR".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: "100%", rotateX: -90, opacity: 0 }}
                animate={{ y: 0, rotateX: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.05, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                style={{ display: "inline-block", transformOrigin: "bottom center" }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
        </div>

        {/* MONTH HEADER */}
        <motion.div 
          className={styles.monthHeader}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h2 className={styles.monthTitle}>{calendar.monthName}</h2>
        </motion.div>

        {/* MASONRY/EDITORIAL GRID */}
        <div className={styles.grid}>
          {calendar.days.map((day, idx) => {
            const daySessions = sessions.filter(s => s.dateStr === day.id);
            
            return (
              <motion.div 
                key={day.id} 
                className={styles.dayCell} 
                onClick={() => handleCellClick(day)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.02 + 0.3, ease: "easeOut" }}
              >
                <div className={styles.dayHeader}>
                  {day.dateNum}
                  {daySessions.length > 0 && (
                    <div className={`${styles.square} ${styles.black}`} style={{ width: '8px', height: '8px', marginLeft: '10px' }}></div>
                  )}
                </div>
                
                {daySessions.map((session, sIdx) => (
                  <div key={session.id || `session-${sIdx}`} style={{ marginBottom: '15px' }}>
                    {session.imageUrl && (
                      <div className={styles.imageWrapper}>
                        <img 
                          src={session.imageUrl} 
                          alt={session.title} 
                          className={styles.dayImage} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div className={styles.dayContent}>
                      <strong>{session.title}</strong>
                      <span>{session.subtitle}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>

        {/* SIDE PANEL FOR CONFIGURATION */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div 
              className={styles.panelOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
            >
              <motion.div 
                className={styles.panel}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                style={{ overflowY: "auto" }}
              >
                <button className={styles.closeBtn} onClick={() => setSelectedDay(null)}>×</button>
                
                <h2 className={styles.panelTitle}>{calendar.monthName} {selectedDay.dateNum}</h2>
                
                {/* EXISTING WORKOUTS FOR THIS DAY */}
                {(() => {
                  const currentSessions = sessions.filter(s => s.dateStr === selectedDay.id);
                  if (currentSessions.length > 0) {
                    return (
                      <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '15px' }}>Scheduled ({currentSessions.length}/5)</h3>
                        {currentSessions.map((session, sIdx) => (
                          <div key={session.id || `panel-session-${sIdx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '10px' }}>
                            <div>
                              <strong>{session.title}</strong>
                              <div style={{ fontSize: '0.8rem', color: '#555' }}>{session.subtitle}</div>
                            </div>
                            <button 
                              onClick={() => handleDelete(session.id)}
                              style={{ background: 'transparent', border: '1px solid #111', padding: '5px 10px', fontSize: '0.7rem', cursor: 'pointer' }}
                            >
                              DELETE
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* ADD NEW WORKOUT FORM (IF UNDER 5) */}
                {sessions.filter(s => s.dateStr === selectedDay.id).length < 5 ? (
                  <>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Workout Title</label>
                      <input 
                        type="text" 
                        className={styles.input}
                        placeholder="e.g. Grand Opening" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Subtitle / Details</label>
                      <input 
                        type="text" 
                        className={styles.input}
                        placeholder="e.g. Imprints" 
                        value={formData.subtitle}
                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Cover Image URL (Optional)</label>
                      <input 
                        type="text" 
                        className={styles.input}
                        placeholder="e.g. https://images.unsplash.com/..." 
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      />
                    </div>

                    <button className={styles.saveBtn} onClick={handleSave}>
                      SAVE WORKOUT
                    </button>
                  </>
                ) : (
                  <div style={{ marginTop: 'auto', textAlign: 'center', padding: '20px', background: '#eee', fontSize: '0.8rem' }}>
                    MAXIMUM 5 WORKOUTS REACHED FOR THIS DAY.
                  </div>
                )}
                
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </SmoothScroll>
  );
}
