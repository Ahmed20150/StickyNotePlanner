import React, { useEffect } from 'react';
import { useState } from "react";
import { useDrop } from 'react-dnd';
// import Note from "./Note";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDrag } from "react-dnd";


//TESTING MAIN BRANCH
let NoteListA = [  //Actual List of Notes
  // {
  //   id: 1,
  //   text: "T1",
  // },
  // {
  //   id: 2,
  //   text: "T2",
  // },
  // {
  //   id: 3,
  //   text: "T3",
  // },
];

let boardA = [];  //Actual List for the Board


const MainPage= () => {

  let[universalID,setUniversalID] = useState(1);
  // let[deletedNotes, setDeletedNotes]= useState(0);
  
  let [NoteListB, setNotes] = useState([  //Only the frontend/visual for the Note itself
    // { id: 1, text: "T1" },
    // { id: 2, text: "T2" },
    // { id: 3, text: "T3" },
  ]);
  
  let [boardB, setBoard] = useState([]);  //Only the frontend/visual for the board itself

  const [isVisible, setIsVisible] = useState(false);

  


  const Note = ({id,text}) => {           //NOTE OBJECT

    function deleteNote() {
      localStorage.setItem('deletedId', id);
      // setDeletedNotes(deletedNotes+1);
      setUniversalID(universalID-1);

      const biggerList= NoteListA.filter(note => note.id > id); //all ids bigger
      const smallerList= NoteListA.filter(note => note.id < id); //all ids smaller

      if(biggerList.length>0){
        biggerList.map((note)=> note.id=note.id-1);
        // biggerList.map((note)=> note.id=note.id-(1+deletedNotes));

      }

      const updatedList = smallerList.concat(biggerList); 
      setNotes(updatedList); 
      NoteListA= updatedList;


      console.log('bigger:', biggerList);
      console.log('smaller:', smallerList);

      if( (boardA.filter((note) => id === note.id) ).length===1){

        const updatedBoard= boardA.filter(note => note.id !== id);
        boardA=  boardA.filter(note => note.id !== id);
        setBoard(updatedBoard);

        
        // const biggerBoard= boardA.filter(note => note.id > id); //all ids bigger
        // const smallerBoard= boardA.filter(note => note.id < id); //all ids smaller
  
        // if(biggerBoard.length>0){
        //   biggerBoard.map((note)=> note.id=note.id-1);
        // }
  
        // const updatedBoard = smallerBoard.concat(biggerBoard); 
        // setBoard(updatedBoard); 
        // boardA= updatedBoard;

      }

      console.log('NoteListA:', NoteListA);
      console.log('NoteListB:', NoteListB);
      console.log('BoardA:', boardA);
      console.log('Boardb:', boardB);
    }


    const toggleVisibility = () => {
      
      setIsVisible(!isVisible);

      if(isVisible===false){
        localStorage.setItem('clickedid', id);
        console.log(localStorage.getItem('clickedid')); 
        // console.log('index:', localStorage.getItem('clickedid')- (1+deletedNotes));
      }
    };

    const [{isDragging},drag]= useDrag(()=> ({
        type:"note",
        item: {id: id},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    return (  
    <div className="note" id={id} ref={drag} >
       <button className="deletenote" onClick={deleteNote}><p> X </p> </button>
       <button className="editnote"  onClick={toggleVisibility}>Edit</button>
       <button className="notebutton"><p> {text} </p> </button>
    </div>
    );
}


 useEffect(() => {
        const element = document.querySelector('.welcometext');
        element.classList.add('slide-in-blurred-top');
        
        document.body.classList.add('home-page');

        const element2 = document.querySelector('.Board');
        element2.classList.add('swing-in-top-fwd');
        
        document.body.classList.add('home-page');
        
        return () => {
          element.classList.remove('slide-in-blurred-top');
          document.body.classList.remove('home-page');
          element.classList.remove('slide-in-blurred-top');
          document.body.classList.remove('home-page');
        
        };
      }, []);



  localStorage.setItem("notification","");
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "note",
    drop: (item) => addNoteToBoard(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addNoteToBoard = (id) => {

      const noteTobeAdded = NoteListA.filter((note) => id === note.id);
      if(boardA.includes(noteTobeAdded[0])){
        duplicateNoteMessage();
      }
      else{
        boardA.push(noteTobeAdded[0]);  //EDIT : WAS NOTETOBEADDED[0]
        setBoard((boardB) => [...boardB, noteTobeAdded[0]]);  //try boardA??
        console.log('BoardA:', boardA);
        console.log('BoardB:', boardB);  
  
      }
  }; 

  function generateNote ()  {
    const newNote = {
      id: universalID, 
      text: "T"+(universalID),
    };

    setUniversalID(universalID+1);
        
    setNotes([...NoteListB, newNote]);

  
    NoteListA.push(newNote);

    localStorage.setItem("notifcation", "New Note Added");
    console.log(localStorage.getItem("notifcation"));
    console.log("Updated NoteListA:", NoteListA); 
    console.log("Updated NoteListB:", NoteListB); 

    }

    function emptyBoard(){
      boardA=[];
      boardB= setBoard([]);
      console.log(boardA);
    }

    function resetNotes(){

      const initialNotes = [
        // { id: 1, text: "T1" },
        // { id: 2, text: "T2" },
        // { id: 3, text: "T3" },
      ];
      emptyBoard();
      setNotes( initialNotes );
      NoteListA= initialNotes;

    }

    const duplicateNoteMessage = () => toast("Note already exists in board");

    const DraggableList = ({ notes }) => {
      const [listItems, setListItems] = useState(notes);
    
      const moveItem = (fromIndex, toIndex) => {
        const updatedItems = [...NoteListA];
        const [movedItem] = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, movedItem);
        setListItems(updatedItems);
      };
    };


  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filteredNotes = NoteListA.filter(note =>
      note.text.toLowerCase().includes(term)
    );

    const filteredBoard = boardA.filter(note =>
      note.text.toLowerCase().includes(term)
    );

    setBoard(filteredBoard);
    setNotes(filteredNotes);
  };

  function clearSearchtext(){
    setSearchTerm('');
    // setBoard(boardA);
    // setNotes(NoteListA);
  }

  const [inputValue, setInputValue] = useState('');
  const handleChange = (event) => {    //for changing Note text
    setInputValue(event.target.value);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleTextChange();
    }
  };

  const handleTextChange = () => {
    NoteListA[localStorage.getItem('clickedid') - 1].text = inputValue;
    setNotes(NoteListA); 
    setIsVisible(!isVisible);
    setInputValue('');
    };

    

    return ( 
    <div className="mainpage">  

    <div className='welcometext'>

      <h1>Welcome!</h1>
      <h2>Arrange your sticky notes!</h2>
      <h3>{localStorage.getItem("notification")}</h3>
      
    </div>

    <div className='menucontainer'>
      
      <div className= 'optionsmenu' style={{ display: isVisible ? 'block' : 'none' , margin: '20px 35px 20px 20px'}}>
            <input type="text" onKeyDown={handleEnterKeyPress} placeholder='Note Text' value={inputValue} onChange={handleChange} />  
            <button onClick={handleTextChange}>Change Text</button>

      </div>

    </div>

    <div className='searchbar'>
    <input
        type="text"
        placeholder="Search..."
        id="search"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button onClick={clearSearchtext}> Clear</button>
    </div>

    
      <div className='notelist'>
        {NoteListB.map((note) => {
          return <Note id={note.id} text={note.text}> </Note>;
        })}
      </div>

      <div className='Board' ref={drop}>
      {boardB.map((note) => {
          return <Note id={note.id} text={note.text} /> ;
        })}
         
      </div>
      
      <ToastContainer />

      <div className='button'>
     <button onClick={generateNote}>Add New Note </button>
     <button onClick={emptyBoard}>Empty Board</button>
     <button onClick={resetNotes}>Reset Notes</button>
      </div>

    </div>  
      );
}
 
export default MainPage;
