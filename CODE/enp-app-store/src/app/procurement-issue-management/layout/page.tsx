import React, {useState, useEffect, useRef} from 'react';
import {Outlet} from 'react-router-dom';
import './layout.css';
import { getListViews } from '../../../services/procurement-issue-management/issueService'

interface ListItem {
    UP_ID: number;
    UP_PAGE_NAME: string;
    UP_PAGE_ALIAS: string;
}

const Layout: React.FC = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [listViews, setListViews] = useState<ListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFetched = useRef(false);
    
    useEffect(() => {
        const fetchListViews = async () => {
            if(isFetched.current) return;
            isFetched.current = true;
            try{
                const response = await getListViews();
                setListViews(response);
            }catch(error){
                console.log(`Error fetching list views`, error);
                // Set default views if service fails
                setListViews([
                    { UP_ID: 1, UP_PAGE_NAME: 'dashboard_resolver', UP_PAGE_ALIAS: 'Dashboard' },
                    { UP_ID: 2, UP_PAGE_NAME: 'log-issue', UP_PAGE_ALIAS: 'Log Issue' },
                    { UP_ID: 3, UP_PAGE_NAME: 'resolve-issue', UP_PAGE_ALIAS: 'Resolve Issue' }
                ]);
            }finally{
                setIsLoading(false);
            }
        };
        fetchListViews();
    },[]);

    return(
        <>
            <div className='layout-container'>
                <header className='header'>
                    <button className='hamburger' onClick={() => setIsNavbarOpen(!isNavbarOpen)}>
                        &#9776;&nbsp;&nbsp;&nbsp;<span className='app-name'>Issue Tracker</span>
                    </button>
                    
                <div className='header-right'>User Profile</div>
                </header>
                
            </div>

            <nav className={`sidebar ${isNavbarOpen ? 'open' : 'closed'}`}>
                <ul>
                    {!isLoading && listViews.map((item) => (
                        <li key={item.UP_ID}>
                            <a className='anchor' href={`/procurement-issue-management/${item.UP_PAGE_NAME}`}>
                                {item.UP_PAGE_ALIAS}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className='main-content'>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-xl">Loading...</div>
                    </div>
                ) : (
                    <Outlet />
                )}
                {/* <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route index element={<Dashboard/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/Defects_Issues" element={<Defects_Issues/>}/>
                    </Routes>
                </Suspense> */}
            </main>
        </>
    )
};

export default Layout;