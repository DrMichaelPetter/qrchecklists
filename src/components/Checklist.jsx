import RegisterPerson from 'components/RegisterPerson';
import PersonList from 'components/PersonList';
import { useState } from 'react';

const Checklist = () => {
    const [people,setPeople] = useState([
        {
            key:1,
            name: 'Michael Petter',
            hof: 'Murrerhof',
            kurs: 1,
            checked: false,
        },
        {
            key:2,
            name: 'Tobias Neckel',
            hof: 'Alpenblick',
            kurs: 2,
            checked: false,
        },
        {
            key:3,
            name: 'Julia Pelzer',
            hof: 'Alpenblick',
            kurs: 4,
            checked: false,
        },
        {
            key:4,
            name: 'Thomas Zeiser',
            hof: 'Rabensteinerhof',
            kurs: 5,
            checked: false,
        },
        {
            key:5,
            name: 'Marc Windsheimer',
            hof: 'Feldrand',
            kurs: 3,
            checked: false,
        },
    ]);
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
        <RegisterPerson handleChange={handleChange} />
        <PersonList personProps={people} handleChange={handleChange} />
        </>
    );
}
export default Checklist;