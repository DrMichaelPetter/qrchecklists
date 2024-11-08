
import styles from 'styles/Breadcrumbbar.module.css';
import { FiShare2 } from "react-icons/fi";
import { AiOutlineCloudSync } from 'react-icons/ai';
import { GrUserNew } from 'react-icons/gr';
import { BsClipboardPlus } from 'react-icons/bs';
import { FaRegClone } from 'react-icons/fa';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import InstaName from 'components/InstaName.component';
import useOnlineStatus from 'components/OnlineStatus.component';
const Breadcrumbbar = ({reset,lists,switchTo,branchOff}) => {
        const onlineStatus = useOnlineStatus();
    return (<nav className={styles.navbar}>
        <button className={styles.btn} onClick={()=>reset()}><GrUserNew /></button>
        <Link to="/newcheckpoint" state={{prev: lists.__current}}><div className={styles.btn}><FaRegClone /> <IoMdArrowRoundForward className={styles.add}/> <BsClipboardPlus /></div></Link>
        {false&&<div className={styles.btn}><InstaName branchOff={branchOff} pred={lists.__current} /></div>}
        <div className={styles.breadcrumbspacer}></div>
        {(lists[lists["__current"]].tag !== undefined) && <button className={styles.btn} disabled={!onlineStatus} onClick={()=>window.alert("PLACEHOLDER: Here, we would sync the tag with the webservice")}><AiOutlineCloudSync /></button>}
        {(lists[lists["__current"]].tag === undefined) && <button className={styles.btn} disabled={!onlineStatus} onClick={()=>window.alert("PLACEHOLDER: Here, we would create a TAG and share it via Webservice")}><FiShare2 /></button>}
    </nav>);
}

export default Breadcrumbbar;