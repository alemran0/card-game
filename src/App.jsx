import React, { useState, useEffect } from 'react';
import { Heart, Diamond, Club, Spade, Trophy, User, Cpu, AlertTriangle, Eye, EyeOff } from 'lucide-react';

/**
 * BANGLADESHI BRIDGE / RANG (5-Card Deal Variant)
 * * Rules:
 * - 4 Players, 2 Teams (User+North vs East+West).
 * - 52 Cards.
 * - Deal 1: 5 cards -> Auction Bidding (Min 7).
 * - Winner chooses Trump.
 * - **TRUMP VISIBILITY:** Only the bidder knows the trump initially. It is hidden from partner and opponents.
 * - Reveal: Trump is revealed when someone plays a trump card.
 * - Deal 2: Remaining 8 cards.
 * - Play 13 tricks.
 */

// --- Constants ---

const SUITS = ['S', 'H', 'C', 'D']; 
const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

const RANK_POWER = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, 
  '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

const getSuitIcon = (suit, size = 20) => {
  switch (suit) {
    case 'H': return <Heart size={size} className="text-red-600 fill-current" />;
    case 'D': return <Diamond size={size} className="text-red-600 fill-current" />;
    case 'C': return <Club size={size} className="text-slate-900 fill-current" />;
    case 'S': return <Spade size={size} className="text-slate-900 fill-current" />;
    default: return null;
  }
};

const getSuitName = (suit) => {
    switch(suit) {
        case 'H': return 'Hearts';
        case 'D': return 'Diamonds';
        case 'C': return 'Clubs';
        case 'S': return 'Spades';
        default: return '';
    }
};

const createDeck = () => {
  let deck = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({ 
        suit, 
        rank, 
        power: RANK_POWER[rank], 
        id: `${rank}${suit}` 
      });
    });
  });
  return deck;
};

