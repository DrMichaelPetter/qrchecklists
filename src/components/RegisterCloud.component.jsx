import styles from 'styles/RegisterCloud.module.css';
import { useEffect, useState, useCallback } from "react";
import { BsCloudDownload } from 'react-icons/bs';
import { MdRefresh } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { TbLinkMinus, TbLinkOff, TbLinkPlus } from 'react-icons/tb';
import { FaRecycle } from 'react-icons/fa';
import { api, toBig } from 'services/api';

const RegisterCloud = ({lists,settings,delCheckpoint,subscribeTo,sync,removeTag,showError,showNotice}) => {
    const baseurl = settings.webservice;
    const initializeOrphans = () => {
        var orph = [];
        for (let key in lists)
            if (lists[key].tag !== undefined)
                orph.push(key);
        return orph;
    }
    const navigate = useNavigate();
    const [servertags,setServertags] = useState({});
    const [orphans,setOrphans] = useState(initializeOrphans());
    const findTag = useCallback((tag) => {
        for(let key in lists)
            if (lists[key].tag === tag) 
                return key;
        return null;
    }, [lists]);

    useEffect(() => {
        const initialList = async () => {
            try {
                const mytags = await api(baseurl);
                setServertags(mytags);
                Object.keys(mytags).forEach((tag) => {
                    const key=findTag(tag);
                    setOrphans((orph)=>orph.filter((item)=>(item!==key)));
                    });
            } catch (e) {
                showError(e.message);
            }
        };
        initialList();
    },[baseurl, findTag, showError]);

    const remove = (tag) => {
        removeTag(tag);
        navigate('/managecheckpoints');
    }

    const syncTo = async (tag) => {
        try {
            const data = await api(baseurl, tag);
            subscribeTo(tag, toBig(data.state), toBig(data.prevstate));
            showNotice(`Added #${tag} from cloud`);
        } catch (e) {
            showError(e.message);
        }
    }

    const deleteFromServer = async (tag) => {
        const password=prompt("Please enter the password to server-side delete the tag");
        if (password === null) return;
        try {
            await api(baseurl, tag, { method: 'DELETE', body: JSON.stringify({ password }) });
            showNotice(`Deleted #${tag} from server`);
            navigate('/managecheckpoints');
        } catch (e) {
            showError(e.message);
        }
    }

return (<>
    <BsCloudDownload className={styles.megaicon} />
    <h1 className={styles.title}>Manage Cloud Subscriptions</h1>
    <ul>{
         Object.keys(servertags).map((tag) => <li className={styles.listpoint} key={tag}>
            {(findTag(tag)===null) &&   <div className={styles.btn}>     <TbLinkPlus className={styles.icon} onClick={()=>{syncTo(tag)}}/> #{servertags[tag].tag}</div>}
            {(findTag(tag)!==null) && <><div className={styles.btndel}><TbLinkMinus className={styles.icon} onClick={()=>{delCheckpoint(findTag(tag))}}/> #{tag}</div><TbLinkOff onClick={()=>{deleteFromServer(tag);}} className={styles.additionaldel} /><MdRefresh onClick={() => {sync(findTag(tag));}} className={styles.additionalicon}/></>}
            </li>)
    }</ul>
    {orphans.length!==0 && <h1 className={styles.title}>Orphaned Checkpoints</h1>}
    <ul>
    {
        orphans.map((tag) => <li className={styles.listpoint} key={tag}>
            <div className={styles.btn}>     <FaRecycle className={styles.icon} onClick={()=>{remove(tag)}}/> #{lists[tag].tag}</div>
            </li>)
    }</ul></>);
}
export default RegisterCloud;