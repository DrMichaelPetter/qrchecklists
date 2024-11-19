import styles from 'styles/RegisterCloud.module.css';
import { useEffect,useState } from "react";
import { BsCloudDownload } from 'react-icons/bs';
import { GoLink, GoUnlink } from 'react-icons/go';
import { MdRefresh } from 'react-icons/md';

const RegisterCloud = ({lists,settings,delCheckpoint,subscribeTo,sync}) => {
    /* global BigInt */
    const baseurl = settings.webservice;
    const [servertags,setServertags] = useState({});

    useEffect(() => {
        const initialList = () => {
            fetch(baseurl, {
                method: 'GET',
                headers: { 'Accept': 'application/json', },
            })
            .then(response => response.json())
            .then(data => { setServertags(JSON.parse(JSON.stringify(data))); });
        };
        initialList();
    },[baseurl]);

    const findTag = (tag) => {
        for(let key in lists)
            if (lists[key].tag === tag) 
                return key;
        return null;
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
    }</ul></>);
}
export default RegisterCloud;