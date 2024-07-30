import { useState } from 'react'
import KitchenSink from './KitchenSink'
import './index.css';
import './App.css'

function App() {
 
  return (
    <>
     <div id="App">
    <h1 className="text-3xl flex relative py-3 px-2">
    Fabric.js demos <p className='font-bold px-1 '>· Kitchensink</p>
    </h1>
     <KitchenSink />
     </div>
    </>
  )
}

export default App
