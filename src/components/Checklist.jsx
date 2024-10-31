import RegisterPerson from 'components/RegisterPerson';
import PersonList from 'components/PersonList';
import { useState,useEffect } from 'react';
import { BsCloudUpload } from 'react-icons/bs';
import styles from 'styles/Checklist.module.css';

const sortPeople = (a,b) => {
    if (a.hof < b.hof) return -1;
    if (a.hof > b.hof) return 1;

    if (a.kurs < b.kurs) return -1;
    if (a.kurs > b.kurs) return 1;

    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}

const Checklist = () => {
    const [people,setPeople] = useState([]);
    const [checked,setChecked] = useState(0n);
    useEffect(() => {
        let ignore = false;
        if (!ignore){
            if (!(people.length === 0)) return;
            fetch('./teilnehmer.csv').then(response => response.text()).then(text => {
                //console.log('loaded csv '+ text);
                const rows = text.split('\n');
                var i=0;
                var acc = [];
                rows.slice(1).forEach(row => {
                    const columns = row.split(',');
                    if (columns.length === 5) {
                        i++;
                        acc.push({key:parseInt(i),name:columns[0]+" "+columns[1],hof:columns[3],kurs:parseInt(columns[4]),checked:false});
                    }
                });
                acc=acc.sort(sortPeople);
                setPeople(acc);
            });
        }
        console.log("Initializing people") ;
        return () => { ignore = true; };
    },[]);
    const handleChange = (key) => {
        /* global BigInt */
        setChecked(checked ^ (1n<<BigInt(key))); // toggle implementation
        //console.log(checked);
        setPeople(prevPeople => {
            return prevPeople.map(person => {
                if (person.key === key) {
                    return {
                        ...person,
                        checked: !person.checked
                    };
                }
                return person;
            });
        })};
    const lists = (mypeople) => {
        let hofmap = mypeople.map((person) => (person.hof)).reduce((acc, val) => ({...acc, [val]: (acc[val] || 0) + 1}), {});
        let hoefe = Object.keys(hofmap).sort().map((key) => (
            <PersonList checked={checked} personProps={mypeople.filter((peep)=>(peep.hof===key))} handleChange={handleChange} />    
        ));
        return (<>{hoefe}</>);
    };
    return (
        <>
        <div className={styles.listslayout}>
        <button className={styles.btn}><BsCloudUpload /></button>
        <RegisterPerson handleChange={handleChange} people={people} />
        </div>
        <div className={styles.listslayout}>
        <PersonList checked={checked} personProps={people.filter(peopl => peopl.checked)} handleChange={handleChange} />
        <div>
        {
            lists(people.filter(peopl => !peopl.checked))
        }
        </div>
        </div>
        </>
    );
}
export default Checklist;