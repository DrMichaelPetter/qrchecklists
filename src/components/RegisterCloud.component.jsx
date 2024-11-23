import styles from 'styles/RegisterCloud.module.css';
import { useEffect,useState } from "react";
import { BsCloudDownload } from 'react-icons/bs';
import { GoLink, GoUnlink } from 'react-icons/go';
import { MdRefresh } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { FaWrench } from 'react-icons/fa6';

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
                Object.keys(mytags).map((tag) => {
                    const key=findTag(tag);
                    setOrphans((orph)=>orph.filter((item)=>(item!==key)));
                    });
            });
        };
        initialList();
    },[baseurl]);

    const findTag = (tag) => {
        for(let key in lists)
            if (lists[key].tag === tag) 
                return key;
        return null;
    }
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

return (<>
    <BsCloudDownload className={styles.megaicon} />
    <h1 className={styles.title}>Manage Cloud Subscriptions</h1>
    <ul>{
         Object.keys(servertags).map((tag) => <li className={styles.listpoint} key={tag}>
            {(findTag(tag)===null) &&   <div className={styles.btn}>     <GoLink className={styles.icon} onClick={()=>{syncTo(tag)}}/> #{servertags[tag].tag}</div>}
            {(findTag(tag)!==null) && <><div className={styles.btndel}><GoUnlink className={styles.icon} onClick={()=>{delCheckpoint(findTag(tag))}}/> #{tag}</div><MdRefresh onClick={() => {sync(findTag(tag));}} className={styles.additionalicon}/></>}
            </li>)
    }
    {
        orphans.map((tag) => <li className={styles.listpoint} key={tag}>
            <div className={styles.btn}>     <FaWrench className={styles.icon} onClick={()=>{remove(tag)}}/> #{lists[tag].tag}</div>
            </li>)
    }</ul></>);
}
export default RegisterCloud;