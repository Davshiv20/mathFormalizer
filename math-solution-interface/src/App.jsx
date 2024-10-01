import React from 'react'
import MathInput from './components/mathInput';
import StructuredSolution from './components/StructuredSolution'
import ConvertButton from './components/ConvertButton'

function App() {
  return (
    <div className="App">
      <h1>Math Solution Interface</h1>
      <MathInput />
      <ConvertButton />
      <StructuredSolution />
    </div>
  )
}

export default App