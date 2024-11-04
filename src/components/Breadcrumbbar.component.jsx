
import styles from 'styles/Breadcrumbbar.module.css';
import { BsCloudUpload, BsShare, BsNodePlus } from 'react-icons/bs';
const Breadcrumbbar = () => {
    return (<nav className={styles.navbar}>
        <div className={styles.breadcrumb}>#all</div>
        <div className={styles.breadcrumb}>Alpenblick</div>
        <div className={styles.breadcrumb}>Bozen</div>
        <div className={styles.breadcrumb}><BsNodePlus /> <BsShare /></div>
    </nav>);
}

export default Breadcrumbbar;