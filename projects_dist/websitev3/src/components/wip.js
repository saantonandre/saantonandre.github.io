import {useState} from "react";
const Wip = () =>{
    const [hidden, setHidden] = useState(false);
    return (
        <div style={{cursor:"pointer"}} className={`position-fixed start-0 bottom-0 ${hidden && "d-none"}`} onClick={()=>setHidden(true)}>
            <img style={{height:"128px"}} src="/images/wip.gif" alt="work in progress icon"/>
        </div>
    )
}
export default Wip;