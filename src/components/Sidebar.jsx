import styles from 'styles/Sidebar.module.css';
import { useState, useEffect } from 'react';
import { HiCog, HiOutlineHome } from "react-icons/hi";
import { FaHashtag } from "react-icons/fa";
import { BsCloud } from "react-icons/bs";

const SideBar = () => {
    const [showBar, setShowBar] = useState(false);
    const [minscreen, setMinscreen] = useState(
        window.matchMedia("(min-width: 1920px)").matches
    )
    useEffect(() => {
      window
      .matchMedia("(min-width: 1920px)")
      .addEventListener('change', e => setMinscreen( e.matches ));
    }, []);

    return (
        <>
        <nav className={styles.sidebar} style={ {width:(minscreen?('440px'):(showBar?'100%':'0px'))}}>
            <button className={styles.closebtn} onClick={()=> setShowBar((bar) =>!bar)}>&times;</button>
            <div class={styles.overlayContent}>
              <a  className={styles.majorItems} href="#"><HiOutlineHome /> Home</a>
              <a  className={styles.majorItems} href="#"><BsCloud /> Cloud-Lists</a>
              <ul className={styles.minorMenu}>
                <li><a className={styles.minorItems} href="#"><FaHashtag />all</a></li>
                <li><a className={styles.minorItems} href="#"><FaHashtag />Tageswanderung</a></li>
                <li><a className={styles.minorItems} href="#"><FaHashtag />Bozen</a></li>
              </ul>
              <a  className={styles.majorItems} href="#"><HiCog /> Settings</a>
            </div>            
        </nav>
        <button className={styles.burger} onClick={()=> setShowBar((bar) =>!bar)}>&#9776;</button>
        </>
    );
}
export default SideBar;