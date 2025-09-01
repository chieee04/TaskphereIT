import React from 'react'
import taskIcon from "../../assets/tasks-allocation.png";         
const MemberAllocation = () => {
  return (
    <div className="page-wrapper">
      <h2 className="section-title">
        <img src={taskIcon} alt="Tasks Icon" className="icon-image" />
        Tasks Allocation
      </h2>
      <hr className="divider" />

      <div className="allocation-container">
        <table className="allocation-table">
          <thead>
            <tr>
              <th className="center-text">NO</th>
              <th className="center-text">Name</th>
              <th className="center-text">Role</th>
              <th className="center-text">Assigned Tasks</th>
              <th className="center-text">Completed Tasks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="center-text">1.</td>
              <td className="center-text">Addiralene G Mendoza</td>
              <td className="role center-text">Project Manager</td>
              <td className="center-text">5</td>
              <td className="center-text">3</td>
            </tr>
            <tr>
              <td className="center-text">2.</td>
              <td className="center-text">Harzwel Zhen B Lacson</td>
              <td className="role center-text">Programmer</td>
              <td className="center-text">3</td>
              <td className="center-text">2</td>
            </tr>
            <tr>
              <td className="center-text">3.</td>
              <td className="center-text">Julliana N Castaneda</td>
              <td className="role center-text">Member</td>
              <td className="center-text">2</td>
              <td className="center-text">0</td>
            </tr>
            <tr>
              <td className="center-text">4.</td>
              <td className="center-text">Alejandro C Faustino</td>
              <td className="role center-text">Member</td>
              <td className="center-text">4</td>
              <td className="center-text">2</td>
            </tr>
            <tr>
              <td className="center-text">5.</td>
              <td className="center-text">Justine I Pare</td>
              <td className="role center-text">Member</td>
              <td className="center-text">5</td>
              <td className="center-text">1</td>
            </tr>
            <tr>
              <td className="center-text">6.</td>
              <td className="center-text">John Reagan S Pinpin</td>
              <td className="role center-text">Member</td>
              <td className="center-text">3</td>
              <td className="center-text">2</td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        .page-wrapper {
          width: 100%;
          padding: 40px 20px;
        }
        .section-title {
          font-size: 20px;
          font-weight: bold;
          color: #3B0304;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .icon-image {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
        .divider {
          border: none;
          border-top: 2px solid #3B0304;
          margin: 0 0 20px 0;
        }
        .allocation-container {
          background: #fff;
          border-radius: 20px;
          padding: 0;
          width: 100%;
          overflow-x: auto;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border: 1px solid #B2B2B2;
        }
        .allocation-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .allocation-table th {
          background-color: #fafafa;
          font-weight: bold;
          color: #000;
          text-align: center;
          padding: 12px 10px;
        }
        .allocation-table td {
          color: #000;
          padding: 12px 10px;
          text-align: center;
        }
        .allocation-table tbody tr:nth-child(even) {
          background-color: #fafafa;
        }
        .allocation-table td.role {
          color: #3B0304;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MemberAllocation;
