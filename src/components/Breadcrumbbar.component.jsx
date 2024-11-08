
import styles from 'styles/Breadcrumbbar.module.css';
import { FiShare2 } from "react-icons/fi";
import InstaName from 'components/InstaName.component';
import useOnlineStatus from 'components/OnlineStatus.component';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { GrUserNew } from 'react-icons/gr';
const Breadcrumbbar = ({reset,lists,switchTo,branchOff}) => {
        const onlineStatus = useOnlineStatus();
    return (<nav className={styles.navbar}>
        <button className={styles.btn} onClick={()=>reset()}><GrUserNew /></button>
        <div className={styles.btn}><InstaName branchOff={branchOff} pred={lists.__current} /></div>
        <div className={styles.breadcrumbspacer}></div>
        {(lists[lists["__current"]].tag !== undefined) && <button className={styles.btn} disabled={!onlineStatus} onClick={()=>window.alert("PLACEHOLDER: Here, we would sync the tag with the webservice")}><AiOutlineCloudSync /></button>}
        {(lists[lists["__current"]].tag === undefined) && <button className={styles.btn} disabled={!onlineStatus} onClick={()=>window.alert("PLACEHOLDER: Here, we would create a TAG and share it via Webservice")}><FiShare2 /></button>}
    </nav>);
}

export default Breadcrumbbar;