import Checklist from 'components/Checklist';

const ChecklistApp = () => {
    return (
        <div className="wrapper">
            <div className="lists">
            <h1>Ferienakademie-Checklists</h1>
            <p>Die Ferienakademie-Checklists sind Listen um Personen auf FA-Events zu tracken.</p>
            <Checklist/>
            </div>
        </div>
    );
}
export default ChecklistApp;