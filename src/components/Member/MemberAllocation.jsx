import React from "react";
import taskIcon from "../../assets/tasks-allocation.png";         
import "../Style/Member/MemberAllocation.css"; // hiwalay na CSS file

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
    </div>
  );
};

export default MemberAllocation;
