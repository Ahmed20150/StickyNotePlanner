import logo from './logo.svg';
import './App.css';
import MainPage from './MainPage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
    <div className='App'>
      <MainPage />
    </div>
    </DndProvider>
  );
}

export default App;
