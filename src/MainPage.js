import React, { useEffect,useRef } from 'react';
import { useState } from "react";
import { useDrop } from 'react-dnd';
// import Note from "./Note";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDrag } from "react-dnd";
// import { DndContext, closestCenter } from '@dnd-kit/core';
// import {arrayMove, SortableContext, horizontalListSortingStrategy} from '@dnd-kit/sortable';





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
  let[universalScore,setUniversalScore] = useState(0);
  // let[deletedNotes, setDeletedNotes]= useState(0);
  
  let [NoteListB, setNotes] = useState([  //Only the frontend/visual for the Note itself
    // { id: 1, text: "T1" },
    // { id: 2, text: "T2" },
    // { id: 3, text: "T3" },
  ]);
  
  let [boardB, setBoard] = useState([]);  //Only the frontend/visual for the board itself

  const [isVisible, setIsVisible] = useState(false); //visibility of edit menu
  const [isVisible2, setIsVisible2] = useState(false); //visibility of creating a new note menu 
  const [searchVisible, setSearchVisible] = useState(false); //visibility of search bar 

  const[noteText, setNoteText]= useState(''); //text of the note
  const[noteScore, setNoteScore]= useState(0); //score of the note

  


  const Note = ({ id, text, index, score }) => {           //NOTE OBJECT

    function deleteNote() {
      localStorage.setItem('deletedId', id);
      // setDeletedNotes(deletedNotes+1);

      const biggerList= NoteListA.filter(note => note.id > id); //all ids bigger
      const smallerList= NoteListA.filter(note => note.id < id); //all ids smaller

      if( (boardA.filter((note) => id === note.id) ).length===1){

        const updatedBoard= boardA.filter(note => note.id !== id);
        setBoard(updatedBoard);
        boardA=  boardA.filter(note => note.id !== id);

        
        // const biggerBoard= boardA.filter(note => note.id > id); //all ids bigger
        // const smallerBoard= boardA.filter(note => note.id < id); //all ids smaller
  
        // if(biggerBoard.length>0){
        //   biggerBoard.map((note)=> note.id=note.id-1);
        // }
  
        // const updatedBoard = smallerBoard.concat(biggerBoard); 
        // setBoard(updatedBoard); 
        // boardA= updatedBoard;

      }

      if(biggerList.length>0){
        biggerList.map((note)=> note.id=note.id-1);
        // biggerList.map((note)=> note.id=note.id-(1+deletedNotes));
      }

      const updatedList = smallerList.concat(biggerList); 
      setNotes(updatedList); 
      NoteListA= updatedList;

      setUniversalID(universalID-1);



      console.log('bigger:', biggerList);
      console.log('smaller:', smallerList);

      console.log('NoteListA:', NoteListA);
      console.log('NoteListB:', NoteListB);
      console.log('BoardA:', boardA);
      console.log('BoardB:', boardB);
    }


    const toggleVisibility = () => {
      
      setIsVisible(!isVisible);

      if(isVisible===false){
        localStorage.setItem('clickedid', id);
        console.log(localStorage.getItem('clickedid')); 
        // console.log('index:', localStorage.getItem('clickedid')- (1+deletedNotes));
      }
    };

    const updateScore = () => {
   let note =  NoteListA.find(note => note.id === id);
   let noteScore = parseInt(note.score);
   setUniversalScore(universalScore + noteScore);
   deleteNote();
    };



const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag(() => ({
      type: "note",
      item: { id, index, text },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    const [, drop] = useDrop(() => ({
      accept: 'note',
      drop: (item, monitor) => {
        const dragId = item.id; // ID of the dragged note
        const hoverId = id; // ID of the current note (drop target)

        console.log(`Dragged note ID: ${dragId}, Target note ID: ${hoverId}`);
    
        //BOARD DRAGBAILITY
        const dragIndex = boardA.findIndex(note => note.id === dragId);
        const hoverIndex = boardA.findIndex(note => note.id === hoverId);
        if (dragIndex === hoverIndex) {
          return;
        }
        
const newNoteList = [...boardA];


const temp = newNoteList[dragIndex];
newNoteList[dragIndex] = newNoteList[hoverIndex];
newNoteList[hoverIndex] = temp;

boardA = newNoteList;
setBoard(newNoteList);

console.log("NEW BOARD LIST:", boardA);
      },
    }));

    drag(drop(ref));
    
    return (  
    <div className="note" id={id} ref={ref} >
       <button className="deletenote" onClick={deleteNote}> X </button>
       <button className="editnote"  onClick={toggleVisibility}>Edit</button>
       <button className="donenote"  onClick={updateScore}>✔</button>
       <button className="notebutton"> {text} </button>
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

        const mainpage = document.getElementById('mainpage');
          if (mainpage) {
            mainpage.focus();
          }
        
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
        // duplicateNoteMessage();
      }
      else{
        boardA.push(noteTobeAdded[0]);  //EDIT : WAS NOTETOBEADDED[0]
        setBoard((boardB) => [...boardB, noteTobeAdded[0]]);  //try boardA??
        console.log('BoardA:', boardA);
        console.log('BoardB:', boardB);  
  
      }
  }; 

  function generateNote ()  {

    setIsVisible2(!isVisible2);
    const currentScore = noteScore === '' ? 0 : noteScore;
    const newNote = {
      id: universalID, 
      text: noteText,
      score: currentScore,
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
      setUniversalID(1);

    }

    // const duplicateNoteMessage = () => toast("Note already exists in board");

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

  const [inputValue, setInputValue] = useState(''); //For editing Note Text
  const [inputScore, setInputScore] = useState(''); //For editing Note Score

  const handleChange = (event) => {    //for changing/editing Note text
    setInputValue(event.target.value);
  };

  const handleChange3 = (event) => {    //for changing/editing Note Score
    setInputScore(event.target.value);
  };

  const handleChange2 = (event) => {    //for creating new Note with custom text
    setNoteText(event.target.value);
  };

  const handleScoreChange = (event) => {    //for creating new Note with custom text
    setNoteScore(event.target.value);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleText_ScoreChange();
    }
  };

  const handleEnterKeyPress2 = (event) => {
    if (event.key === 'Enter') {
      generateNote();
      toggleVisibility2();
    }
  };

  const handleText_ScoreChange = () => {
    if(inputValue!==''){
    NoteListA[localStorage.getItem('clickedid') - 1].text = inputValue;
    }
    NoteListA[localStorage.getItem('clickedid') - 1].score = inputScore;
    setNotes(NoteListA); 
    setIsVisible(!isVisible);
    setInputValue('');
    setInputScore('');
    };

    const newNoteShortcut = (event) => {  //shortcut for creating a new note
      if (event.ctrlKey && event.key === 'q') {
        event.preventDefault();
        toggleVisibility2();
      }
    };


    const toggleVisibility2 = () => {
      
      setIsVisible2(!isVisible2);

      if(isVisible2===false){
        setNoteText('');
        setNoteScore('');
      }
    };

    const toggleSearchVisibility = () => {
      
      setSearchVisible(!searchVisible);

      if(searchVisible===false){
      setSearchTerm('');
      const container = document.querySelector('.searchbar');
      container.classList.remove('slide-in-blurred-right');
      container.classList.add('slide-in-blurred-left');
      }
    };

    const SortableNoteList = ({ items }) => {
      // const [sortedItems, setSortedItems] = useState(items);
    
      // useEffect(() => {
      //   setSortedItems(items);
      // }, [items]);
    
      const [, drop] = useDrop(() => ({
        accept: "note",
        drop: (item, monitor) => {
          let dragIndex = item.index;
          let hoverIndex = monitor.getItem();



          console.log("dragIndex:", dragIndex);   
          console.log("hoveIndex:", hoverIndex);
    
    
          if (dragIndex === hoverIndex) {
            return;
          }
          

          // const newlist= NoteListA;
          // // const newItems = [...NoteListB];
          // console.log("before NoteListA:", NoteListA);
          // newlist.splice(hoverIndex, 1 , item);
          // newlist.splice(dragIndex, 1, note);
          // console.log("after NoteListA:", NoteListA);

    
          // setNotes(newlist);

        
 
          console.log("NoteListB:", NoteListA);
        },
      }));


      // NoteListA= sortedItems;
    
      return (
        <div ref={drop} className='notelist'>
          {NoteListB.map((note, index) => (
            <Note key={note.id} id={note.id} text={note.text} index={index} moveItem={setNotes} />
          ))}
        </div>
      );
    };
    
    const SortableBoard = ({ items }) => {
      // const [sortedItems, setSortedItems] = useState(items);
    
      // useEffect(() => {
      //   setSortedItems(items);
      // }, [items]);
    
      const [, drop] = useDrop(() => ({
        accept: "note",
        drop: (item, monitor) => {
          let dragIndex = item.index;
          let hoverIndex = monitor.getItem();



          console.log("dragIndex:", dragIndex);   
          console.log("hoveIndex:", hoverIndex);
    
    
          if (dragIndex === hoverIndex) {
            return;
          }
          

          // const newlist= NoteListA;
          // // const newItems = [...NoteListB];
          // console.log("before NoteListA:", NoteListA);
          // newlist.splice(hoverIndex, 1 , item);
          // newlist.splice(dragIndex, 1, note);
          // console.log("after NoteListA:", NoteListA);

    
          // setNotes(newlist);

        
 
          console.log("BoardA:", boardA);
        },
      }));



      // NoteListA= sortedItems;
    
      return (
        <div ref={drop} className='notelist'>
          {boardB.map((note, index) => (
            <Note key={note.id} id={note.id} text={note.text} index={index} moveItem={setBoard} />
          ))}
        </div>
      );
    };



    return ( 
    <div className="mainpage" tabIndex="0" onKeyDown={newNoteShortcut}  >  

    <div className='welcometext'>

      <h1>Welcome!</h1>
      <h2>Arrange your sticky notes!</h2>
      <h2>Total Score : {universalScore}</h2>
      <h3>{localStorage.getItem("notification")}</h3>
      
    </div>

    <div className='menucontainer' style={{border: isVisible ? '1px solid #ccc': 'none',   boxShadow:isVisible ? "0 0 10px rgba(0, 0, 0, 0.2)": "none",   backgroundColor: isVisible ? "#fff" : "transparent"}}>
      
      <div className= 'optionsmenu' style={{ display: isVisible ? 'block' : 'none' , margin: '20px 35px 20px 20px'}}>
      
      
          <div className='input-container'>

            <h2>Edit Note</h2>
            <input type="text" autoFocus onKeyDown={handleEnterKeyPress} placeholder='Note Text' value={inputValue} onChange={handleChange} /> 
            <input type="text" autoFocus onKeyDown={handleEnterKeyPress} placeholder='Note Score' value={inputScore} onChange={handleChange3} />  
            <button onClick={handleText_ScoreChange}>Change</button>
            <button onClick={() => setIsVisible(!isVisible)}>Cancel</button>
          </div>


      </div>

    </div>

    {/* <HotKeys keyMap={{ 'ctrl+n': () => toggleVisibility2 }}> */}
    <div className='newnotemenucontainer'  style={{border: isVisible2 ? '1px solid #ccc': 'none',   boxShadow:isVisible2 ? "0 0 10px rgba(0, 0, 0, 0.2)": "none",   backgroundColor: isVisible2 ? "#fff" : "transparent"
}}>

            <div className= 'newnotemenu' style={{ display: isVisible2 ? 'block' : 'none'   }}>
            <h2>Create New Note</h2>

            <div className='input-container'>
            <input id="newnoteinput"type="text" onKeyDown={handleEnterKeyPress2} placeholder='Note Text' value={noteText} onChange={handleChange2} />
            <input id="newnoteinput"type="text" onKeyDown={handleEnterKeyPress2} placeholder='Note Score' value={noteScore} onChange={handleScoreChange} />
            <button onClick={generateNote}>Create Note</button>
            <button onClick={toggleVisibility2}>Cancel</button>
            </div>
            </div>

      </div>

      {/* </HotKeys> */}

    <div className='searchbarcontainer'> 
    <button onClick={toggleSearchVisibility}>🔍</button>
    <div className='searchbar' style={{ display: searchVisible ? 'block' : 'none' , margin: '20px 35px 20px 20px'  }}>
    <input
        type="text"
        placeholder="Search..."
        id="search"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button onClick={clearSearchtext}> Clear</button>
    </div>
    </div>

    
      <div className='notelist'>
        {/* {NoteListB.map((note) => {
          return <Note id={note.id} text={note.text}> </Note>;
        })} */}

        <SortableNoteList />
      </div>

      <div className='Board' ref={drop}>
      {/* {boardB.map((note) => {
          return <Note id={note.id} text={note.text} /> ;
        })} */}
        <SortableBoard />
         
      </div>
      
      <ToastContainer />

      <div className='button'>
     <button onClick={toggleVisibility2}>Add New Note </button>
     <button onClick={emptyBoard}>Empty Board</button>
     <button onClick={resetNotes}>Reset Notes</button>
      </div>

    </div>  
      );
}
 
export default MainPage;
