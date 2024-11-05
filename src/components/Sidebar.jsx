import styles from 'styles/Sidebar.module.css';
import { useState, useEffect } from 'react';
import { HiCog, HiOutlineHome } from "react-icons/hi";
import { FaHashtag, FaRegCalendarAlt } from "react-icons/fa";
import { BsCloud } from "react-icons/bs";
import { MdEventAvailable } from "react-icons/md";
import { TbCloudPlus } from "react-icons/tb";
import { HiUserGroup } from "react-icons/hi";

const SideBar = ({lists,switchTo}) => {
    const [showBar, setShowBar] = useState(false);
    const [minscreen, setMinscreen] = useState(
        window.matchMedia("(min-width: 1920px)").matches
    )
    useEffect(() => {
      window
      .matchMedia("(min-width: 1920px)")
      .addEventListener('change', e => setMinscreen( e.matches ));
    }, []);

    const endSidebar = () => {
        if (!minscreen) setShowBar((bar) =>false);
    }

    return (
        <>
        <nav className={styles.sidebar} style={ {width:(minscreen?('440px'):(showBar?'100%':'0px'))}}>
            <button className={styles.closebtn} onClick={()=> setShowBar((bar) =>!bar)}>&times;</button>
            <div class={styles.overlayContent}>
              <a  className={styles.majorItems} href="#"><HiOutlineHome /> Home</a>
              <a  className={styles.majorItems} href="#"><BsCloud /> Shared event lists</a>
              <ul className={styles.minorMenu}>
                { Object
                    .keys(lists)
                    .filter((k)=>!(["all","__current"].includes(k)))
                    .filter((k)=>lists[k].tag!==undefined)
                    .map((key) =>
                <li><a className={styles.minorItems} onClick={()=>{switchTo(key);endSidebar()}}><FaHashtag /> {lists[key].tag}</a></li>
                )}
                <li><a className={styles.minorItems} href="#"><FaHashtag />  &middot; &middot; &middot; <TbCloudPlus /></a></li>
              </ul>
              <a  className={styles.majorItems} href="#"><MdEventAvailable /> Personal event lists</a>
              <ul className={styles.minorMenu}>
                <li><a className={styles.minorItems} onClick={()=>{switchTo("all");endSidebar()}}><HiUserGroup /> all</a></li>
                {
                  Object
                    .keys(lists)
                    .filter((k)=>!(["all","__current"].includes(k)))
                    .filter((k)=>lists[k].tag===undefined)
                    .map((key) =>
                <li><a className={styles.minorItems} onClick={()=>{switchTo(key);endSidebar()}}><FaRegCalendarAlt /> {lists[key].name}</a></li>
                )}
              </ul>
              <a  className={styles.majorItems} href="#"><HiCog /> Settings</a>
            </div>            
        </nav>
        <button className={styles.burger} onClick={()=> setShowBar((bar) =>!bar)}>&#9776;</button>
        </>
    );
}
export default SideBar;