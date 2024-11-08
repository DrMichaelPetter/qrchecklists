import Checklist from 'components/Checklist';
import SideBar from 'components/Sidebar';
import { useEffect,useState } from 'react';
import styles from 'styles/ChecklistApp.module.css';
import { VscChecklist } from "react-icons/vsc";

const ChecklistApp = () => {
    /* global BigInt */
    var [lists, setLists] = useState({ __current: 'all' ,
        all:   { name: 'all', state: 0n, prevstate: 0n },
    });

    const createCheckpoint = (newcheckpointname, lastcheckpointkey) => {
        let newkey = Math.random().toString(36).substring(7);
        setLists((lsts)=> ({ ...lsts, 
            [newkey]: { 
                name: newcheckpointname, 
                state: 0n, 
                prevstate: lsts[lsts.__current].state,
                prev: lsts.__current }
        }));
        return newkey;
    };

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
            }

        }
        fetchData().then((data) => {
            const state = (1n << BigInt(data.length)) -1n;
            setLists((lsts)=>({ ...lsts, all: {name: 'all' , state: 0n, prevstate: state } }));

        });

       
    }, []);

    const switchTo = (key) => {
        setLists((lsts)=>({ ...lsts, __current: key }));
    }
    const reset = () => {
        setLists((lsts)=>{
            const current = {...lsts[lsts.__current],state:0n};
            return { ...lsts, [lsts.__current]: current };
        });
    }

    const branchOff = (newname,key) => {
        let newkey = createCheckpoint(newname,key);
        switchTo(newkey);
        return newkey;
    }

    const toggleCurrent = (key) => {
        setLists((l)=> ({ ...l, [l.__current]: { ...l[l.__current], state: l[l.__current].state ^ (1n << BigInt(key-1)) } }));
    }
    const isCurrent = (key) => {
        return lists[lists.__current].state & (1n << BigInt(key-1));
    }
    const isPrevious = (key) => {
        return lists[lists.__current].prevstate & (1n << BigInt(key-1));
    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.appbody}>
            <div className={styles.titlebar}>
                <SideBar lists={lists} switchTo={switchTo} />
                <h1 className={styles.title}>FA Checkpoint: <VscChecklist className={styles.icon} /> {lists[lists.__current].name}</h1>
            </div>
            <Checklist reset={reset} lists={lists} toggleCurrent={toggleCurrent} isCurrent={isCurrent} isPrevious={isPrevious} switchTo={switchTo} branchOff={branchOff} />
            </div>
        </div>
    );
}
export default ChecklistApp;