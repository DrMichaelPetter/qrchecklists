
import styles from 'styles/Breadcrumbbar.module.css';
import { FiShare2 } from "react-icons/fi";
import InstaName from 'components/InstaName.component';
import useOnlineStatus from 'components/OnlineStatus.component';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { GrUserNew } from 'react-icons/gr';
import { FaRegClone } from "react-icons/fa";
const Breadcrumbbar = ({reset,lists,switchTo,branchOff}) => {
    
    const restorepath = (lists) => {
        var path = [];
        var current = lists["__current"];
        while (current !== undefined) {
            let name = (lists[current].tag===undefined)?lists[current].name:"# "+lists[current].tag;
            let thiss=current;
            path.unshift(<div key={thiss} onClick={()=>{
                switchTo(thiss);
            }} className={styles.breadcrumb}>{name}</div>);
            current = lists[current].prev;
        }
        return path;
    }
    const onlineStatus = useOnlineStatus();
//        { restorepath(lists) }    
    return (<nav className={styles.navbar}>
        <button className={styles.btn} onClick={()=>reset()}><GrUserNew /></button>
        <div className={styles.btn}><InstaName branchOff={branchOff} pred={lists.__current} /></div>
        <div className={styles.breadcrumbspacer}></div>
        {(lists[lists["__current"]].tag !== undefined) && <button className={styles.btn} disabled={!onlineStatus} ><AiOutlineCloudSync /></button>}
        {(lists[lists["__current"]].tag === undefined) && <button className={styles.btn} disabled={!onlineStatus} ><FiShare2 /></button>}
    </nav>);
}

export default Breadcrumbbar;