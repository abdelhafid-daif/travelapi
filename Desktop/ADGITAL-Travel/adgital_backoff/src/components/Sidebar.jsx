import React, { useState ,useEffect} from 'react';
import { FaTh, FaBars, FaUserAlt, FaRegChartBar, FaCommentAlt, FaShoppingBag, FaThList } from "react-icons/fa";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import CategoryIcon from '@mui/icons-material/Category';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import DescriptionIcon from '@mui/icons-material/Description'; 
import ArchiveIcon from '@mui/icons-material/Archive';
import { NavLink } from 'react-router-dom';
import '../style/Sidebar.css';
import Navbar from './Navbar';
import { getUser } from '../api/users';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/joy/Button';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import StyleIcon from '@mui/icons-material/Style';
import NewLabelIcon from '@mui/icons-material/NewLabel';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import HotelIcon from '@mui/icons-material/Hotel';
import InterestsIcon from '@mui/icons-material/Interests';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BalconyIcon from '@mui/icons-material/Balcony';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import PaymentIcon from '@mui/icons-material/Payment';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardSharpIcon from '@mui/icons-material/DashboardSharp';
import AppsSharpIcon from '@mui/icons-material/AppsSharp';
import AddLocationAltSharpIcon from '@mui/icons-material/AddLocationAltSharp';
const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const toggle = () => setIsOpen(!isOpen);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await getUser();
                setUserProfile(userData.profile);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserProfile();
    }, []);
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
      };
    const menuItem = [
        ...(userProfile?.is_support
            ? [
                  { path: "/cat-crud", name: "Offre-Categorie", icon: <AppsSharpIcon sx={{fontSize:18}} /> },
                  { path: "/dest-crud", name: "Destinations", icon: <AddLocationAltSharpIcon sx={{fontSize:18}} /> },
                  { path: "/of-crud", name: "Offres", icon: <LocalOfferIcon sx={{fontSize:18}} /> },
                  { path: "/of-depdet-crud", name: "Offres Détaillées", icon: <NewLabelIcon sx={{fontSize:18}} /> },
                  { path: "/booking-dt", name: "Réservations", icon: <StyleIcon sx={{fontSize:18}} /> },
              ]
            : []),

        // Commercial Menu
        ...(userProfile?.is_commercial
            ? [
                  { path: "/commercial", name: "Tableau de bord ", icon: <DashboardSharpIcon sx={{fontSize:18}} /> },
                  { path: "/part-lt", name: "Partenaires", icon: <Diversity2Icon sx={{fontSize:18}} /> },
                  { path: "/hot-crud", name: "Hotels", icon: <HotelIcon sx={{fontSize:18}} /> },
                  { path: "/hot-img", name: "Hotels-img", icon: <PhotoCameraIcon sx={{fontSize:18}} /> },
                  { path: "/hot-chambre", name: "Hotels-Chambre", icon: <BalconyIcon sx={{fontSize:18}} /> },
                  { path: "/hot-reservations", name: "Hotels-resvations", icon: <LocalOfferIcon sx={{fontSize:18}} /> },
              ]
            : []),

        // Manager Menu (if applicable)
        ...(userProfile?.is_comptable
            ? [
                  { path: "/comptable", name: "Dashboard", icon: <DashboardSharpIcon sx={{fontSize:18}}/> },
                  { path: "/book_conf", name: "Booking", icon: <LocalOfferIcon sx={{fontSize:18}}/> },
                  { path: "/book_fact", name: "Factures", icon: <DescriptionIcon sx={{fontSize:18}} /> },
                  { path: "/ar_fact", name: "Archive", icon: <ArchiveIcon sx={{fontSize:18}} /> },
              ]
            : []),

        ...(userProfile?.is_manager
            ? [
                    { path: "/manager", name: "Dashboard", icon: <DashboardSharpIcon sx={{fontSize:18}} /> },
                    { path: "/bock-stats", name: "Réservations", icon: <StyleIcon sx={{fontSize:18}} /> },
                    { path: "/part-stats", name: "Partenaires", icon: <Diversity3Icon sx={{fontSize:18}} /> },
                    { path: "/fact-stats", name: "Factures", icon: <PaymentIcon sx={{fontSize:18}} /> },
                    { path: "/staff-stats", name: "Staff", icon: <Diversity1Icon sx={{fontSize:18}} /> },
                    
                ]
            : []),

    ];


    return (
        <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
        <div style={{ width: isOpen ? "200px" : "70px", transition: 'width 0.3s ease' ,height: '100%', padding:"10px"}} className="sidebar">
            <div style={{ direction:'row'}}>
            <div className="top_section" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' ,backgroundColor:'#f8fafc'}}>
                <img 
                    src="/logo3.svg" 
                    alt="Logo"
                    style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: '0px 2px 6px #fff'
                    }}
                />
                
                <div className="top_section" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0px' }}>
                    <div style={{ marginLeft: isOpen ? "60px" : "0px" }} className="bars">
                        {isOpen ? (

                          <Button sx={{paddingRight:3}} variant='plain' endDecorator={<AiFillCaretLeft style={{fontSize: "20px", marginRight:"15px",marginLeft:"8px"}}  />} style={{fontSize: "14px",  margin: 0 ,fontWeight: "bold",color:"#4527a0" , backgroundColor:"transparent"}} className="logo" onClick={toggle}>
                            ADGITAL
                          </Button>

                        ) : (
                          
                            <MenuIcon onClick={toggle} style={{color:'#4527a0'}}/>
                        )}
                    </div>
                </div>
            </div>
              
            </div>
            

                {menuItem.map((item, index) => (
                   <NavLink
                   to={item.path}
                   key={index}
                   style={{ marginTop: '24px' }}
                   className={({ isActive }) =>
                     isOpen ? `link${isActive ? ' active' : ''}` : 'link'
                   }
                 >
                   {({ isActive }) => (
                     <>
                       <div
                         className="icon"
                         style={
                           !isOpen
                             ? {
                                 border: '0px solid',
                                 borderColor: isActive ? '#4527a0' : '#ccc', 
                                 borderRadius: '50%',
                                 padding: '6px',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                                 backgroundColor: isActive ? '#2196f3' : 'none',
                                 color:isActive ?'#fff':'#003a7b',
                               }
                             : {}
                         }
                       >
                         {item.icon}
                       </div>
                       {isOpen && <div className="link_text">{item.name}</div>}
                     </>
                   )}
                 </NavLink>
                ))}
                <div
                style={{
                    position: "absolute",
                    bottom: 30,
                    left: 0,
                    width: isOpen ? "200px" : "56px",
                    paddingLeft: isOpen ? "16px" : "8px",
                    paddingRight: isOpen ? "16px" : "8px",
                    transition: "all 0.3s ease-in-out",
                }}
                >
                <Button
                    onClick={handleLogout}
                    startIcon={
                    <LogoutIcon sx={{ color: "#f44336", transition: "color 0.3s ease" }} />
                    }
                    sx={{
                    justifyContent: isOpen ? "flex-start" : "center",
                    width: "100%",
                    color: "#f44336",
                    backgroundColor: "transparent",
                    minWidth: 0,
                    padding: isOpen ? "8px 12px" : "8px",
                    borderRadius: 2,
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                        backgroundColor: "#f4433611", // léger rouge en survol
                    },
                    fontWeight: "bold",
                    }}
                >
                    {isOpen && "Déconnexion"}
                </Button>
                </div>
                
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Navbar (indépendante du main) */}
                <div style={{ flexShrink: 0 }}>
                    <Navbar />
                </div>

                {/* Contenu principal */}
                <div style={{  overflowY: 'auto' , flexGrow: 1, padding: '15px',margin:10,backgroundColor:"#eef2f6" ,borderRadius:10}} className='mainside'>
                    {children}
                </div>
                </div>
        </div>
    );
};

export default Sidebar;