const shuffleDeck = (deck) => {
  let newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

// --- Components ---

const Card = ({ card, onClick, isPlayable, isHidden, isSmall = false }) => {
  if (isHidden) {
    return (
      <div className={`${isSmall ? 'w-8 h-12' : 'w-16 h-24 sm:w-20 sm:h-28'} bg-indigo-900 rounded border border-white shadow-md flex items-center justify-center`}>
         <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
      </div>
    );
  }

  const isRed = card.suit === 'H' || card.suit === 'D';
  
  return (
    <div 
      onClick={() => isPlayable && onClick(card)}
      className={`
        ${isSmall ? 'w-10 h-14 text-[10px]' : 'w-16 h-24 sm:w-20 sm:h-28 text-sm sm:text-base'} 
        bg-white rounded shadow-lg border border-slate-300 flex flex-col items-center justify-between p-1 select-none transition-transform
        ${isPlayable ? 'cursor-pointer hover:-translate-y-4 hover:shadow-xl ring-2 ring-yellow-400' : ''}
        ${!isPlayable && !isSmall ? 'opacity-100' : ''} 
      `}
    >
      <div className={`self-start font-bold ${isRed ? 'text-red-600' : 'text-slate-900'}`}>
        {card.rank}
      </div>
      <div className="flex-1 flex items-center justify-center">
        {getSuitIcon(card.suit, isSmall ? 14 : 24)}
      </div>
      <div className={`self-end rotate-180 font-bold ${isRed ? 'text-red-600' : 'text-slate-900'}`}>
        {card.rank}
      </div>
    </div>
  );
};

// --- Main Game Component ---

export default function BridgeGame() {
  const [gameState, setGameState] = useState('lobby'); // lobby, dealing_1, bidding, trump_select, dealing_2, playing, round_end
  const [deck, setDeck] = useState([]);
  const [hands, setHands] = useState({ 0: [], 1: [], 2: [], 3: [] });
  const [playedCards, setPlayedCards] = useState([]); 
  const [currentTurn, setCurrentTurn] = useState(0); 
  
  // Game State
  const [trumpSuit, setTrumpSuit] = useState(null);
  const [isTrumpRevealed, setIsTrumpRevealed] = useState(false); // NEW: Visibility state
  const [bidWinner, setBidWinner] = useState(null); // { player, amount }
  const [currentHighBid, setCurrentHighBid] = useState({ player: null, amount: 6 }); 
  const [consecutivePasses, setConsecutivePasses] = useState(0);
  
  const [teamTricks, setTeamTricks] = useState({ 0: 0, 1: 0 }); // 0: User/North, 1: East/West
  const [teamScores, setTeamScores] = useState({ 0: 0, 1: 0 }); // Total Score

  const [messages, setMessages] = useState([]);
  const [isTrumpSelectorOpen, setIsTrumpSelectorOpen] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);

  // --- Logic ---

  const addMessage = (msg) => {
    setMessages(prev => [...prev.slice(-3), msg]);
  };

  const getPosName = (idx) => {
      if (idx === 0) return "You";
      if (idx === 1) return "East";
      if (idx === 2) return "North";
      if (idx === 3) return "West";
  };

  const startGame = () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    
    // Deal 5 cards first
    const newHands = { 0: [], 1: [], 2: [], 3: [] };
    for (let i = 0; i < 4; i++) {
      newHands[i] = newDeck.slice(i * 5, (i + 1) * 5);
      sortHand(newHands[i]);
    }
    
    setHands(newHands);
    setGameState('bidding');
    setTeamTricks({ 0: 0, 1: 0 });
    setPlayedCards([]);
    setTrumpSuit(null);
    setIsTrumpRevealed(false);
    setBidWinner(null);
    setCurrentHighBid({ player: null, amount: 6 });
    setConsecutivePasses(0);
    
    setCurrentTurn(0); 
    setShowBidModal(true);
    
    addMessage("First 5 cards dealt. Bidding starts.");
  };

  const sortHand = (hand) => {
    hand.sort((a,b) => {
        if (a.suit !== b.suit) return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
        return b.power - a.power;
    });
  };

  // --- Bidding Logic ---

  const handleUserBid = (amount) => {
      setShowBidModal(false);
      
      if (amount === 0) {
          addMessage("You passed.");
          processBidTurn(0, 0);
      } else {
          addMessage(`You bid ${amount}.`);
          processBidTurn(0, amount);
      }
  };

  const processBidTurn = (playerIdx, amount) => {
      let newHigh = { ...currentHighBid };
      let passes = consecutivePasses;

      if (amount > newHigh.amount) {
          newHigh = { player: playerIdx, amount };
          passes = 0;
          setCurrentHighBid(newHigh);
      } else {
          passes++;
      }
      setConsecutivePasses(passes);

      if (passes >= 3 && newHigh.player !== null) {
          finalizeBidding(newHigh);
          return;
      }
      
      if (passes >= 4 && newHigh.player === null) {
           addMessage("All passed. Re-dealing.");
           startGame();
           return;
      }

      const nextPlayer = (playerIdx + 1) % 4;
      setCurrentTurn(nextPlayer);

      if (nextPlayer === 0) {
          setShowBidModal(true);
      } else {
          setTimeout(() => aiBid(nextPlayer, newHigh), 1000);
      }
  };

  const aiBid = (playerIdx, currentHigh) => {
      const hand = hands[playerIdx];
      const suits = { 'S':0, 'H':0, 'C':0, 'D':0 };
      hand.forEach(c => suits[c.suit]++);
      
      let maxSuitCount = 0;
      for(let s in suits) {
          if (suits[s] > maxSuitCount) maxSuitCount = suits[s];
      }

      let hcp = hand.reduce((sum, c) => {
          if (c.power >= 11) return sum + (c.power - 10);
          return sum;
      }, 0);

      let potential = 6;
      if (maxSuitCount >= 3) potential += (maxSuitCount - 2);
      if (hcp >= 6) potential += 1;
      if (hcp >= 9) potential += 1;
      
      let bidAmount = 0;
      const partnerIdx = (playerIdx + 2) % 4;
      if (currentHigh.player === partnerIdx) {
          if (potential > currentHigh.amount + 1) bidAmount = currentHigh.amount + 1;
          else bidAmount = 0;
      } else {
          if (potential > currentHigh.amount) bidAmount = potential;
          if (bidAmount > 9 && hcp < 10) bidAmount = 0; 
      }
      
      if (bidAmount <= currentHigh.amount) bidAmount = 0;

      const action = bidAmount > 0 ? `bids ${bidAmount}` : "passes";
      addMessage(`${getPosName(playerIdx)} ${action}.`);
      processBidTurn(playerIdx, bidAmount);
  };

  const finalizeBidding = (winner) => {
      setBidWinner(winner);
      addMessage(`${getPosName(winner.player)} wins with ${winner.amount}!`);
      setGameState('trump_select');

      if (winner.player === 0) {
          setIsTrumpSelectorOpen(true);
      } else {
          setTimeout(() => aiSelectTrump(winner), 1500);
      }
  };

  // --- Trump Selection ---

  const handleTrumpSelect = (suit) => {
      setTrumpSuit(suit);
      setIsTrumpRevealed(false); // Initially hidden
      setIsTrumpSelectorOpen(false);
      // Only show this message to user if they selected it
      if (bidWinner.player === 0) addMessage(`You set Trump: ${getSuitName(suit)} (Hidden).`);
      else addMessage("Trump selected (Hidden).");
      
      dealSecondPhase(bidWinner);
  };

  const aiSelectTrump = (winnerObj) => {
      const playerIdx = winnerObj.player;
      const hand = hands[playerIdx];
      const suits = { 'S':0, 'H':0, 'C':0, 'D':0 };
      hand.forEach(c => suits[c.suit]++);
      
      let bestSuit = 'S';
      let max = -1;
      for(let s in suits) {
          if (suits[s] > max) {
              max = suits[s];
              bestSuit = s;
          }
      }
      
      setTrumpSuit(bestSuit);
      setIsTrumpRevealed(false); // Initially hidden
      addMessage(`${getPosName(playerIdx)} selected Trump.`);
      dealSecondPhase(winnerObj);
  };

  // --- Phase 2: Deal & Play ---

  const dealSecondPhase = (winnerObj) => {
    const currentWinner = winnerObj || bidWinner;

    if (!currentWinner) {
        console.error("Game Error: Bid Winner not found.");
        return;
    }

    const currentDeck = [...deck];
    const newHands = { ...hands };
    
    for (let i = 0; i < 4; i++) {
        const extraCards = currentDeck.slice(20 + (i * 8), 20 + ((i + 1) * 8));
        newHands[i] = [...newHands[i], ...extraCards];
        sortHand(newHands[i]);
    }
    
    setHands(newHands);
    setGameState('playing');
    
    setCurrentTurn(currentWinner.player);
    if (currentWinner.player !== 0) {
        setTimeout(() => aiTurn(currentWinner.player, []), 1000);
    }
  };

  const isValidPlay = (card, hand) => {
    if (playedCards.length === 0) return true; 
    
    const leadSuit = playedCards[0].card.suit;
    const leadSuitCards = hand.filter(c => c.suit === leadSuit);
    
    if (leadSuitCards.length > 0) {
        return card.suit === leadSuit;
    }
    
    return true;
  };

  const playCard = (playerIndex, card) => {
    // 1. Play logic
    const newHand = hands[playerIndex].filter(c => c.id !== card.id);
    setHands(prev => ({ ...prev, [playerIndex]: newHand }));
    
    const newPlayed = [...playedCards, { player: playerIndex, card }];
    setPlayedCards(newPlayed);

    // 2. REVEAL LOGIC
    // If Trump is played, it is automatically revealed to everyone
    if (!isTrumpRevealed && card.suit === trumpSuit) {
        setIsTrumpRevealed(true);
        addMessage("TRUMP REVEALED: " + getSuitName(trumpSuit) + "!");
    }
    
    if (newPlayed.length === 4) {
        setTimeout(() => evaluateTrick(newPlayed), 1200);
    } else {
        const nextPlayer = (playerIndex + 1) % 4;
        setCurrentTurn(nextPlayer);
        if (nextPlayer !== 0) {
            setTimeout(() => aiTurn(nextPlayer, newPlayed), 800);
        }
    }
  };

  const aiTurn = (aiIdx, currentTable) => {
      const hand = hands[aiIdx];
      let cardToPlay = null;
      
      if (currentTable.length === 0) {
          // Lead
          const trumps = hand.filter(c => c.suit === trumpSuit);
          // Only lead trump if revealed or if we are the bidder (who knows it)
          const knowsTrump = isTrumpRevealed || (bidWinner && bidWinner.player === aiIdx);
          
          if (knowsTrump && trumps.length >= 4) {
               cardToPlay = trumps[trumps.length-1]; 
          } else {
               cardToPlay = hand[0];
          }
      } else {
          // Follow logic
          const leadSuit = currentTable[0].card.suit;
          const suitCards = hand.filter(c => c.suit === leadSuit);
          const trumps = hand.filter(c => c.suit === trumpSuit);
          
          if (suitCards.length > 0) {
              const currentWinner = getCurrentTrickWinner(currentTable);
              const partnerWinning = currentWinner.player === (aiIdx + 2) % 4;
              
              if (partnerWinning) {
                   cardToPlay = suitCards[suitCards.length - 1]; // dump low
              } else {
                   const tableMax = Math.max(...currentTable.filter(c => c.card.suit === leadSuit).map(c => c.card.power));
                   const winners = suitCards.filter(c => c.power > tableMax);
                   if (winners.length > 0) cardToPlay = winners[winners.length - 1];
                   else cardToPlay = suitCards[suitCards.length - 1];
              }
          } else if (trumps.length > 0) {
               // Cut with Trump?
               // If trump hidden, AI "guesses" or plays logically if it has no choice? 
               // AI knows its own hand. If it has no suit, it plays a trump if it wants to win.
               // Playing it reveals it.
               cardToPlay = trumps[trumps.length - 1]; 
          } else {
               cardToPlay = hand[hand.length - 1];
          }
      }
      
      if (!cardToPlay || !isValidPlay(cardToPlay, hand)) {
         cardToPlay = hand.find(c => isValidPlay(c, hand)) || hand[0];
      }
      
      playCard(aiIdx, cardToPlay);
  };

  const getCurrentTrickWinner = (trick) => {
      const leadSuit = trick[0].card.suit;
      let winner = trick[0];
      
      trick.forEach(p => {
          if (p.card.suit === winner.card.suit) {
              if (p.card.power > winner.card.power) winner = p;
          } else if (p.card.suit === trumpSuit) {
              if (winner.card.suit !== trumpSuit) winner = p;
              else if (p.card.power > winner.card.power) winner = p;
          }
      });
      return winner;
  };

  const evaluateTrick = (trick) => {
      const winnerObj = getCurrentTrickWinner(trick);
      const winnerIdx = winnerObj.player;
      const winningTeam = (winnerIdx === 0 || winnerIdx === 2) ? 0 : 1;
      
      setTeamTricks(prev => ({
          ...prev,
          [winningTeam]: prev[winningTeam] + 1
      }));
      
      addMessage(`${getPosName(winnerIdx)} takes trick.`);
      setPlayedCards([]);
      
      if (hands[0].length === 0) {
          endRound(winningTeam);
      } else {
          setCurrentTurn(winnerIdx);
          if (winnerIdx !== 0) {
              setTimeout(() => aiTurn(winnerIdx, []), 800);
          }
      }
  };

  const endRound = () => {
      setGameState('round_end');
      
      const bidTeam = (bidWinner.player === 0 || bidWinner.player === 2) ? 0 : 1;
      const defTeam = bidTeam === 0 ? 1 : 0;
      const bidAmount = bidWinner.amount;
      const tricksGot = teamTricks[bidTeam];
      
      let msg = "";
      const newScores = { ...teamScores };
      
      if (tricksGot >= bidAmount) {
          const score = 10 + (tricksGot - bidAmount); 
          newScores[bidTeam] += score;
          msg = `Bidder Team (${getPosName(bidWinner.player)}) WON! (+${score} pts)`;
      } else {
          const penalty = bidAmount;
          newScores[bidTeam] -= penalty;
          newScores[defTeam] += penalty;
          msg = `Bidder Team FAILED! (-${penalty} pts)`;
      }
      
      setTeamScores(newScores);
      addMessage(msg);
  };

  // Helper to render Trump Icon based on visibility rules
  const renderTrumpIcon = () => {
    if (!trumpSuit) return null;

    // 1. If Revealed: Everyone sees it
    if (isTrumpRevealed) {
        return (
            <div className="flex flex-col items-center">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-500">
                    {getSuitIcon(trumpSuit, 24)}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-yellow-400 bg-black/50 px-2 rounded">
                    <Eye size={10} /> REVEALED
                </div>
            </div>
        );
    }

    // 2. If Hidden:
    // Only Bidder sees it. Everyone else sees "?"
    const iAmBidder = bidWinner && bidWinner.player === 0;

    if (iAmBidder) {
        return (
            <div className="flex flex-col items-center opacity-90">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-400">
                    {getSuitIcon(trumpSuit, 24)}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-blue-300 bg-black/50 px-2 rounded">
                    <EyeOff size={10} /> PRIVATE
                </div>
            </div>
        );
    } else {
         return (
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-500">
                    <span className="text-2xl font-bold text-gray-400">?</span>
                </div>
                <div className="mt-1 text-[10px] text-gray-400 bg-black/50 px-2 rounded">
                    HIDDEN
                </div>
            </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white font-sans overflow-hidden flex flex-col select-none">
      
      {/* Header */}
      <div className="bg-slate-950 p-2 shadow-lg flex justify-between items-center z-10 border-b border-slate-700">
        <div className="flex gap-4">
             <div className={`p-2 rounded ${bidWinner && (bidWinner.player === 0 || bidWinner.player === 2) ? 'bg-yellow-900/50 border border-yellow-500' : 'bg-slate-800'}`}>
                 <div className="text-xs text-gray-400">YOUR TEAM (N/S)</div>
                 <div className="text-xl font-bold">{teamTricks[0]} <span className="text-xs font-normal text-gray-500">Tricks</span></div>
                 <div className="text-xs text-green-400">Score: {teamScores[0]}</div>
             </div>
             <div className={`p-2 rounded ${bidWinner && (bidWinner.player === 1 || bidWinner.player === 3) ? 'bg-yellow-900/50 border border-yellow-500' : 'bg-slate-800'}`}>
                 <div className="text-xs text-gray-400">OPPONENTS (E/W)</div>
                 <div className="text-xl font-bold">{teamTricks[1]} <span className="text-xs font-normal text-gray-500">Tricks</span></div>
                 <div className="text-xs text-red-400">Score: {teamScores[1]}</div>
             </div>
        </div>

        <div className="flex flex-col items-center">
            <h1 className="text-lg font-bold text-yellow-100 hidden sm:block">BANGLA BRIDGE</h1>
            {bidWinner && (
                <div className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded border border-yellow-500/50">
                    Bid: {bidWinner.amount} by {getPosName(bidWinner.player)}
                </div>
            )}
        </div>

        <button onClick={startGame} className="bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-500 text-sm">
            {gameState === 'lobby' ? 'Start Game' : 'New Hand'}
        </button>
      </div>

      {/* Main Table */}
      <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/p6.png')] flex items-center justify-center">
        
        {/* Trump Indicator */}
        {trumpSuit && (
            <div className="absolute top-4 left-4 flex flex-col items-center animate-fade-in z-20">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Trump</span>
                {renderTrumpIcon()}
            </div>
        )}

        {/* North */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="flex -space-x-6">
                {hands[2].map((c, i) => <Card key={i} card={c} isHidden={true} isSmall />)}
            </div>
            <div className="bg-black/40 px-3 py-1 rounded-full mt-2 flex items-center gap-2 border border-slate-600">
                <Cpu size={14} className="text-blue-300"/> <span className="text-xs font-bold text-blue-100">Partner (North)</span> 
                {currentTurn === 2 && <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"/>}
            </div>
        </div>

        {/* West */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center -rotate-90 origin-center">
            <div className="flex -space-x-6">
                {hands[3].map((c, i) => <Card key={i} card={c} isHidden={true} isSmall />)}
            </div>
            <div className="bg-black/40 px-3 py-1 rounded-full mt-2 flex items-center gap-2 border border-slate-600">
                <Cpu size={14} className="text-red-300"/> <span className="text-xs font-bold text-red-100">West</span>
                {currentTurn === 3 && <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"/>}
            </div>
        </div>

        {/* East */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center rotate-90 origin-center">
            <div className="flex -space-x-6">
                {hands[1].map((c, i) => <Card key={i} card={c} isHidden={true} isSmall />)}
            </div>
            <div className="bg-black/40 px-3 py-1 rounded-full mt-2 flex items-center gap-2 border border-slate-600">
                <Cpu size={14} className="text-red-300"/> <span className="text-xs font-bold text-red-100">East</span>
                {currentTurn === 1 && <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"/>}
            </div>
        </div>

        {/* Center: Table */}
        <div className="relative w-64 h-64 flex items-center justify-center">
            {gameState === 'lobby' && (
                <div className="bg-slate-800/90 p-8 rounded-xl text-center backdrop-blur border border-blue-500 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-2">Bridge (Rang)</h2>
                    <p className="text-sm text-gray-300 mb-6">Partnership Game • Auction Bidding</p>
                    <button onClick={startGame} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105">Play Now</button>
                </div>
            )}

            {playedCards.map((pc, i) => {
                 let translate = '';
                 if (pc.player === 0) translate = 'translate-y-16';
                 if (pc.player === 1) translate = 'translate-x-16';
                 if (pc.player === 2) translate = '-translate-y-16';
                 if (pc.player === 3) translate = '-translate-x-16';
                 return (
                     <div key={i} className={`absolute transition-transform duration-300 ${translate}`}>
                         <Card card={pc.card} />
                     </div>
                 );
            })}
        </div>

        {/* Player Hand (South) */}
        <div className="absolute bottom-0 w-full flex flex-col items-center pb-6">
             
             {/* Messages */}
             <div className="mb-4 bg-black/60 px-6 py-2 rounded-full text-yellow-300 text-sm font-semibold shadow-md backdrop-blur-sm animate-pulse">
                 {messages[messages.length-1] || "Waiting..."}
             </div>

             {/* Cards */}
             <div className="flex -space-x-8 hover:space-x-0 transition-all duration-300 px-4 pb-2 overflow-x-visible items-end h-32">
                 {hands[0].map((c, i) => {
                     const valid = gameState === 'playing' && currentTurn === 0 && isValidPlay(c, hands[0]);
                     return (
                         <Card 
                            key={c.id} 
                            card={c} 
                            isPlayable={valid}
                            onClick={() => playCard(0, c)}
                        />
                     );
                 })}
             </div>
        </div>

        {/* --- Modals --- */}

        {/* Bidding Modal */}
        {showBidModal && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-slate-800 p-6 rounded-xl border border-blue-500 max-w-md w-full m-4 shadow-2xl">
                    <h3 className="text-xl font-bold mb-1 text-center">Place Your Bid</h3>
                    <div className="text-center text-xs text-gray-400 mb-4">Current High: {currentHighBid.amount} by {getPosName(currentHighBid.player)}</div>
                    
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {[7, 8, 9, 10, 11, 12, 13].map(amt => (
                            <button
                                key={amt}
                                disabled={amt <= currentHighBid.amount}
                                onClick={() => handleUserBid(amt)}
                                className={`p-3 rounded font-bold text-lg ${amt <= currentHighBid.amount ? 'bg-slate-700 text-gray-600' : 'bg-blue-600 hover:bg-blue-500'}`}
                            >
                                {amt}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => handleUserBid(0)} className="w-full py-3 bg-red-600 hover:bg-red-500 rounded font-bold text-white uppercase tracking-wider">Pass</button>
                </div>
            </div>
        )}

        {/* Trump Selection Modal */}
        {isTrumpSelectorOpen && (
             <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-slate-800 p-8 rounded-xl border border-yellow-500 shadow-2xl text-center">
                    <h3 className="text-2xl font-bold mb-6 text-white">Select Trump Suit</h3>
                    <div className="flex gap-4 justify-center">
                        {SUITS.map(suit => (
                            <button 
                                key={suit}
                                onClick={() => handleTrumpSelect(suit)}
                                className="w-20 h-20 bg-white rounded-xl flex items-center justify-center hover:scale-110 transition shadow-lg ring-4 ring-transparent hover:ring-yellow-400"
                            >
                                {getSuitIcon(suit, 40)}
                            </button>
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-400">Note: Trump will remain hidden from opponents.</p>
                </div>
             </div>
        )}

        {/* Round End Modal */}
        {gameState === 'round_end' && (
             <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 animate-in zoom-in">
                 <div className="bg-slate-900 p-8 rounded-xl border border-yellow-500 text-center max-w-sm">
                     <Trophy size={48} className="mx-auto text-yellow-400 mb-4"/>
                     <h2 className="text-2xl font-bold text-white mb-2">Hand Finished</h2>
                     <p className="text-gray-300 mb-6">{messages[messages.length-1]}</p>
                     <button onClick={startGame} className="bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-500 shadow-lg">Next Hand</button>
                 </div>
             </div>
        )}

      </div>
    </div>
  );
}
