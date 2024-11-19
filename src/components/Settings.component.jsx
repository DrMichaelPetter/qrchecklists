import styles from 'styles/Settings.module.css';
import { FaScrewdriverWrench } from "react-icons/fa6";
const Settings = ({settings,setSettings}) => {
     return(
     <>
     <FaScrewdriverWrench className={styles.megaicon} />
     <h1 className={styles.title}>General Settings</h1>
     <table className={styles.table}>
        <tr><td>Webservice:</td><td><input type="text" value={settings.webservice} /></td></tr>
        <tr><td>Name: </td><td><input type="text" value="Dieter" /></td></tr>
     </table>
     
     </>
    );
}
export default Settings;