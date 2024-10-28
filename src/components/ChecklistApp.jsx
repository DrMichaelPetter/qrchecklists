import Checklist from 'components/Checklist';
import { useEffect,useState } from 'react';

const ChecklistApp = () => {
    var [mapping, setMapping] = useState([]);
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
            console.log(data);
            setMapping(data);
        });
       
    }, []);

    return (
        <div className="wrapper">
            <div className="lists">
            <h1>Ferienakademie-Checklists</h1>
            <p>Die Ferienakademie-Checklists sind Listen um Personen auf FA-Events zu tracken.</p>
            <Checklist mapping={mapping}/>
            </div>
        </div>
    );
}
export default ChecklistApp;