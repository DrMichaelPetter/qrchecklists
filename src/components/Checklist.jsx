import RegisterPerson from 'components/RegisterPerson';
import PersonList from 'components/PersonList';
import { useState,useEffect } from 'react';

const Checklist = () => {
    const [people,setPeople] = useState([]);
    useEffect(() => {
        let ignore = false;
        if (!ignore){
            setPeople(a => [...a,{key:1,name:'Michael Petter',hof:'Murrerhof',kurs:1,checked:false}]);
            setPeople(a => [...a,{key:2,name:'Tobias Neckel',hof: 'Alpenblick',kurs: 2,checked: false}]);
            setPeople(a => [...a,{key:3,name:'Julia Pelzer',hof: 'Alpenblick',kurs: 4,checked: false}]);
            setPeople(a => [...a,{key:4,name:'Thomas Zeiser',hof: 'Rabensteinerhof',kurs: 5,checked: false}]);
            setPeople(a => [...a,{key:5,name:'Marc Windsheimer',hof: 'Feldrand',kurs: 3,checked: false}]);
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