import styles from 'styles/RegisterCloud.module.css';
import { useEffect,useState } from "react";
import { BsCloudDownload } from 'react-icons/bs';
import { MdOutlineSyncDisabled, MdSync } from 'react-icons/md';

const RegisterCloud = ({lists,switchTo,delCheckpoint,subscribeTo}) => {
    const baseurl = "https://www2.in.tum.de/~petter/webservice/";
    const [servertags,setServertags] = useState([]);

    useEffect(() => {
        const responseToList = (jsondata) => {
            const response = JSON.parse(JSON.stringify(jsondata));
            let conv =  Object.keys(response)
                .map((key)=> {
                    return response[key].tag
                });
            return conv;
        }
        const initialList = () => {
            fetch(baseurl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                setServertags(responseToList(data));
            });
        };
        initialList();
    },[]);

    const findTag = (tag) => {
        for(let key in lists) {
            if (lists[key].tag === tag) {
                return key;}
        }
        return null;
    }

    const syncTo = (tag) => {
        subscribeTo(tag);
    }

return (<>
    <BsCloudDownload className={styles.megaicon} />
    <h1 className={styles.title}>Cloud Checkpoints</h1>
    <ul>{
         servertags.map((tag) => <li className={styles.listpoint} key={tag} >
            {(findTag(tag)===null) && <div className={styles.btn} onClick={()=>{syncTo(tag)}}><MdSync className={styles.icon}/> #{tag}</div>}
            {(findTag(tag)!==null) && <div className={styles.btn} onClick={()=>{delCheckpoint(findTag(tag))}}><MdOutlineSyncDisabled className={styles.icon}/> #{tag}</div>}
            </li>)
    }</ul></>);
}
export default RegisterCloud;