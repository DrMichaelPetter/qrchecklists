
import styles from 'styles/Breadcrumbbar.module.css';
import { FaPlusCircle } from "react-icons/fa";
import { BsShare } from 'react-icons/bs';
import { HiUserGroup } from "react-icons/hi";
import InstaName from 'components/InstaName.component';
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
        
    
    return (<nav className={styles.navbar}>
        { restorepath(lists) }
        <div className={styles.breadcrumb}><InstaName branchOff={branchOff} pred={lists.__current} /></div>
        <div className={styles.breadcrumbspacer}></div>
        <div className={styles.breadcrumb}><BsShare /></div>
    </nav>);
}

export default Breadcrumbbar;