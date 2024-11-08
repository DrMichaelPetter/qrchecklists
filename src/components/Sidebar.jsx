import styles from 'styles/Sidebar.module.css';
import { useState, useEffect } from 'react';
import { HiCog, HiOutlineHome } from "react-icons/hi";
import { FaHashtag, FaRegCalendarAlt } from "react-icons/fa";
import { BsCloud } from "react-icons/bs";
import { BsClipboardPlusFill } from "react-icons/bs";
import { MdEventAvailable } from "react-icons/md";
import { TbCloudPlus } from "react-icons/tb";
import { HiUserGroup } from "react-icons/hi";
import { FaGithub , FaRegTrashAlt , FaWrench } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
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
            <div className={styles.overlayContent}>
              <img className={styles.logo} src={process.env.PUBLIC_URL + '/logo.svg'} alt="logo" />
              <div className={styles.majorItems}><HiOutlineHome /> Home</div>
              <div className={styles.majorItems}><BsCloud /> Shared checkpoints</div>
              <ul  className={styles.minorMenu}>
                { Object
                    .keys(lists)
                    .filter((k)=>!(["all","__current"].includes(k)))
                    .filter((k)=>lists[k].tag!==undefined)
                    .map((key) =>
                <li><div className={styles.minorItems} onClick={()=>{switchTo(key);endSidebar()}}><FaHashtag /> {lists[key].tag}</div></li>
                )}
                <li><div className={styles.minorItems}><FaHashtag />  &middot; &middot; &middot; <TbCloudPlus /></div></li>
              </ul>
              <div  className={styles.majorItems}><MdEventAvailable /> My checkpoints</div>
                <ul className={styles.minorMenu}>
                  <li><div className={styles.minorItems} onClick={()=>{switchTo("all");endSidebar()}}><HiUserGroup />  &middot; &middot; &middot; <BsClipboardPlusFill /></div></li>
                  {
                    Object
                      .keys(lists)
                      .filter((k)=>!(["all","__current"].includes(k)))
                      .filter((k)=>lists[k].tag===undefined)
                      .map((key) =>
                  <li><div className={styles.minorItems} onClick={()=>{switchTo(key);endSidebar()}}><FaRegCalendarAlt /> {lists[key].name}</div></li>
                  )}
                </ul>
              <div  className={styles.majorItems} ><HiCog /> Settings</div>
                <ul className={styles.minorMenu}>
                  <li><div className={styles.minorItems}><FaWrench /> General</div></li>
                  <li><div className={styles.minorItems}><RxReset /> Reset App</div></li>
                  <li><div className={styles.minorItems}><FaRegTrashAlt /> Delete Checkpoints</div></li>
                  <li><a   className={styles.minorItems} href="https://github.com/DrMichaelPetter/qrchecklists"><FaGithub /> Sources</a></li>
                </ul>
            </div>            
        </nav>
        <button className={styles.burger} onClick={()=> setShowBar((bar) =>!bar)}>&#9776;</button>
        </>
    );
}
export default SideBar;