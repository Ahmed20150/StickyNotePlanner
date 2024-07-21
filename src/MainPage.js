import React, { useEffect,useRef } from 'react';
import { useState } from "react";
import { useDrop } from 'react-dnd';
// import Note from "./Note";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDrag } from "react-dnd";
import html2canvas from 'html2canvas';
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
  let[universalGoal,setUniversalGoal] = useState(0);
  // let[deletedNotes, setDeletedNotes]= useState(0);
  
  let [NoteListB, setNotes] = useState([  //Only the frontend/visual for the Note itself
    // { id: 1, text: "T1" },
    // { id: 2, text: "T2" },
    // { id: 3, text: "T3" },
  ]);
  
  let [boardB, setBoard] = useState([]);  //Only the frontend/visual for the board itself

  const [isVisible, setIsVisible] = useState(false); //visibility of edit menu
  const [isVisible2, setIsVisible2] = useState(false); //visibility of creating a new note menu
  const [isVisible3, setIsVisible3] = useState(false); //visibility of Milestone menu  
  const [searchVisible, setSearchVisible] = useState(false); //visibility of search bar 

  const[noteText, setNoteText]= useState(''); //text of the note
  const[noteScore, setNoteScore]= useState(0); //score of the note

  
   const  handleDownloadImage = async () => {
    const element = document.getElementById('board'),
    canvas = await html2canvas(element),
    data = canvas.toDataURL('image/jpg'),
    link = document.createElement('a');

    link.href = data;
    link.download = 'Your-Board.jpg';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
   if(universalScore>=universalGoal){
      toast.success("Congratulations! You have reached your goal!");
      console.log("CONGRATS");
   }
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
  const [inputScore, setInputScore] = useState(0); //For editing Note Score

  const handleChange = (event) => {    //for changing/editing Note text
    setInputValue(event.target.value);
  };

  const handleChange3 = (event) => {    //for changing/editing Note Score
    if(event.target.value!==''){
    setInputScore(event.target.value);
  }
  };

  const handleChange2 = (event) => {    //for creating new Note with custom text
    setNoteText(event.target.value);
  };

  const handleChange4 = (event) => {    //for editing milestone score
    setUniversalGoal(event.target.value);
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

    const toggleVisibility3 = () => {
      
      setIsVisible3(!isVisible3);
      setUniversalGoal(0);

      if(isVisible3===false){
        setNoteText('');
        setNoteScore('');
      }
    };

    const saveMilestone = () => {
      
      setIsVisible3(!isVisible3);

      if(isVisible3===false){
        setNoteText('');
        setNoteScore('');
      }
    };

    const toggleSearch = () => setSearchVisible(!searchVisible);




    const SortableNoteList = ({ items }) => {

    
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

    useEffect(() => {
      if (universalScore >= universalGoal && universalGoal!=0) {
        toast.success("Congratulations! You have reached your goal!");
        console.log("CONGRATS");
      }
    }, [universalScore, universalGoal]);

    return ( 
    <div className="mainpage" tabIndex="0" onKeyDown={newNoteShortcut}  >  

    <div className='welcometext'>
      <ToastContainer/>

      


      <h1>Welcome!</h1>
      <h2>Arrange your sticky notes!</h2>
      <h3>{localStorage.getItem("notification")}</h3>
      
    </div>

    <div className='scoreText'>
    <h2> Your Score : {universalScore}</h2>
    <h2>Your Goal : {universalGoal}</h2>
    </div>

    <div className='menucontainer' style={{border: isVisible ? '1px solid #ccc': 'none',   boxShadow:isVisible ? "0 0 10px rgba(0, 0, 0, 0.2)": "none",   backgroundColor: isVisible ? "#fff" : "transparent"}}>
      
    <div className= 'card' style={{ display: isVisible ? 'block' : 'none'   }}>
      
      
          <div className='input-container'>

            <h2 style={{ marginLeft: "50px"}}>Edit Your Note</h2>

            <div className='input-container'>
            <div class="inputBox">
            <span>Note Text :</span>
            <input id="newnoteinput" type="text" onKeyDown={handleEnterKeyPress} placeholder="Write here..." value={inputValue} onChange={handleChange} required="" />
            </div>
            </div>

            <div className='input-container'>
            <div class="inputBox">
            <span>Note Score :</span>
            <input id="newnoteinput" type="text" onKeyDown={handleEnterKeyPress} placeholder="Write here..." value={inputScore} onChange={handleChange3} required="" />
            </div>
            </div>

            {/* <input type="text" autoFocus onKeyDown={handleEnterKeyPress} placeholder='Note Text' value={inputValue} onChange={handleChange} />  */}
            {/* <input type="text" autoFocus onKeyDown={handleEnterKeyPress} placeholder='Note Score' value={inputScore} onChange={handleChange3} />   */}
            <button className='card__button' onClick={handleText_ScoreChange}>Change</button>
            <button className='card__button' onClick={() => setIsVisible(!isVisible)}>Cancel</button>
          </div>

          

      </div>

    </div>

    {/* <HotKeys keyMap={{ 'ctrl+n': () => toggleVisibility2 }}> */}
    <div className='newnotemenucontainer'  style={{border: isVisible2 ? '1px solid #ccc': 'none',   boxShadow:isVisible2 ? "0 0 10px rgba(0, 0, 0, 0.2)": "none",   backgroundColor: isVisible2 ? "#fff" : "transparent"
}}>

            <div className= 'card' style={{ display: isVisible2 ? 'block' : 'none'   }}>
            <h2>Create New Note</h2>

            <div className='input-container'>
            <div class="inputBox">
            <span>Note Text :</span>
            <input id="newnoteinput" type="text" onKeyDown={handleEnterKeyPress2} placeholder="Write here..." value={noteText} onChange={handleChange2} required="" />
            </div>
            <div class="inputBox">
            <span>Note Score :</span>
            <input id="newnoteinput"type="text" onKeyDown={handleEnterKeyPress2} placeholder='Note Score' value={noteScore} onChange={handleScoreChange} />
            </div>
            {/* <input id="newnoteinput"type="text" onKeyDown={handleEnterKeyPress2} placeholder='Note Text' value={noteText} onChange={handleChange2} />
            <input id="newnoteinput"type="text" onKeyDown={handleEnterKeyPress2} placeholder='Note Score' value={noteScore} onChange={handleScoreChange} /> */}
            <button onClick={generateNote} className='card__button'>Create Note</button>
            <button onClick={toggleVisibility2} className='card__button'>Cancel</button>
            </div>
            </div>

      </div>

      <div className='newnotemenucontainer'  style={{border: isVisible3 ? '1px solid #ccc': 'none',   boxShadow:isVisible3 ? "0 0 10px rgba(0, 0, 0, 0.2)": "none",   backgroundColor: isVisible3 ? "#fff" : "transparent"
}}>

            <div className= 'card' style={{ display: isVisible3 ? 'block' : 'none'   }}>
            <h2>Edit your Milestone</h2>

            <div className='input-container'>
            <div class="inputBox">
            <span>Milestone Score :</span>
            <input id="newnoteinput" type="text" onKeyDown={handleEnterKeyPress2} placeholder="Write here..." value={universalGoal} onChange={handleChange4} required="" />
            </div>
            <button onClick={saveMilestone} className='card__button'>Save Milestone</button>
            <button onClick={toggleVisibility3} className='card__button'>Cancel</button>
            </div>
            </div>

      </div>

      {/* </HotKeys> */}
    <div className='searchbarcontainer'> 
    <button onClick={toggleVisibility3} className="menuButton">Edit Milestone</button>
    <button onClick={toggleSearch} className="menuButton">🔍</button>
 

    <div class="input-container" style={{ display: searchVisible ? 'block' : 'none'}}>
  <input type="text" name="text" class="input" placeholder="Search..." id="search"
        value={searchTerm}
        onChange={handleSearch} style={{ display: searchVisible ? 'block' : 'none'}}  />
  <span class="icon" > 
    <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="1" d="M14 5H20" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="1" d="M14 8H17" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path> <path opacity="1" d="M22 22L20 20" stroke="#000" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  </span>
</div>

{/* 
    <div className='searchbar' style={{ display: searchVisible ? 'block' : 'none' , margin: '20px 35px 20px 20px'  }}>
    <input
        type="text"
        placeholder="Search..."
        id="search"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button onClick={clearSearchtext}> Clear</button>
    </div> */}




    </div>

    
      <div className='notelist'>
        {/* {NoteListB.map((note) => {
          return <Note id={note.id} text={note.text}> </Note>;
        })} */}

        <SortableNoteList />
      </div>

      <div className='Board' ref={drop} id="board">
      {/* {boardB.map((note) => {
          return <Note id={note.id} text={note.text} /> ;
        })} */}
        <SortableBoard />
         
      </div>
      


      <div className='button'>
     <button onClick={toggleVisibility2} className='menuButton'>New Note </button>
     <button onClick={emptyBoard} className='menuButton'>Empty Board</button>
     <button onClick={resetNotes} className='menuButton'>Reset Notes</button>
     <button onClick={handleDownloadImage} className='menuButton'>Download Board</button>
      </div>

    </div>  
      );
}
 
export default MainPage;
