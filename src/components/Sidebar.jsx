import styles from 'styles/Sidebar.module.css';
import { useState } from 'react';
import { HiCog, HiOutlineHome } from "react-icons/hi";
import { FaHashtag } from "react-icons/fa";
import { BsCloud } from "react-icons/bs";

const SideBar = () => {
    const [showBar, setShowBar] = useState(false);
    
    return (
        <>
        <button className={styles.burger} onClick={()=> setShowBar((bar) =>!bar)}>&#9776;</button>
        <nav className={styles.sidebar} style={ {width:showBar?'100%':'0px'}}>
            <button className={styles.closebtn} onClick={()=> setShowBar((bar) =>!bar)}>&times;</button>
            <div class={styles.overlayContent}>
              <a  className={styles.majorItems} href="#"><HiOutlineHome /> Home</a>
              <a  className={styles.majorItems} href="#"><BsCloud /> Cloud-Lists</a>
              <ul className={styles.minorItems}>
                <li><a className={styles.minorItems} href="#"><FaHashtag /> List 1</a></li>
                <li><a className={styles.minorItems} href="#"><FaHashtag /> List 2</a></li>
                <li><a className={styles.minorItems} href="#"><FaHashtag /> List 3</a></li>
              </ul>
              <a  className={styles.majorItems} href="#"><HiCog /> Settings</a>
            </div>            
        </nav>
        </>
    );
}
export default SideBar;