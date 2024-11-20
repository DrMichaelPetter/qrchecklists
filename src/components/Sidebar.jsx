import styles from 'styles/Sidebar.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { HiCog, HiOutlineHome } from "react-icons/hi";
import { BsCloud } from "react-icons/bs";
import { MdHelpCenter } from "react-icons/md";
import { TbCloudPlus } from "react-icons/tb";
import { FaHashtag, FaGithub , FaWrench } from "react-icons/fa";
import { GoTriangleDown , GoTriangleLeft } from "react-icons/go";
import { LuClipboard, LuClipboardList } from 'react-icons/lu';
import { PiListMagnifyingGlassLight } from "react-icons/pi";

const SideBar = ({lists,switchTo,clearState}) => {
    const [tags, setTags] = useState(false);
    const [checkpoints, setCheckpoints] = useState(false);
    const [settings, setSettings] = useState(false);

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
    const navigate = useNavigate();

    return (
        <>
        <nav className={styles.sidebar} style={ {width:(minscreen?('440px'):(showBar?'100%':'0px'))}}>
            <button className={styles.closebtn} onClick={()=> setShowBar((bar) =>!bar)}>&times;</button>
            <div className={styles.overlayContent}>
              <img className={styles.logo} src={process.env.PUBLIC_URL + '/logo.svg'} alt="logo" />
              <div className={styles.majorItems} onClick={()=>{navigate("/");endSidebar();}}><HiOutlineHome  className={styles.icon}/> Home</div>
              {Object.keys(lists).filter((k)=>((!(["all","__current"].includes(k))&&lists[k].tag!==undefined))).length>0 && <><div className={styles.majorItems} onClick={()=>setTags((s)=>!s)}><BsCloud  className={styles.icon}/> Subscriptions {tags && <GoTriangleDown />}{!tags && <GoTriangleLeft />}</div>
                {tags && <ul  className={styles.minorMenu}>
                  { Object
                      .keys(lists)
                      .filter((k)=>!(["all","__current"].includes(k)))
                      .filter((k)=>lists[k].tag!==undefined)
                      .map((key) =>
                  <li><div key={key} className={styles.minorItems} onClick={()=>{switchTo(key);endSidebar();navigate("/checkpoint")}}><FaHashtag className={styles.icon}/> {lists[key].tag}</div></li>
                  )}
                  <li><div className={styles.minorItems} onClick={()=>{endSidebar();navigate("/cloud");}}><FaHashtag  className={styles.icon}/>  &middot; &middot; &middot; <TbCloudPlus  className={styles.icon}/></div></li>
                </ul>}</>}
              {Object.keys(lists).filter((k)=>((!(["all","__current"].includes(k))&&lists[k].tag===undefined))).length>0 && <><div  className={styles.majorItems} onClick={()=>setCheckpoints((s)=>!s)}><LuClipboard  className={styles.icon}/> My checkpoints {checkpoints && <GoTriangleDown  className={styles.icon}/>}{!checkpoints && <GoTriangleLeft  className={styles.icon}/>}</div>
                {checkpoints && <ul className={styles.minorMenu}>
                  {
                    Object
                      .keys(lists)
                      .filter((k)=>!(["all","__current"].includes(k)))
                      .filter((k)=>lists[k].tag===undefined)
                      .map((key) =>
                  <li><div key={key} className={styles.minorItems} onClick={()=>{switchTo(key);endSidebar();navigate("/checkpoint")}}><LuClipboardList className={styles.icon}/> {lists[key].name}</div></li>
                  )}
                  <li><div className={styles.minorItems} onClick={()=>{navigate("/managecheckpoints");endSidebar();}}> <LuClipboardList className={styles.icon}/> &middot; &middot; &middot; <PiListMagnifyingGlassLight className={styles.icon}/></div></li>
                </ul>}</>}
              <div  className={styles.majorItems} onClick={()=>setSettings((s)=>!s)}><HiCog  className={styles.icon}/> Settings {settings && <GoTriangleDown  className={styles.icon}/>}{!settings && <GoTriangleLeft  className={styles.icon}/>}</div>
                {settings && <ul className={styles.minorMenu}>
                  <li><div className={styles.minorItems} onClick={()=>{endSidebar();navigate("/settings")}}><FaWrench  className={styles.icon}/> General</div></li>
                  <li><a   className={styles.minorItems} href="https://github.com/DrMichaelPetter/qrchecklists/wiki/FA-Checkpoint-Checker"><MdHelpCenter  className={styles.icon}/> Documentation</a></li>
                  <li><a   className={styles.minorItems} href="https://github.com/DrMichaelPetter/qrchecklists"><FaGithub  className={styles.icon}/> Sources</a></li>
                </ul>}
            </div>            
        </nav>
        <button className={styles.burger} onClick={()=> setShowBar((bar) =>!bar)}>&#9776;</button>
        </>
    );
}

//<li><div className={styles.minorItems} onClick={()=>window.alert("PLACEHOLDER: Here, we clear app data -- not the webservice though")}><RxReset /> Reset App</div></li>
export default SideBar;