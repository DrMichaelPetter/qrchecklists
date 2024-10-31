import styles from 'styles/Sidebar.module.css';
const SideBar = () => {
    return (
        <div className={styles.sidebar}>
            <img src="logo192.png"/><h2>FA Checkmarks</h2>
            <p>Configure your Checkmark-Processes, Delete your local data</p>
            <ul className={styles.btnToggleNav}>
                <li><a className={styles.linkBody} href="#">Overview</a></li>
                <li><button className={styles.btnToggle}>Processes</button></li>
                <li><button className={styles.btnToggle}>Data</button></li>
                <li><a className={styles.linkBody}   href="#">About</a></li>
            </ul>
        </div>
    );
}
export default SideBar;