import React from 'react';
import eventIcon from '../../../assets/events-icon.png';

const AdviserCapsDefenses = () => {
  return (
    <div className="events-wrapper">
      {/* Header */}
      <h2 className="section-title">
        <img 
          src={eventIcon} 
          alt="Events Icon" 
          className="section-icon" 
        />
        Capstone Defenses
      </h2>
      <hr className="divider" />

      {/* Oral Defense */}
      <h3 className="defense-header">Oral Defense</h3>
      <div className="oral-defense-card">
        <div className="team-name">Mendoza, Et Al</div>

        <div className="defense-row">
          <div className="left-label">Title:</div>
          <div className="right-label">Panelists:</div>
        </div>
        <div className="defense-row">
          <div className="left-value">TaskSphere IT</div>
          <div className="right-value">Anderson F. Dashiell</div>
        </div>
        <div className="defense-row">
          <div className="left-label">Date:</div>
          <div className="right-value">Adam B. Apostol</div>
        </div>
        <div className="defense-row">
          <div className="left-value">March 31, 2025</div>
          <div className="right-value">Von Jacob P. Yu</div>
        </div>
        <div className="defense-row">
          <div className="left-label">Time:</div>
          <div className="right-label">Status:</div>
        </div>
        <div className="defense-row">
          <div className="left-value">1:00 PM - 3:00 PM</div>
          <div className="right-value">
            <span className="status-pending">Pending</span>
          </div>
        </div>
      </div>

      <style>{`
        .events-wrapper {
          width: 100%;
          padding: 40px 20px;
        }

        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #3B0304;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-icon {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .divider {
          border: none;
          border-top: 2px solid #3B0304;
          margin-bottom: 20px;
        }

        .defense-header {
          font-weight: bold;
          color: #3B0304;
          margin-bottom: 10px;
        }

        .oral-defense-card {
          background: #fff;
          border-radius: 10px;
          padding: 14px 16px;
          border: 1px solid #ccc;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          font-size: 13px;
        }

        .team-name {
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 8px;
          color: #3B0304;
          text-align: left;
        }

        .defense-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 2px 0;
        }

        .left-label,
        .right-label {
          font-weight: bold;
          color: #000;
        }

        .left-value,
        .right-value {
          color: #000;
        }

        .status-pending {
          display: inline-block;
          padding: 3px 10px;
          color: #3B0304;
          border: 2px solid #3B0304;
          border-radius: 4px;
          font-weight: bold;
          background-color: #fff;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default AdviserCapsDefenses;
