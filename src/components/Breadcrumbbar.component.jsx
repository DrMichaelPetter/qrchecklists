
import styles from 'styles/Breadcrumbbar.module.css';
import { FiShare2 } from "react-icons/fi";
import InstaName from 'components/InstaName.component';
import useOnlineStatus from 'components/OnlineStatus.component';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { RxReset } from "react-icons/rx";
import { FaRegClone } from "react-icons/fa";
const Breadcrumbbar = ({lists,switchTo,branchOff}) => {
    
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
        
//        { restorepath(lists) }    
    return (<nav className={styles.navbar}>
        <button className={styles.btn} ><RxReset /></button>
        <div className={styles.btn}><FaRegClone /><InstaName branchOff={branchOff} pred={lists.__current} /></div>
        <div className={styles.breadcrumbspacer}></div>
        <button className={styles.btn} disabled={!useOnlineStatus()} ><AiOutlineCloudSync /></button>
        <button className={styles.btn} disabled={!useOnlineStatus()} ><FiShare2 /></button>
    </nav>);
}

export default Breadcrumbbar;