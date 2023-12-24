import { useDrag } from "react-dnd";




const Note = ({id,text}) => {

    function getId(){
        localStorage.setItem('id',id);
        console.log( localStorage.getItem('id'));
    }

    const [{isDragging},drag]= useDrag(()=> ({
        type:"note",
        item: {id: id},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    return (  
    <div className="note" id={id} ref={drag} >
       <button className="deletenote" onClick={getId}><p> X </p> </button>
       <button className="notebutton"> <p> {text} </p> </button>
    </div>
    );
}
 
export default Note;
