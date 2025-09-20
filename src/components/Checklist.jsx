import RegisterPerson from 'components/RegisterPerson';
import PersonList from 'components/PersonList';
import { useState,useEffect } from 'react';
import styles from 'styles/Checklist.module.css';
import Breadcrumbbar from 'components/Breadcrumbbar.component';

const sortPeople = (a,b) => {
    if (a.hof < b.hof) return -1;
    if (a.hof > b.hof) return 1;

    if (a.kurs < b.kurs) return -1;
    if (a.kurs > b.kurs) return 1;

    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}

const Checklist = ({reset,isCurrent,isPrevious,lists,toggleCurrent,branchOff,sync,settings}) => {
    const [people,setPeople] = useState([]);

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
            <PersonList label={key} key={key} chosen={false} isCurrent={isCurrent} checked={lists[lists.__current].state} personProps={mypeople.filter((peep)=>(peep.hof===key))} handleChange={handleChange} />    
        ));
        return (<>{hoefe}</>);
    };

    return (
        <>
        <Breadcrumbbar reset={reset} lists={lists} branchOff={branchOff} sync={sync} />
        <RegisterPerson settings={settings} handleChange={handleChangeByID} people={people} />
        <div className={styles.listslayout}>
        </div>
        <div className={styles.listslayout}>
        <PersonList label="Checked" isCurrent={isCurrent} chosen={true} personProps={people.filter(peopl => isCurrent(peopl.key)).map(person=>({...person,"highlighted":!(isPrevious(person.key)>0)}))} handleChange={handleChange} />
        <div>
        {
            personlists(people.filter(peopl => !isCurrent(peopl.key) && isPrevious(peopl.key)).map(person=>({...person,"highlighted":false})))
        }
        </div>
        </div>
        </>
    );

}
export default Checklist;