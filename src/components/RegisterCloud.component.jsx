import styles from 'styles/RegisterCloud.module.css';
import { useEffect, useState, useCallback } from "react";
import { BsCloudDownload } from 'react-icons/bs';
import { MdRefresh } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { TbExternalLink, TbLinkMinus, TbLinkOff, TbLinkPlus, TbEye, TbEyeOff } from 'react-icons/tb';
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
    const isFirefox = typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);
    const [servertags,setServertags] = useState({});
    const [orphans,setOrphans] = useState(initializeOrphans());
    const [pwdFor,setPwdFor] = useState(null);
    const [pwd,setPwd] = useState("");
    const [showPwd,setShowPwd] = useState(false);
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

    const shareLink = (tag) => `${window.location.origin}${window.location.pathname}#/subscribe/${encodeURIComponent(tag)}`;
    const copyLink = (tag) => {
        const link = shareLink(tag);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(link).then(
                () => showNotice(`Link for #${tag} copied`),
                () => showError("Could not copy link.")
            );
        } else {
            window.prompt("Copy this subscription link:", link);
        }
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

    const openDelete = (tag) => {
        setPwd("");
        setShowPwd(false);
        setPwdFor(tag);
    }
    const closeDelete = () => {
        setPwdFor(null);
        setPwd("");
        setShowPwd(false);
    }
    const deleteFromServer = async () => {
        const tag = pwdFor;
        try {
            await api(baseurl, tag, { method: 'DELETE', body: JSON.stringify({ password: pwd }) });
            showNotice(`Deleted #${tag} from server`);
            closeDelete();
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
            {(findTag(tag)===null) &&   <div className={styles.btn}>     <TbLinkPlus className={styles.icon} title="Subscribe to this cloud checkpoint" aria-label="Subscribe to this cloud checkpoint" onClick={()=>{syncTo(tag)}}/> #{servertags[tag].tag}<TbExternalLink className={styles.additionalicon} title="Copy subscription link for this checkpoint" aria-label="Copy subscription link for this checkpoint" onClick={()=>{copyLink(tag)}}/></div>}
            {(findTag(tag)!==null) && <><div className={styles.btndel}><TbLinkMinus className={styles.icon} title="Unsubscribe from this checkpoint (still kept on the server)" aria-label="Unsubscribe from this checkpoint (still kept on the server)" onClick={()=>{delCheckpoint(findTag(tag))}}/> #{tag}</div><TbExternalLink title="Copy subscription link for this checkpoint" aria-label="Copy subscription link for this checkpoint" onClick={()=>{copyLink(tag);}} className={styles.additionalicon} /><TbLinkOff title="Delete this checkpoint from the server (permanent, requires password)" aria-label="Delete this checkpoint from the server (permanent, requires password)" onClick={()=>{openDelete(tag);}} className={styles.additionaldel} /><MdRefresh title="Sync with server -- committed changes cannot be undone" aria-label="Sync with server -- committed changes cannot be undone" onClick={() => {sync(findTag(tag));}} className={styles.additionalicon}/></>}
            </li>)
    }</ul>
    {orphans.length!==0 && <h1 className={styles.title}>Orphaned Checkpoints</h1>}
    <ul>
    {
        orphans.map((tag) => <li className={styles.listpoint} key={tag}>
            <div className={styles.btn}>     <FaRecycle className={styles.icon} title="Unlink this lost checkpoint (kept locally)" aria-label="Turn this orphaned checkpoint subscription into a local checkpoint" onClick={()=>{remove(tag)}}/> #{lists[tag].tag}</div>
            </li>)
    }</ul>
    {pwdFor !== null && <div className={styles.modal}>
        <div className={styles.message}>
            Enter the password to server-side delete #{pwdFor}
            <div className={styles.inputwrap}>
                <input
                    autoFocus
                    className={styles.input}
                    type={!showPwd && isFirefox ? "password" : "text"}
                    style={!showPwd && !isFirefox ? { WebkitTextSecurity: "disc" } : undefined}
                    value={pwd}
                    placeholder="Password"
                    onChange={(e)=>setPwd(e.target.value)}
                    onKeyDown={(e)=>{ if (e.key==='Enter') deleteFromServer(); }}
                />
                <button className={styles.toggle} aria-label={showPwd ? "Hide password" : "Show password"} onClick={()=>setShowPwd((s)=>!s)}>
                    {showPwd ? <TbEyeOff /> : <TbEye />}
                </button>
            </div>
            <div className={styles.choice}>
                <button className={styles.cancelBtn} onClick={closeDelete}>Cancel</button>
                <button className={styles.delBtn} onClick={deleteFromServer}>Delete</button>
            </div>
        </div>
    </div>}
    </>);
}
export default RegisterCloud;