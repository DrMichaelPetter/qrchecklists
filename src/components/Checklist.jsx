import RegisterPerson from 'components/RegisterPerson';
import PersonList from 'components/PersonList';
import { useState,useEffect } from 'react';
import styles from 'styles/Checklist.module.css';
import { FaChevronUp, FaRegClone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useOnlineStatus from './OnlineStatus.component';
import { GrUserNew } from 'react-icons/gr';
import InstaName from './InstaName.component';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { BsClipboardPlus } from 'react-icons/bs';
import { MdRefresh } from 'react-icons/md';
import { FiShare2 } from 'react-icons/fi';



const sortPeople = (a,b) => {
    if (a.hof < b.hof) return -1;
    if (a.hof > b.hof) return 1;

    if (a.kurs < b.kurs) return -1;
    if (a.kurs > b.kurs) return 1;

    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}

const GoTop = (props) => {
    return (
        <div className={props.showGoTop} onClick={props.scrollUp}>
        <button className={styles.goTop} >
          <FaChevronUp  className={styles.goTop_text} />
        </button>
      </div>
    );
}
const HofNav = ({people}) => {
    const hoefe = [...new Set(people.map(item => item.hof.length>0?item.hof:"Orga"))].sort();
    return (
        <ul className={styles.hofnav}>
            {
                hoefe.map((hof) => (
                    <li key={hof} ><button className={styles.hofbutton} onClick={() => document.getElementById(hof).scrollIntoView({ behavior: 'smooth' })}>{hof.slice(0,4)}...</button></li>
                ))
            }
        </ul>
    );
}
const Checklist = ({reset,isCurrent,isPrevious,lists,toggleCurrent,branchOff,sync,settings}) => {
    const [people,setPeople] = useState([]);
    const Breadcrumbbar = () => {
        const onlineStatus = useOnlineStatus();
        return (<nav className={styles.navbar}>
            <button className={styles.btn} onClick={()=>reset()}><GrUserNew /></button>
            <Link to="/newcheckpoint" state={{prev: lists.__current}}><div className={styles.btn}><FaRegClone /> <IoMdArrowRoundForward className={styles.add}/> <BsClipboardPlus /></div></Link>
            {false&&<div className={styles.btn}><InstaName branchOff={branchOff} pred={lists.__current} /></div>}
            <div className={styles.breadcrumbspacer}></div>
            {(lists[lists["__current"]].tag !== undefined) && <button className={styles.btn} disabled={!onlineStatus} onClick={()=>{sync(lists["__current"]);}}><MdRefresh /></button>}
            {(lists[lists["__current"]].tag === undefined) && <Link to="/share" state={{prev: lists.__current}}><div className={styles.btn} disabled={!onlineStatus}><FiShare2 /></div></Link>}
        </nav>);
    }
    useEffect(() => {
        let ignore = false;
        if (!ignore){
            if (!(people.length === 0)) return;
            fetch('./teilnehmer.csv').then(response => response.text()).then(text => {
                const rows = text.split('\n');
                var i=0;
                var acc = [];
                rows.slice(1).forEach(row => {
                    const columns = row.split(',');
                    if (columns.length === 5) {
                        i++;
                        acc.push({key:parseInt(i),
                                  intPersonID:parseInt(columns[2]),
                                  name:columns[1]+", "+columns[0],
                                  hof:columns[3],
                                  kurs:parseInt(columns[4]),
                                  checked:false});
                    }
                });
                acc=acc.sort(sortPeople);
                setPeople(acc);
            });
        }
        return () => { ignore = true; };
    },[people.length]);
    const handleChangeByID = (id) => {
        const person = people.find((person) => person.intPersonID === id);
        if (person) {
            toggleCurrent(person.key);
        }
    }
    const handleChange = (key) => {
        toggleCurrent(key);
    };
    const personlists = (mypeople) => {
        let hofmap = mypeople.map((person) => (person.hof)).reduce((acc, val) => ({...acc, [val]: (acc[val] || 0) + 1}), {});
        let hoefe = Object.keys(hofmap).sort().map((key) => (
            <PersonList label={key.length>0?key:"Orga"} key={key} chosen={false} isCurrent={isCurrent} checked={lists[lists.__current].state} personProps={mypeople.filter((peep)=>(peep.hof===key))} handleChange={handleChange} />    
        ));
        return (<>{hoefe}</>);
    };

    return (
        <>
        <Breadcrumbbar />
        <RegisterPerson settings={settings} isCurrent={isCurrent} handleChange={handleChangeByID} people={people} />
        <div className={styles.listslayout}>
        </div>
        <div className={styles.listslayout}>
        <PersonList label="Checked" isCurrent={isCurrent} chosen={true} personProps={people.filter(peopl => isCurrent(peopl.key)).map(person=>({...person,"highlighted":!(isPrevious(person.key)>0)}))} handleChange={handleChange} />
        <div>
        <HofNav people={people} />
        {
            personlists(people.filter(peopl => !isCurrent(peopl.key) && isPrevious(peopl.key)).map(person=>({...person,"highlighted":false})))
        }
        </div>
        </div>
        <GoTop showGoTop={styles.goTop} scrollUp={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        </>
    );

}
export default Checklist;