import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getListViews } from '../../../services/procurement-issue-management/issueService';
import './dashboard.css';


interface ListView {
    UP_ID: number;
    UP_PAGE_NAME: string;
    UP_PAGE_ALIAS: string;
}

const Dashboard: React.FC = () =>{
    const [listViews, setListViews] = useState<ListView[]>([]);
    const isFetched = useRef(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() =>{
        const fetchListViews = async () => {
            if(isFetched.current) return;
            isFetched.current = true;
            try{
                const response = await getListViews();
                console.log(response)
                // const data: ListItem[] = await response.json();
                setListViews(response);
            }catch(error){
                console.log(`Error fetching list views`, error);
            }finally{
                setLoading(false);
            }
        }
        fetchListViews();
    },[])
    return(
        <div className="dashboard">
            <h1 className="dashboard-title">Dashboard</h1>
            {loading ? (
                <div className="loader">Loading...</div>
            ) : 
            
            (<div className="tile-container">
                {listViews.map((view) => (
                    <Link to={`/procurement-issue-management/${view.UP_PAGE_NAME}`} key={view.UP_ID} className="tile">
                        {view.UP_PAGE_ALIAS}
                    </Link>)
                )}
            </div>)}
            
            
        </div>
    )
}

export default Dashboard;