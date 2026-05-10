import { GoogleGenAI, Type } from "@google/genai";
import { Match, Prediction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getUpcomingFixtures(): Promise<Match[]> {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toLocaleTimeString();
  
  const prompt = `
    Search for CURRENTLY LIVE and UPCOMING football matches for today (${today}) and the upcoming week.
    Current System Time: ${today} ${currentTime}
    
    You MUST provide real-time, accurate scores for matches that are currently LIVE in these regions:
    1. Major European Leagues: English Premier League, Spanish La Liga, German Bundesliga, Italian Serie A, French Ligue 1, Dutch Eredivisie, Portuguese Primeira Liga.
    2. African Leagues: Nigeria Professional Football League (NPFL), Egyptian Premier League.
    3. American Leagues: USA Major League Soccer (MLS), Brazilian Série A.
    4. Continental Competitions: UEFA Champions League, Europa League, Conference League.
    
    For each competition, fetch at least 5-10 upcoming or live fixtures if available.
    
    Return a JSON array of Match objects.
    CRITICAL: Ensure the 'status', 'homeScore', and 'awayScore' reflect the actual current state of LIVE matches as found in search results.
    
    Match Structure:
    - id: string (unique)
    - homeTeam: { name: string, shortName: string, logo: string, color: string }
    - awayTeam: { name: string, shortName: string, logo: string, color: string }
    - date: string (ISO 8601 format)
    - competition: string (e.g., "Premier League", "Série A - Brazil", "NPFL - Nigeria", "Egyptian Premier League")
    - status: "LIVE" or "UPCOMING"
    - homeScore: number (required if LIVE)
    - awayScore: number (required if LIVE)
    - venue: string

    Logo fallback: https://picsum.photos/seed/{teamname}/100/100
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              homeTeam: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  shortName: { type: Type.STRING },
                  logo: { type: Type.STRING },
                  color: { type: Type.STRING }
                },
                required: ["name", "shortName", "logo", "color"]
              },
              awayTeam: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  shortName: { type: Type.STRING },
                  logo: { type: Type.STRING },
                  color: { type: Type.STRING }
                },
                required: ["name", "shortName", "logo", "color"]
              },
              date: { type: Type.STRING },
              competition: { type: Type.STRING },
              status: { type: Type.STRING },
              venue: { type: Type.STRING }
            },
            required: ["id", "homeTeam", "awayTeam", "date", "competition", "status", "venue"]
          }
        }
      },
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error fetching real fixtures:", error);
    return [];
  }
}

export async function getMatchPrediction(match: Match): Promise<Prediction> {
  const isLive = match.status === 'LIVE';
  const currentScoreText = isLive ? `Current Score: ${match.homeScore} - ${match.awayScore}` : '';
  
  const prompt = `
    Analyze the following football match and provide a score prediction and tactical analysis.
    ${isLive ? 'This match is currently LIVE. Provide a projection for the FINAL score based on the current score and match momentum.' : ''}
    
    Match: ${match.homeTeam.name} vs ${match.awayTeam.name}
    Competition: ${match.competition}
    Date: ${match.date}
    Venue: ${match.venue}
    ${currentScoreText}

    Provide the response in JSON format with the following structure:
    {
      "predictedHomeScore": number (Projected final score),
      "predictedAwayScore": number (Projected final score),
      "winProbability": {
        "home": number (0-100),
        "draw": number (0-100),
        "away": number (0-100)
      },
      "analysis": "A detailed 2-3 sentence tactical analysis. ${isLive ? 'Mention the current match situation.' : ''}",
      "keyFactors": ["factor 1", "factor 2", "factor 3"],
      "confidence": number (0-100),
      "goalRange": "e.g., 2.5 - 3.5 goals",
      "goalExpectancy": number (expected total goals, e.g., 2.8),
      "matchDetails": {
        "venue": "string",
        "referee": "string",
        "homeStats": {
          "lastFive": "e.g., W-W-D-L-W",
          "topScorer": "string",
          "avgGoals": number
        },
        "awayStats": {
          "lastFive": "e.g., L-D-W-W-L",
          "topScorer": "string",
          "avgGoals": number
        }
      }
    }
    
    Ensure the win probabilities sum to 100.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      matchId: match.id,
      ...result
    };
  } catch (error) {
    console.error("Prediction error:", error);
    // Fallback prediction
    return {
      matchId: match.id,
      predictedHomeScore: 1,
      predictedAwayScore: 1,
      winProbability: { home: 33, draw: 34, away: 33 },
      analysis: "AI analysis currently unavailable. Based on historical data, this looks like a balanced encounter.",
      keyFactors: ["Historical parity", "Current form", "Home advantage"],
      confidence: 50
    };
  }
}
