import Checklist from 'components/Checklist';
import SideBar from 'components/Sidebar';
import { useEffect,useState } from 'react';
import styles from 'styles/ChecklistApp.module.css';

const ChecklistApp = () => {


    /* global BigInt */
    var [mapping, setMapping] = useState([]);

    var [lists, setLists] = useState({ __current: 'test' ,
        all:   { name: 'all',        state: 1n  }, 
        test:  { name: 'testname',   state: 0n, prev: 'all', prevstate: 1n }
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
        setMapping(data);
//        const state = (1n << BigInt(data.length)) -1n;
        const state = 16n-1n;
        setLists({ ...lists, all: {name: 'all' , state: state} });

        });

       
    }, []);

    const switchTo = (key) => {
        setLists((lsts)=>({ ...lsts, __current: key }));
    }

    const branchOff = (newname,key) => {
        let newkey = createCheckpoint(newname,key);
        switchTo(newkey);
        return newkey;
    }

    const toggleCurrent = (key) => {
        setLists((l)=> ({ ...l, [l.__current]: { ...l[lists.__current], state: l[lists.__current].state ^ (1n << BigInt(key-1)) } }));
    }
    const isCurrent = (key) => {
        return lists[lists.__current].state & (1n << BigInt(key-1));
    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.appbody}>
            <SideBar lists={lists} switchTo={switchTo} /><h1 className={styles.title}>FA Checkmarks</h1>
            <Checklist lists={lists} toggleCurrent={toggleCurrent} isCurrent={isCurrent} switchTo={switchTo} branchOff={branchOff} />
            </div>
        </div>
    );
}
export default ChecklistApp;