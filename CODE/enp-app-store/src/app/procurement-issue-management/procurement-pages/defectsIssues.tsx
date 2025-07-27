import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import './defectsIssues.css'

const Defects_Issues = () =>{

    const navigate = useNavigate();
    const issueStats = ['Total','Created','Submitted','Acknowledged','Work In Progress','Completed','Dropped'];
    return(
        <>
        <h2 className='page-title'>Defects/Issues</h2>
        <div className='page-container'>
            
            {/* <div className='status-container'>
                {issueStats.map((status) => (
                    <div key={status} className='status-card'>{status}</div>
                ))}
            </div> */}
            <table className='tbl-container'>
            {issueStats.map((status) => (
                    <tbody>
                        <tr>
                        <td className='col-container'>{status}</td>
                        <td> &nbsp;&nbsp;: 0</td>
                    </tr>
                    </tbody>
                ))}
            </table>
            <button className='add-button' onClick={() => navigate('/issue/new')}> 
             Register
            </button>
        </div>
        </>
        
    )
}

export default Defects_Issues;