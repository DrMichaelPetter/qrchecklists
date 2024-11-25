import styles from 'styles/RegisterCloud.module.css';
import { useEffect,useState } from "react";
import { BsCloudDownload } from 'react-icons/bs';
import { MdRefresh } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { TbLinkMinus, TbLinkOff, TbLinkPlus } from 'react-icons/tb';
import { FaRecycle } from 'react-icons/fa';

const RegisterCloud = ({lists,settings,delCheckpoint,subscribeTo,sync,removeTag}) => {
    /* global BigInt */
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
    const findTag = (tag) => {
        for(let key in lists)
            if (lists[key].tag === tag) 
                return key;
        return null;
    }

    useEffect(() => {
        const initialList = () => {
            fetch(baseurl, {
                method: 'GET',
                headers: { 'Accept': 'application/json', },
            })
            .then(response => response.json())
            .then(data => { 
                const mytags = JSON.parse(JSON.stringify(data));
                setServertags((tags)=>mytags); 
                //console.dir(mytags);
                Object.keys(mytags).forEach((tag) => {
                    const key=findTag(tag);
                    setOrphans((orph)=>orph.filter((item)=>(item!==key)));
                    });
            });
        };
        initialList();
    },[baseurl]);

    const remove = (tag) => {
        removeTag(tag);
        navigate('/managecheckpoints');
    }

    const syncTo = (tag) => {
        fetch(baseurl+tag, {
            method: 'GET',
            headers: { 'Accept': 'application/json', },
        }).then(response => response.json())
        .then(data => { 
            const state = BigInt(data.state);
            const prevstate = BigInt(data.prevstate);
            subscribeTo(tag,state,prevstate);
        });
    }

    const deleteFromServer = (tag) => {
        const password=prompt("Please enter the password to server-side delete the tag");
        fetch(baseurl+tag, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json', },
            body: JSON.stringify({ password: password }),
        }).then(response => 
            {
                if (!response.ok) {
                    alert("Error: "+response.statusText);
                    return;
                } 
                navigate('/managecheckpoints');
            });

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