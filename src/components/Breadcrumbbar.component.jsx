
import styles from 'styles/Breadcrumbbar.module.css';
import { FaPlusCircle } from "react-icons/fa";
import { BsShare } from 'react-icons/bs';
import { HiUserGroup } from "react-icons/hi";
const Breadcrumbbar = ({lists}) => {
    
    const restorepath = (lists) => {
        var path = [];
        var current = lists["__current"];
        while (current !== "all") {
            path.unshift(<div className={styles.breadcrumb}>{lists[current].name}</div>);
            current = lists[current].prev;
        }
        return path;
    }
        
    
    return (<nav className={styles.navbar}>
        <div className={styles.breadcrumb}><HiUserGroup /> all</div>
        { restorepath(lists) }
        <div className={styles.breadcrumb}><FaPlusCircle /></div>
        <div className={styles.breadcrumbspacer}></div>
        <div className={styles.breadcrumb}><BsShare /></div>
    </nav>);
}

export default Breadcrumbbar;