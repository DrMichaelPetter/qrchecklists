import { FaRegClone, FaRegTrashAlt } from 'react-icons/fa';
import { FiEdit3 } from 'react-icons/fi';
import styles from 'styles/DeleteCheckpoints.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { LuClipboardList } from 'react-icons/lu';
const DeleteCheckpoints = ({lists,removeCheckpoint,switchTo,renameCheckpoint}) => {
    const navigate = useNavigate();
    const rename = (key) => {
        const newName = window.prompt("Enter new name for the checkpoint");
        if (newName !== null && newName !== "") {
            renameCheckpoint(key,newName);
        }
    }
    return (
        <div>
            <LuClipboardList className={styles.megaicon} />
            <h1 className={styles.title}>Manage Checkpoints</h1>
            <ul className={styles.checkpointList}>
                {Object.keys(lists)
                       .filter((k)=>(!(["all","__current"].includes(k))) && (lists[k].tag === undefined))
                       .map((key) => 
                        <li key={key} className={styles.checkpointItem} >
                            <FaRegTrashAlt className={styles.icon} onClick={()=>removeCheckpoint(key)}/>
                            <div  className={styles.checkpointname} onClick={()=>{switchTo(key);navigate("/checkpoint")}}> {lists[key].name} </div>
                            <FiEdit3 className={styles.editicon} onClick={()=>{rename(key)}}/>
                            <Link to="/newcheckpoint" state={{prev: key}}><FaRegClone className={styles.cloneicon}/></Link>
                        </li>
                    )}
            </ul>
        </div>
    );
}
export default DeleteCheckpoints;