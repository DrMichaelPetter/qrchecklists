import styles from 'styles/Settings.module.css';
import { FaScrewdriverWrench } from "react-icons/fa6";
import { RxReset } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import useOnlineStatus from 'components/OnlineStatus.component';
import { FaHiking } from 'react-icons/fa';
import { MdOutlineSignalWifi4Bar, MdOutlineCloudDownload } from 'react-icons/md';
const Settings = ({settings,setSettings,clearState}) => {
   const navigate = useNavigate();
   const isOnline = useOnlineStatus();
   const evictCache = async () => {
      if ('serviceWorker' in navigator) {
         const regs = await navigator.serviceWorker.getRegistrations();
         await Promise.all(regs.map((reg) => reg.unregister()));
      }
      if (window.caches) {
         const keys = await caches.keys();
         await Promise.all(keys.map((key) => caches.delete(key)));
      }
      window.location.reload();
   };
     return(
     <>
     <FaScrewdriverWrench className={styles.megaicon} />
     <h1 className={styles.title}>General Settings</h1>
     <table className={styles.table}>
     <tr><td>Name:      </td><td><input type="text" className={styles.input} onChange={(e)=>setSettings((setting)=>({...setting,"username":e.target.value}))} value={settings.username} /></td></tr>
     <tr><td>Webservice:</td><td><input type="text" className={styles.input} onChange={(e)=>setSettings((setting)=>({...setting,"webservice":e.target.value}))} value={settings.webservice} /></td></tr>
     <tr><td>QR Prefix: </td><td><input type="text" className={styles.input} onChange={(e)=>setSettings((setting)=>({...setting,"qrprefix":e.target.value}))} value={settings.qrprefix} /></td></tr>
        <tr><td>Online mode: </td><td>
           { isOnline && <MdOutlineSignalWifi4Bar  className={styles.connectionicon}/> }
           { !isOnline &&<FaHiking  className={styles.connectionicon}/> }
             </td></tr>
         <tr height="100px"></tr>
          <tr><td className={styles.center} colspan="2"><div onClick={()=>{clearState();navigate("/");}}><RxReset  className={styles.icon}/> Reset app</div></td></tr>
          <tr><td className={styles.center} colspan="2"><div onClick={evictCache}><MdOutlineCloudDownload  className={styles.icon}/> Reload APP/CSV from web</div></td></tr>
     </table>
     
     </>
    );
}
export default Settings;