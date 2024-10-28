import RegisterPerson from 'components/RegisterPerson';
import PersonList from 'components/PersonList';
import { useState,useEffect } from 'react';

const Checklist = () => {
    const [people,setPeople] = useState([]);
    useEffect(() => {
        let ignore = false;
        if (!ignore){
            if (!(people.length === 0)) return;
            fetch('./teilnehmer.csv').then(response => response.text()).then(text => {
                console.log('loaded csv '+ text);
                const rows = text.split('\n');
                var i=0;
                rows.slice(1).forEach(row => {
                    const columns = row.split(',');
                    if (columns.length === 5) {
                        i++;
                        setPeople(a => [...a,{key:parseInt(i),name:columns[0]+" "+columns[1],hof:columns[3],kurs:parseInt(columns[4]),checked:false}]);
                        console.log(i);
                    }
                });
            });

//            setPeople(a => [...a,{key:1,name:'Michael Petter',hof:'Murrerhof',kurs:1,checked:false}]);
//            setPeople(a => [...a,{key:2,name:'Tobias Neckel',hof: 'Alpenblick',kurs: 2,checked: false}]);
//            setPeople(a => [...a,{key:3,name:'Julia Pelzer',hof: 'Alpenblick',kurs: 4,checked: false}]);
//            setPeople(a => [...a,{key:4,name:'Thomas Zeiser',hof: 'Rabensteinerhof',kurs: 5,checked: false}]);
//            setPeople(a => [...a,{key:5,name:'Marc Windsheimer',hof: 'Feldrand',kurs: 3,checked: false}]);
        }
        console.log("Initializing people") ;
        return () => { ignore = true; };
    },[]);
    const handleChange = (key) => {
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
    return (
        <>
        <RegisterPerson handleChange={handleChange} people={people} />
        <PersonList personProps={people.filter(peopl => peopl.checked)} handleChange={handleChange} />
        <PersonList personProps={people.filter(peopl => !peopl.checked)} handleChange={handleChange} />
        </>
    );
}
export default Checklist;