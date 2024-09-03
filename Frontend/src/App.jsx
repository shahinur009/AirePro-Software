import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Events from './components/Events';
import Add from './components/Add';
import Read from './components/Read';
import Update from './components/Update';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Events />}></Route>
          <Route path='/add' element={<Add />}></Route>
          <Route path='/read/:eventId' element={<Read />}></Route>
          <Route path='/update/:eventId' element={<Update />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
