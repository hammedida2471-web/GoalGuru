import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Calendar, 
  ChevronRight, 
  BrainCircuit, 
  TrendingUp, 
  Info,
  Activity,
  Target,
  ShieldCheck,
  MapPin,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { Match, Prediction } from './types';
import { MOCK_MATCHES } from './constants';
import { getMatchPrediction, getUpcomingFixtures } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [view, setView] = useState<'analysis' | 'fixtures'>('analysis');
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingFixtures, setFetchingFixtures] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadRealFixtures();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadRealFixtures();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const loadRealFixtures = async () => {
    setFetchingFixtures(true);
    try {
      const realMatches = await getUpcomingFixtures();
      if (realMatches && realMatches.length > 0) {
        setMatches(realMatches);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to load real fixtures:", error);
    } finally {
      setFetchingFixtures(false);
    }
  };

  const handleMatchSelect = async (match: Match) => {
    setSelectedMatch(match);
    setPrediction(null);
    setLoading(true);
    setView('analysis');
    
    try {
      const result = await getMatchPrediction(match);
      setPrediction(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const competitions = Array.from(new Set(matches.map(m => m.competition))).sort() as string[];

  const filteredMatches = selectedCompetition 
    ? matches.filter(m => m.competition === selectedCompetition)
    : matches;

  const matchesByCompetition = filteredMatches.reduce((acc, match) => {
    if (!acc[match.competition]) {
      acc[match.competition] = [];
    }
    acc[match.competition].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#E4E3E0]">
      {/* Sidebar Container */}
      <div className="hidden lg:flex h-screen sticky top-0 border-r border-black/10 shrink-0">
        {/* League Selector Column */}
        <div className="w-16 h-full bg-black flex flex-col items-center py-6 gap-6 overflow-y-auto no-scrollbar">
          <button 
            onClick={() => setSelectedCompetition(null)}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
              !selectedCompetition ? "bg-white text-black scale-110 shadow-lg" : "bg-white/10 text-white/40 hover:bg-white/20"
            )}
            title="All Leagues"
          >
            <Trophy size={18} />
          </button>
          
          <div className="w-8 h-px bg-white/10" />
          
          {competitions.map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedCompetition(comp)}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative",
                selectedCompetition === comp ? "bg-white text-black scale-110 shadow-lg" : "bg-white/10 text-white/40 hover:bg-white/20"
              )}
            >
              <span className="text-[10px] font-black uppercase tracking-tighter text-center line-clamp-2 px-1">
                {comp.split(' ')[0].substring(0, 3)}
              </span>
              
              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-2 py-1 bg-black text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                {comp}
              </div>
            </button>
          ))}
        </div>

        {/* Sidebar - Match List */}
        <aside className="w-[340px] bg-white/50 backdrop-blur-xl h-full overflow-y-auto no-scrollbar">
          <div className="p-6 border-b border-black/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">
                  {selectedCompetition ? 'Fixtures' : 'GoalGuru'}
                </h1>
              </div>
              <button 
                onClick={loadRealFixtures}
                disabled={fetchingFixtures}
                className={cn(
                  "p-2 hover:bg-black/5 rounded-lg transition-colors",
                  fetchingFixtures && "animate-spin"
                )}
                title="Refresh Real-Time Fixtures"
              >
                <Activity size={16} className={cn("text-black/40", fetchingFixtures && "animate-spin")} />
              </button>
            </div>
            <p className="text-[10px] text-black/40 font-mono uppercase tracking-widest truncate">
              {selectedCompetition || (lastUpdated ? `Last updated: ${format(lastUpdated, 'HH:mm:ss')}` : 'Global Analysis Engine')}
            </p>
          </div>

          <div className="flex flex-col">
            {Object.entries(matchesByCompetition).map(([competition, compMatches]) => (
              <div key={competition}>
                {!selectedCompetition && (
                  <div className="px-6 py-2 bg-black/5 border-b border-black/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{competition}</span>
                  </div>
                )}
                {(compMatches as Match[]).map((match) => (
                  <button
                    key={match.id}
                    onClick={() => handleMatchSelect(match)}
                    className={cn(
                      "data-grid-row text-left group w-full px-6 py-4 border-b border-black/5 flex items-center gap-4 transition-colors",
                      selectedMatch?.id === match.id && view === 'analysis' ? "bg-black text-white" : "hover:bg-black/5"
                    )}
                  >
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[9px] font-mono opacity-50 uppercase tracking-tighter",
                          selectedMatch?.id === match.id && view === 'analysis' && "opacity-80"
                        )}>
                          {match.status === 'LIVE' ? (
                            <span className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              LIVE
                            </span>
                          ) : (
                            format(new Date(match.date), 'MMM dd • HH:mm')
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-bold text-sm">
                        <span className="truncate">{match.homeTeam.name}</span>
                        {match.status === 'LIVE' && <span className="font-mono">{match.homeScore}</span>}
                      </div>
                      <div className="flex items-center justify-between font-bold text-sm">
                        <span className="truncate">{match.awayTeam.name}</span>
                        {match.status === 'LIVE' && <span className="font-mono">{match.awayScore}</span>}
                      </div>
                    </div>
                    <ChevronRight size={14} className={cn("opacity-20", selectedMatch?.id === match.id && view === 'analysis' && "opacity-100")} />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navigation */}
        <nav className="bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setView('analysis')}
              className={cn(
                "text-sm font-bold uppercase tracking-widest transition-colors",
                view === 'analysis' ? "text-black" : "text-black/30 hover:text-black/60"
              )}
            >
              Analysis
            </button>
            <button 
              onClick={() => setView('fixtures')}
              className={cn(
                "text-sm font-bold uppercase tracking-widest transition-colors",
                view === 'fixtures' ? "text-black" : "text-black/30 hover:text-black/60"
              )}
            >
              Fixtures
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <Activity size={12} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Live Analysis Active</span>
            </div>
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto p-6 lg:p-12">
          <AnimatePresence mode="wait">
            {view === 'fixtures' ? (
              <motion.div
                key="fixtures-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-6xl mx-auto space-y-12"
              >
                <div className="flex flex-col gap-2 mb-8">
                  <h2 className="text-4xl font-black tracking-tighter uppercase">Global Fixtures</h2>
                  <p className="text-black/50 font-mono text-sm">Full schedule for European, American and African leagues</p>
                </div>

                {/* Mobile League Selector */}
                <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 -mx-6 px-6">
                  <button
                    onClick={() => setSelectedCompetition(null)}
                    className={cn(
                      "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border",
                      !selectedCompetition ? "bg-black text-white border-black" : "bg-white text-black/40 border-black/10"
                    )}
                  >
                    All Leagues
                  </button>
                  {competitions.map((comp) => (
                    <button
                      key={comp}
                      onClick={() => setSelectedCompetition(comp)}
                      className={cn(
                        "px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border",
                        selectedCompetition === comp ? "bg-black text-white border-black" : "bg-white text-black/40 border-black/10"
                      )}
                    >
                      {comp}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(matchesByCompetition).map(([competition, compMatches]) => (
                    <div key={competition} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-black/10" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 whitespace-nowrap">
                          {competition}
                        </span>
                        <div className="h-px flex-1 bg-black/10" />
                      </div>
                      
                      <div className="space-y-2">
                        {(compMatches as Match[]).map((match) => (
                           <button
                            key={match.id}
                            onClick={() => handleMatchSelect(match)}
                            className={cn(
                              "w-full glass-card p-4 flex items-center justify-between group hover:border-black/20 transition-all",
                              match.status === 'LIVE' && "border-red-100 bg-red-50/10"
                            )}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-right flex-1">
                                <span className={cn("text-sm font-bold block truncate", match.status === 'LIVE' && "text-red-900")}>{match.homeTeam.name}</span>
                              </div>
                              {match.status === 'LIVE' ? (
                                <div className="px-3 py-0.5 bg-red-500 text-white rounded text-[10px] font-black tabular-nums">
                                  {match.homeScore} - {match.awayScore}
                                </div>
                              ) : (
                                <div className="px-2 py-0.5 bg-black/5 rounded text-[10px] font-black italic">VS</div>
                              )}
                              <div className="text-left flex-1">
                                <span className={cn("text-sm font-bold block truncate", match.status === 'LIVE' && "text-red-900")}>{match.awayTeam.name}</span>
                              </div>
                            </div>
                            <div className="ml-6 text-right shrink-0">
                              {match.status === 'LIVE' ? (
                                <span className="text-[10px] font-bold text-red-500 animate-pulse flex items-center justify-end gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                  LIVE
                                </span>
                              ) : (
                                <>
                                  <span className="text-[10px] font-mono block opacity-50 uppercase">
                                    {format(new Date(match.date), 'MMM dd')}
                                  </span>
                                  <span className="text-xs font-bold block">
                                    {format(new Date(match.date), 'HH:mm')}
                                  </span>
                                </>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : selectedMatch ? (
            <motion.div
              key={selectedMatch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Match Header */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 glass-card">
                <div className="flex flex-col items-center gap-4 flex-1">
                  <img src={selectedMatch.homeTeam.logo} alt="" className="w-20 h-20 rounded-full bg-black/5 p-2" referrerPolicy="no-referrer" />
                  <h2 className="text-2xl font-bold text-center">{selectedMatch.homeTeam.name}</h2>
                </div>

                 <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 mb-2">
                       {selectedMatch.status === 'LIVE' ? (
                        <div className="px-3 py-1 bg-red-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 animate-pulse">
                          <Activity size={12} />
                          LIVE
                        </div>
                      ) : (
                        <div className="px-4 py-1 bg-black/5 rounded-full text-[10px] font-mono uppercase tracking-widest">
                          {selectedMatch.competition}
                        </div>
                      )}
                    </div>
                    {selectedMatch.status === 'LIVE' ? (
                      <div className="text-5xl font-black italic tracking-tighter flex items-center gap-6">
                        <span>{selectedMatch.homeScore}</span>
                        <span className="text-2xl opacity-20">-</span>
                        <span>{selectedMatch.awayScore}</span>
                      </div>
                    ) : (
                      <div className="text-4xl font-black italic tracking-tighter uppercase">VS</div>
                    )}
                    <div className="text-sm text-black/50 flex items-center gap-1 mt-2">
                      <Calendar size={14} />
                      {format(new Date(selectedMatch.date), 'MMMM do, yyyy')}
                    </div>
                  </div>

                <div className="flex flex-col items-center gap-4 flex-1">
                  <img src={selectedMatch.awayTeam.logo} alt="" className="w-20 h-20 rounded-full bg-black/5 p-2" referrerPolicy="no-referrer" />
                  <h2 className="text-2xl font-bold text-center">{selectedMatch.awayTeam.name}</h2>
                </div>
              </div>

              {/* Prediction Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* AI Score Prediction */}
                <div className="md:col-span-2 glass-card p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <BrainCircuit size={120} />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <BrainCircuit className="text-emerald-600" size={20} />
                    <h3 className="font-bold uppercase tracking-wider text-sm">AI Predicted Outcome</h3>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Activity className="animate-pulse text-black/20" size={48} />
                      <p className="text-sm font-mono animate-pulse">Analyzing tactical data...</p>
                    </div>
                  ) : prediction ? (
                    <div className="space-y-8">
                      <div className="flex items-center justify-center gap-12">
                        <div className="text-center">
                          <span className="text-6xl font-black tracking-tighter">{prediction.predictedHomeScore}</span>
                          <p className="text-[10px] font-mono uppercase opacity-50 mt-2">Home</p>
                        </div>
                        <div className="text-2xl font-light text-black/20">-</div>
                        <div className="text-center">
                          <span className="text-6xl font-black tracking-tighter">{prediction.predictedAwayScore}</span>
                          <p className="text-[10px] font-mono uppercase opacity-50 mt-2">Away</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono uppercase opacity-50">
                          <span>{selectedMatch.status === 'LIVE' ? 'Projected Outcome' : 'Win Probability'}</span>
                          <span>{prediction.confidence}% Confidence</span>
                        </div>
                        <div className="h-3 flex rounded-full overflow-hidden bg-black/5">
                          <div 
                            className="bg-black transition-all duration-1000" 
                            style={{ width: `${prediction.winProbability.home}%` }} 
                          />
                          <div 
                            className="bg-black/20 transition-all duration-1000" 
                            style={{ width: `${prediction.winProbability.draw}%` }} 
                          />
                          <div 
                            className="bg-emerald-500 transition-all duration-1000" 
                            style={{ width: `${prediction.winProbability.away}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono uppercase">
                          <span>Home {prediction.winProbability.home}%</span>
                          <span>Draw {prediction.winProbability.draw}%</span>
                          <span>Away {prediction.winProbability.away}%</span>
                        </div>
                      </div>

                      {/* Goal Range Forecasting */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/5">
                        <div className="p-4 bg-black/5 rounded-xl">
                          <p className="text-[10px] font-mono uppercase opacity-50 mb-1">Goal Range</p>
                          <p className="text-xl font-bold tracking-tight">{prediction.goalRange || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-black/5 rounded-xl">
                          <p className="text-[10px] font-mono uppercase opacity-50 mb-1">Expected Goals (xG)</p>
                          <p className="text-xl font-bold tracking-tight">{prediction.goalExpectancy?.toFixed(1) || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-black/30">
                      <Info size={32} />
                      <p className="text-sm mt-2">Select a match to generate prediction</p>
                    </div>
                  )}
                </div>

                {/* Key Factors */}
                <div className="glass-card p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Target className="text-orange-500" size={20} />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Key Factors</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {loading ? (
                      [1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-black/5 rounded-lg animate-pulse" />
                      ))
                    ) : prediction?.keyFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-black/5 rounded-xl text-sm leading-tight">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-black/20 shrink-0" />
                        {factor}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Match Details Section */}
              {!loading && prediction?.matchDetails && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-card p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="text-red-500" size={20} />
                      <h3 className="font-bold uppercase tracking-wider text-sm">Match Context</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-black/5 rounded-xl">
                        <span className="text-[10px] font-mono uppercase opacity-50">Venue</span>
                        <span className="text-sm font-bold truncate max-w-[200px]">{prediction.matchDetails.venue}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-black/5 rounded-xl">
                        <span className="text-[10px] font-mono uppercase opacity-50">Referee</span>
                        <span className="text-sm font-bold">{prediction.matchDetails.referee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <BarChart3 className="text-indigo-600" size={20} />
                      <h3 className="font-bold uppercase tracking-wider text-sm">Team Stats Insight</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <p className="text-[10px] font-mono uppercase opacity-50 text-center">Home</p>
                        <div className="p-3 bg-black/5 rounded-xl text-center">
                          <p className="text-[10px] opacity-40 uppercase mb-1">Form</p>
                          <p className="font-mono font-bold text-xs">{prediction.matchDetails.homeStats?.lastFive}</p>
                        </div>
                        <div className="p-3 bg-black/5 rounded-xl text-center">
                          <p className="text-[10px] opacity-40 uppercase mb-1">Star Player</p>
                          <p className="font-bold text-xs truncate">{prediction.matchDetails.homeStats?.topScorer}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-mono uppercase opacity-50 text-center">Away</p>
                        <div className="p-3 bg-black/5 rounded-xl text-center">
                          <p className="text-[10px] opacity-40 uppercase mb-1">Form</p>
                          <p className="font-mono font-bold text-xs">{prediction.matchDetails.awayStats?.lastFive}</p>
                        </div>
                        <div className="p-3 bg-black/5 rounded-xl text-center">
                          <p className="text-[10px] opacity-40 uppercase mb-1">Star Player</p>
                          <p className="font-bold text-xs truncate">{prediction.matchDetails.awayStats?.topScorer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Analysis */}
              {!loading && prediction && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="text-blue-600" size={20} />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Tactical Analysis</h3>
                  </div>
                  <p className="text-lg leading-relaxed font-serif italic text-black/80">
                    "{prediction.analysis}"
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-black/20 space-y-4">
              <div className="p-8 rounded-full border-2 border-dashed border-black/10">
                <Activity size={64} />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-black/40">Select a Match</h2>
                <p className="text-sm font-mono uppercase tracking-widest">To begin AI tactical analysis</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>

      {/* Footer / Mobile Nav */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 p-4 flex justify-around items-center z-50">
        <button 
          onClick={() => setView('analysis')}
          className={cn("flex flex-col items-center gap-1", view === 'analysis' ? "text-black" : "opacity-30")}
        >
          <TrendingUp size={20} />
          <span className="text-[10px] uppercase font-bold">Analysis</span>
        </button>
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center -mt-8 shadow-lg text-white">
          <BrainCircuit size={24} />
        </div>
        <button 
          onClick={() => setView('fixtures')}
          className={cn("flex flex-col items-center gap-1", view === 'fixtures' ? "text-black" : "opacity-30")}
        >
          <Calendar size={20} />
          <span className="text-[10px] uppercase font-bold">Fixtures</span>
        </button>
      </footer>
    </div>
  );
}
