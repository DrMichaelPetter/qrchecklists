import Checklist from 'components/Checklist';
import SideBar from 'components/Sidebar';
import { useEffect,useState } from 'react';
import styles from 'styles/ChecklistApp.module.css';

const ChecklistApp = () => {
    var [mapping, setMapping] = useState([]);

    var [lists, setLists] = useState({ __current: 'test2' ,
        all:   { name: 'all',        state: 1n  }, 
        test:  { name: 'testname',   state: 0n, prev: 'all' }, 
        test3: { tag:  'testtag',    state: 0n, name: 'testtagname' }, 
        test2: { name: 'testname 2', state: 0n, prev: 'test' } 
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(process.env.PUBLIC_URL+'/teilnehmer.csv');
                const data = await response.text();
                var i = 0;
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
        });
       
    }, []);

    const switchTo = (key) => {
        setLists({ ...lists, __current: key });
    }

    const branchOff = (newname,key) => {
        let newkey = Math.random().toString(36).substring(7);
        setLists({ ...lists, [newkey]: { name: newname, state: 0n, prev: key }, __current: newkey });
        return newkey;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.appbody}>
            <SideBar lists={lists} switchTo={switchTo} /><h1 className={styles.title}>FA Checkmarks</h1>
            <Checklist lists={lists} switchTo={switchTo} branchOff={branchOff} />
            </div>
        </div>
    );
}
export default ChecklistApp;