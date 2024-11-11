import { AiOutlineCloudSync } from 'react-icons/ai';
import { FaRegClone, FaRegTrashAlt } from 'react-icons/fa';
import { FiEdit3, FiShare2 } from 'react-icons/fi';
import styles from 'styles/DeleteCheckpoints.module.css';
import useOnlineStatus from 'components/OnlineStatus.component';
import { Link, useNavigate } from 'react-router-dom';
const DeleteCheckpoints = ({lists,removeCheckpoint,switchTo,renameCheckpoint}) => {
    const onlineStatus = useOnlineStatus();
    const navigate = useNavigate();
    const rename = (key) => {
        const newName = window.prompt("Enter new name for the checkpoint");
        if (newName !== null && newName !== "") {
            renameCheckpoint(key,newName);
        }
    }
    return (
        <div>
            <h1 className={styles.title}>Manage Checkpoints</h1>
            <ul className={styles.checkpointList}>
                {Object.keys(lists)
                       .filter((k)=>(!(["all","__current"].includes(k))))
                       .map((key) => 
                        <li key={key} className={styles.checkpointItem} >
                            <FaRegTrashAlt className={styles.icon} onClick={()=>removeCheckpoint(key)}/>
                            <div  className={styles.checkpointname} onClick={()=>{switchTo(key);navigate("/checkpoint")}}> {lists[key].name} </div>
                            <FiEdit3 className={styles.editicon} onClick={()=>{rename(key)}}/>
                            <Link to="/newcheckpoint" state={{prev: key}}><FaRegClone className={styles.cloneicon}/></Link>
                            {(lists[key].tag !== undefined) && <div className={styles.cloudicon} disabled={!onlineStatus} onClick={()=>window.alert("PLACEHOLDER: Here, we would sync the tag with the webservice")}><AiOutlineCloudSync /></div>}
                            {(lists[key].tag === undefined) && <div className={styles.cloudicon} disabled={!onlineStatus} onClick={()=>window.alert("PLACEHOLDER: Here, we would create a TAG and share it via Webservice")}><FiShare2 /></div>}
                        </li>
                    )}
            </ul>
        </div>
    );
}
export default DeleteCheckpoints;