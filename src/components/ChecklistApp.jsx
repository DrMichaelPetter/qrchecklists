import Checklist from 'components/Checklist';
import SideBar from 'components/Sidebar';
import { useEffect,useState,useRef,useCallback } from 'react';
import styles from 'styles/ChecklistApp.module.css';
import { VscChecklist } from "react-icons/vsc";
import { HashRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from 'components/Home.component';
import CreateCheckpoint from 'components/CreateCheckpoint.component';
import YesNoDialog from 'components/YesnoDialog.component';
import DeleteCheckpoints from 'components/DeleteCheckpoints.component';
import RegisterCloud from 'components/RegisterCloud.component';
import Settings from './Settings.component';
import ShareCheckpoint from './ShareCheckpoint.component';
import Toast from 'components/Toast';
import { api, toBig } from 'services/api';

const ChecklistApp = () => {
    /* global BigInt */

    const loadSettings = () => {
        let settingscandidate = localStorage.getItem("settings");
        if (settingscandidate === null) {
            return ({
                webservice: process.env.REACT_APP_WEBSERVICE_URL || "https://www2.in.tum.de/check/backend/",
                qrprefix: "FA"+((new Date()).getFullYear()),
                username: "Anonymous"
            });
        }
        return JSON.parse(settingscandidate);
    }

    const loadLists = () => {
        let listscandidate = localStorage.getItem("checkpoints");
        if (listscandidate === null) {
            return ({ __current: 'all' ,
                all:   { name: 'all', state: 0n, prevstate: 0n },
            });
        }
        let newlists=JSON.parse(listscandidate,(key,val)=>(key==="state" || key==="prevstate")?BigInt(val):val);
        if (!newlists[newlists.__current] || newlists.__current === '__current')
            newlists.__current = 'all';
        return newlists;
    }

    const clearLists = () => {
        let allstate=lists.all.state;
        localStorage.clear();
        setLists((lists)=> ({
            __current:"all", 
            all: {name: "all", state: allstate, prevstate: allstate}}));
        showNotice("App data cleared");
    }

    var [settings,setSettings] = useState(loadSettings);
    var [lists, setLists] = useState(loadLists());

    const [toast,setToast] = useState(null);
    const toastTimer = useRef(null);
    const showToast = useCallback((type,text) => {
        if (toastTimer.current) clearTimeout(toastTimer.current);
        setToast({ type, text });
        toastTimer.current = setTimeout(()=> setToast(null), type==="error" ? 5000 : 3000);
    },[]);
    const showError = useCallback((text)=> showToast("error", text),[showToast]);
    const showNotice = useCallback((text)=> showToast("success", text),[showToast]);

    const createCheckpoint = (newcheckpointname, lastcheckpointkey) => {
        let newkey = Math.random().toString(36).substring(7);
        setLists((lsts)=> ({ ...lsts, 
            [newkey]: { 
                name: newcheckpointname, 
                state: 0n, 
                prevstate: lsts[lastcheckpointkey].state,
                prev: lastcheckpointkey }
        }));
        return newkey;
    };
    const jsonstringify = (obj) => JSON.stringify(obj,(key,val)=>typeof(val)==="bigint"?val.toString():val);

    useEffect(() => {
        localStorage.setItem("checkpoints",jsonstringify(lists));
        localStorage.setItem("settings",jsonstringify(settings));
    },[lists,settings])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(process.env.PUBLIC_URL+'/teilnehmer.csv');
                const data = await response.text();
                var i = 1;
                const mymapping=data.split('\n').slice(1).map((line) => {
                            const [name,hof,kurs] = line.split(',');
                            i++;
                            return { key: i, name: name, hof: hof, kurs: kurs, checked: false };
                        });
                return mymapping;
            } catch (error) {
                console.error('Error:',error);
                return [];
            }

        }
        fetchData().then((rows) => {
            if (rows.length === 0) return;
            const state = (1n << BigInt(rows.length)) -1n;
            setLists((lsts)=>({ ...lsts, all: {name: 'all' , state: state, prevstate: state } }));

        });
    }, []);

    const switchTo = (key) => {
        setLists((lsts)=>({ ...lsts, __current: key }));
    }
    const reset = () => {
        showNotice(`Cleared "${lists[lists.__current].name}"`);
        setLists((lsts)=>{
            const current = {...lsts[lsts.__current],state:0n};
            return { ...lsts, [lsts.__current]: current };
        });
    }

    const subscribeTo = (tag,state,prevstate) => {
        let newkey = createCheckpoint("#"+tag,"all");
        setLists((lsts)=>({ ...lsts, [newkey]: { ...lsts[newkey], tag: tag , state: state, prevstate: prevstate} }));
        switchTo(newkey);
        return newkey;
    }

    const branchOff = (newname,key) => {
        let newkey = createCheckpoint(newname,key);
        switchTo(newkey);
        return newkey;
    }

    const toggleCurrent = (key) => {
        setLists((l)=> ({ ...l, [l.__current]: { ...l[l.__current], state: l[l.__current].state ^ (1n << BigInt(key-1)) } }));
    }
    const isCurrent = (key) => lists[lists.__current].state & (1n << BigInt(key-1));
    const isPrevious = (key) => lists[lists.__current].prevstate & (1n << BigInt(key-1));
    
    const delCheckpoint = (key) => {
        if (key === 'all') return;
        const name = lists[key] ? lists[key].name : "checkpoint";
        setLists((lsts)=>{
            let newlists = {...lsts};
            delete newlists[key];
            if (lsts.__current === key)
                newlists.__current = 'all';
            return newlists;
        });
        showNotice(`Deleted "${name}"`);
    }
    const rename = (key,newname) => {
        setLists((lsts)=>({ ...lsts, [key]: { ...lsts[key], name: newname } }));
        showNotice(`Renamed to "${newname}"`);
    }
    const sync = async (key) => {
        const tag = lists[key].tag;
        try {
            const data = await api(settings.webservice, tag, {
                method: 'POST',
                body: jsonstringify({ tag, state: lists[key].state }),
            });
            setLists((lsts)=>({ ...lsts, [key]: { ...lsts[key], state: toBig(data.state) } }));
        } catch (e) {
            showError(e.status === 404 ? `#${tag} is gone - re-share it.` : e.message);
        }
    }
    const share = async (tag,key) => {
        if (!tag) { showError("Choose a tag first."); return; }
        const baseurl = settings.webservice;
        try {
            const data = await api(baseurl, "*share", {
                method: 'POST',
                body: jsonstringify({ tag, state: lists[key].state, prev: lists[key].prevstate }),
            });
            let newkey = subscribeTo(tag, toBig(data.state), toBig(data.prevstate));
            switchTo(newkey);
            showNotice(`Shared as #${tag}`);
        } catch (e) {
            showError(e.message);
        }
    }
    const removeTag = (key) => {
        const tag = lists[key] ? lists[key].tag : undefined;
        setLists((lsts)=>({ ...lsts, [key]: { ...lsts[key], tag: undefined } }));
        switchTo('all');
        if (tag) showNotice(`Unlinked #${tag} (kept locally)`);
    }
    const ChecklistWithTitle = () => {
        const current = lists[lists.__current] ?? lists.all;
        return (<><div className={styles.titlebar}>
            <h1 className={styles.title}>FA Checkpoint: <VscChecklist className={styles.icon} /> {current.name}</h1>
         </div><Checklist 
            settings={settings} 
            sync={sync} 
            reset={reset} 
            lists={lists} 
            toggleCurrent={toggleCurrent} 
            isCurrent={isCurrent} 
             isPrevious={isPrevious} 
             branchOff={branchOff} 
             showNotice={showNotice} 
             showError={showError} 
             />
       </>);
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.appbody}>
            
            <Router future={{
                v7_relativeSplatPath: true,
                v7_startTransition: true,
            }}>
            <SideBar lists={lists} switchTo={switchTo} clearState={clearLists}/>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/yesno" element={<YesNoDialog />} />
                    <Route path="/settings" element={<Settings settings={settings} setSettings={setSettings} clearState={clearLists}/>} />
                    <Route path="/checkpoint" element={<ChecklistWithTitle />} />
                    <Route path="/cloud" element={<RegisterCloud  removeTag={removeTag} settings={settings} sync={sync} lists={lists} delCheckpoint={delCheckpoint} subscribeTo={subscribeTo} switchTo={switchTo} showError={showError} showNotice={showNotice} />} />
                    <Route path="/share" element={<ShareCheckpoint lists={lists} switchTo={switchTo} share={share} />} />
                    <Route path="/newcheckpoint" element={<CreateCheckpoint lists={lists} switchTo={switchTo} createCheckpoint={createCheckpoint} showNotice={showNotice} showError={showError} />} />
                    <Route path="/managecheckpoints" element={<DeleteCheckpoints renameCheckpoint={rename}  switchTo={switchTo}  lists={lists} removeCheckpoint={delCheckpoint}/>} />
                </Routes>
            </Router>
            <Toast toast={toast} onDismiss={()=>setToast(null)} />
            </div>
        </div>
    );
}
export default ChecklistApp;