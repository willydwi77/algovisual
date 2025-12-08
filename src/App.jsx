import SortAlgo from './sort_algo/SortAlgo'
import SearchAlgo from './search_algo/SearchAlgo'
import GraphAlgo from './graph_algo/GraphAlgo'
import TreeAlgo from './tree_algo/TreeAlgo'
import DPAlgo from './dp_algo/DPAlgo'
import BTAlgo from './bt_algo/BTAlgo'
import GreedyAlgo from './greedy_algo/GreedyAlgo'
import StringAlgo from './string_algo/StringAlgo'
import MathAlgo from './math_algo/MathAlgo'
import GeoAlgo from './geo_algo/GeoAlgo'
import { useState } from 'react'
import { BarChart3, Search, Network, GitBranch, BrainCircuit, Undo2, Coins, Type, Calculator, Compass } from 'lucide-react'
import './App.css'

function App() {
  const [activeModule, setActiveModule] = useState('sorting')

  return (
    <>
      <div className='flex flex-col min-h-screen bg-slate-900'>
        {/* COMPACT NAVIGATION BAR */}
        <nav className='sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-2 py-1.5 flex justify-center'>
          <div className='flex gap-1.5 flex-wrap justify-center'>
            <button
              onClick={() => setActiveModule('sorting')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeModule === 'sorting' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <BarChart3 size={16} /> Sorting
            </button>

            <button
              onClick={() => setActiveModule('searching')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeModule === 'searching' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Search size={16} /> Searching
            </button>

            <button
              onClick={() => setActiveModule('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeModule === 'graph' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Network size={16} /> Graph
            </button>

            <button
              onClick={() => setActiveModule('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeModule === 'tree' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <GitBranch size={16} /> Tree
            </button>

            <button
              onClick={() => setActiveModule('dynamic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeModule === 'dynamic' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <BrainCircuit size={16} /> DP
            </button>

            <button
              onClick={() => setActiveModule('backtracking')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeModule === 'backtracking' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Undo2 size={16} /> Backtrack
            </button>

            <button
              onClick={() => setActiveModule('greedy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeModule === 'greedy' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Coins size={16} /> Greedy
            </button>

            <button
              onClick={() => setActiveModule('string')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeModule === 'string' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Type size={16} /> String
            </button>

            <button
              onClick={() => setActiveModule('math')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeModule === 'math' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Calculator size={16} /> Math
            </button>

            <button
              onClick={() => setActiveModule('geometric')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeModule === 'geometric' ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Compass size={16} /> Geometric
            </button>
          </div>
        </nav>

        {/* MODULE CONTENT - No scrollbar here */}
        <div className='flex-1'>{activeModule === 'sorting' ? <SortAlgo /> : activeModule === 'searching' ? <SearchAlgo /> : activeModule === 'graph' ? <GraphAlgo /> : activeModule === 'tree' ? <TreeAlgo /> : activeModule === 'dynamic' ? <DPAlgo /> : activeModule === 'backtracking' ? <BTAlgo /> : activeModule === 'greedy' ? <GreedyAlgo /> : activeModule === 'string' ? <StringAlgo /> : activeModule === 'math' ? <MathAlgo /> : activeModule === 'geometric' ? <GeoAlgo /> : <></>}</div>
      </div>
    </>
  )
}

export default App
