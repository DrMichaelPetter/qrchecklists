
import { useEffect,useState } from "react";

const RegisterCloud = ({lists,switchTo}) => {
    // obtain from currently https://www2.in.tum.de/~petter/webservice/
    const [servertags,setServertags] = useState([]);

    useEffect(() => {
        const responseToList = (jsondata) => {
            const response = JSON.parse(JSON.stringify(jsondata));
            let conv =  Object.keys(response)
                .map((key)=> {
                return response[key].tag
            });
            return conv;
        }
    
        const initialList = () => {
            fetch('https://www2.in.tum.de/~petter/webservice/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                setServertags(responseToList(data));
            });
        };
    
        initialList();
    },[]);

return (<><h1>Cloud Checkpoints</h1>
    <ul>{
         servertags.map((tag) => <li key={tag} onClick={()=>{switchTo(tag)}}>{tag}</li>)
    }</ul></>);
}
export default RegisterCloud;