import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 5, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const SPEED = 120;

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [backendConnected, setBackendConnected] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  
  const directionRef = useRef(direction);
  
  // Health check polling
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
           setBackendConnected(true);
           fetchLeaderboard();
        } else {
           setBackendConnected(false);
        }
      } catch (e) {
        setBackendConnected(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
       const res = await fetch('/api/scores');
       if (res.ok) {
         setLeaderboard(await res.json());
       }
    } catch(e) {}
  };

  const startGame = (e) => {
    if (e) e.preventDefault();
    if (!playerName.trim()) return;
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPlaying(true);
  };

  const generateFood = (currentSnake) => {
    let newFood;
    while (true) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  };

  const submitScore = async (finalScore) => {
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score: finalScore })
      });
      fetchLeaderboard();
    } catch(e) {}
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying || gameOver) return;
      const key = e.key;
      const currentDir = directionRef.current;
      
      // Prevent reversing
      if ((key === 'ArrowUp' || key === 'w') && currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
      if ((key === 'ArrowDown' || key === 's') && currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
      if ((key === 'ArrowLeft' || key === 'a') && currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
      if ((key === 'ArrowRight' || key === 'd') && currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prev) => {
         let head = { x: prev[0].x + directionRef.current.x, y: prev[0].y + directionRef.current.y };
         
         // Border Wrap Logic
         if (head.x < 0) head.x = GRID_SIZE - 1;
         if (head.x >= GRID_SIZE) head.x = 0;
         if (head.y < 0) head.y = GRID_SIZE - 1;
         if (head.y >= GRID_SIZE) head.y = 0;
         
         // Self-Collision Logic
         if (prev.some(s => s.x === head.x && s.y === head.y)) {
            setGameOver(true);
            submitScore(score);
            return prev;
         }
         
         const newSnake = [head, ...prev];
         
         // Eat Apple
         if (head.x === food.x && head.y === food.y) {
            setScore(s => s + 1);
            setFood(generateFood(newSnake));
         } else {
            newSnake.pop(); // Remove tail
         }
         return newSnake;
      });
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, food, score]);

  if (!backendConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white p-4">
        <div className="p-10 bg-red-600/90 backdrop-blur-sm rounded-2xl shadow-2xl text-center border border-red-500 max-w-md w-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16 mx-auto mb-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-3xl font-bold mb-2">Backend Offline</h1>
            <p className="text-lg text-red-100 mb-6">Backend server is not connected!</p>
            <p className="text-sm bg-black/20 p-3 rounded text-red-100 font-mono">Ensure Node server is running on port 5000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-12 font-sans selection:bg-green-500/30">
      <h1 className="text-5xl md:text-6xl font-black mb-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-green-400 via-emerald-500 to-teal-400 drop-shadow-sm">
        SNAKE RUN
      </h1>
      
      {!isPlaying ? (
        <form onSubmit={startGame} className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center relative overflow-hidden transition-all hover:border-gray-700">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          <h2 className="text-2xl font-bold mb-2">Enter To Play</h2>
          <p className="text-gray-400 mb-6 text-sm">Save your scores on the global leaderboard</p>
          
          <input 
            type="text" 
            autoFocus
            required
            className="w-full p-4 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all mb-6 text-center text-lg font-medium"
            value={playerName} 
            onChange={e => setPlayerName(e.target.value)} 
            placeholder="Your Name" 
            maxLength={15}
          />
          <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white p-4 rounded-xl text-xl font-bold transform transition-all active:scale-95 shadow-lg shadow-green-500/25">
            Start Game
          </button>
        </form>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start w-full max-w-6xl px-4 justify-center">
            
            {/* Game Canvas container */}
            <div className="bg-gray-900 p-4 rounded-2xl shadow-2xl border border-gray-800 relative mx-auto lg:mx-0">
               <div className="flex justify-between items-center mb-4 px-2">
                  <div className="text-gray-400 font-semibold tracking-wide uppercase text-sm">Player: <span className="text-white">{playerName}</span></div>
                  <div className="text-gray-400 font-semibold tracking-wide uppercase text-sm">Score: <span className="text-green-400 text-lg">{score}</span></div>
               </div>
               
               <div className="relative bg-black rounded-lg overflow-hidden border-2 border-gray-800" style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}>
                   {/* Snake Rendering */}
                   {snake.map((segment, i) => (
                       <div 
                         key={i} 
                         className={`absolute ${i === 0 ? 'bg-green-400 z-10' : 'bg-green-600/90'}`} 
                         style={{ 
                            left: segment.x * 20, top: segment.y * 20, 
                            width: 20, height: 20, 
                            borderRadius: i === 0 ? '6px' : '4px',
                            transition: 'all 0.05s linear'
                         }}
                       />
                   ))}
                   {/* Apple Rendering */}
                   <div 
                     className="absolute bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)]" 
                     style={{ left: food.x * 20, top: food.y * 20, width: 20, height: 20 }}
                   />
                   
                   {/* Game Over Screen inside canvas */}
                   {gameOver && (
                      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-20 transition-all animate-fade-in">
                         <h2 className="text-5xl text-red-500 font-black mb-2 drop-shadow-md">GAME OVER</h2>
                         <p className="text-2xl text-gray-300 mb-8 font-light">You scored <span className="text-white font-bold">{score}</span></p>
                         <button 
                            onClick={startGame} 
                            className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all active:scale-95 shadow-xl hover:shadow-white/20"
                         >
                            Play Again
                         </button>
                      </div>
                   )}
               </div>
               <div className="text-center mt-4 text-xs text-gray-500">Use W A S D or Arrow Keys to move</div>
            </div>

            {/* Leaderboard Panel */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 w-full lg:w-80 shadow-2xl mx-auto lg:mx-0">
                <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
                   <h3 className="text-2xl font-black text-gray-100 flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-500">
                         <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                       </svg>
                       Top Scores
                   </h3>
                </div>
                
                <div className="space-y-3">
                   {leaderboard.length === 0 && <p className="text-gray-500 text-center py-4 italic">No scores yet. Be the first!</p>}
                   {leaderboard.map((entry, idx) => (
                      <div key={idx} className={`flex justify-between items-center p-3 rounded-lg ${idx === 0 ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400' : idx === 1 ? 'bg-gray-400/10 border border-gray-400/20 text-gray-300' : idx === 2 ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' : 'bg-gray-800/50 text-gray-400'}`}>
                         <div className="flex items-center gap-3">
                            <span className="font-bold opacity-50 w-4 text-left">{idx+1}</span>
                            <span className="font-semibold truncate max-w-[120px]">{entry.name}</span>
                         </div>
                         <span className="font-black text-lg">{entry.score}</span>
                      </div>
                   ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default App;
