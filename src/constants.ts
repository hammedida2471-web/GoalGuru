import { Match } from "./types";

export const MOCK_MATCHES: Match[] = [
  // Premier League
  {
    id: 'pl-1',
    homeTeam: { id: 'mci', name: 'Manchester City', shortName: 'MCI', logo: 'https://picsum.photos/seed/mci/100/100', color: '#6CABDD' },
    awayTeam: { id: 'liv', name: 'Liverpool', shortName: 'LIV', logo: 'https://picsum.photos/seed/liv/100/100', color: '#C8102E' },
    date: '2026-03-21T12:30:00Z',
    competition: 'Premier League',
    status: 'UPCOMING',
    venue: 'Etihad Stadium'
  },
  {
    id: 'pl-2',
    homeTeam: { id: 'ars', name: 'Arsenal', shortName: 'ARS', logo: 'https://picsum.photos/seed/ars/100/100', color: '#EF0107' },
    awayTeam: { id: 'che', name: 'Chelsea', shortName: 'CHE', logo: 'https://picsum.photos/seed/che/100/100', color: '#034694' },
    date: '2026-03-23T19:45:00Z',
    competition: 'Premier League',
    status: 'UPCOMING',
    venue: 'Emirates Stadium'
  },
  // La Liga
  {
    id: 'll-1',
    homeTeam: { id: 'rma', name: 'Real Madrid', shortName: 'RMA', logo: 'https://picsum.photos/seed/rma/100/100', color: '#FEBE10' },
    awayTeam: { id: 'bar', name: 'Barcelona', shortName: 'BAR', logo: 'https://picsum.photos/seed/bar/100/100', color: '#A50044' },
    date: '2026-03-22T20:00:00Z',
    competition: 'La Liga',
    status: 'UPCOMING',
    venue: 'Santiago Bernabéu'
  },
  {
    id: 'll-2',
    homeTeam: { id: 'atm', name: 'Atlético Madrid', shortName: 'ATM', logo: 'https://picsum.photos/seed/atm/100/100', color: '#CB3524' },
    awayTeam: { id: 'sev', name: 'Sevilla', shortName: 'SEV', logo: 'https://picsum.photos/seed/sev/100/100', color: '#D42028' },
    date: '2026-03-21T15:15:00Z',
    competition: 'La Liga',
    status: 'UPCOMING',
    venue: 'Cívitas Metropolitano'
  },
  // Bundesliga
  {
    id: 'bl-1',
    homeTeam: { id: 'bay', name: 'Bayern Munich', shortName: 'FCB', logo: 'https://picsum.photos/seed/bay/100/100', color: '#DC052D' },
    awayTeam: { id: 'bvb', name: 'Borussia Dortmund', shortName: 'BVB', logo: 'https://picsum.photos/seed/bvb/100/100', color: '#FDE100' },
    date: '2026-03-21T17:30:00Z',
    competition: 'Bundesliga',
    status: 'UPCOMING',
    venue: 'Allianz Arena'
  },
  {
    id: 'bl-2',
    homeTeam: { id: 'b04', name: 'Bayer Leverkusen', shortName: 'B04', logo: 'https://picsum.photos/seed/b04/100/100', color: '#E32221' },
    awayTeam: { id: 'rbl', name: 'RB Leipzig', shortName: 'RBL', logo: 'https://picsum.photos/seed/rbl/100/100', color: '#DD013F' },
    date: '2026-03-22T14:30:00Z',
    competition: 'Bundesliga',
    status: 'UPCOMING',
    venue: 'BayArena'
  },
  // Serie A
  {
    id: 'sa-1',
    homeTeam: { id: 'int', name: 'Inter Milan', shortName: 'INT', logo: 'https://picsum.photos/seed/int/100/100', color: '#0066B2' },
    awayTeam: { id: 'juv', name: 'Juventus', shortName: 'JUV', logo: 'https://picsum.photos/seed/juv/100/100', color: '#000000' },
    date: '2026-03-22T19:45:00Z',
    competition: 'Serie A',
    status: 'UPCOMING',
    venue: 'San Siro'
  },
  {
    id: 'sa-2',
    homeTeam: { id: 'mil', name: 'AC Milan', shortName: 'ACM', logo: 'https://picsum.photos/seed/acm/100/100', color: '#FB090B' },
    awayTeam: { id: 'nap', name: 'Napoli', shortName: 'NAP', logo: 'https://picsum.photos/seed/nap/100/100', color: '#003E7E' },
    date: '2026-03-21T19:45:00Z',
    competition: 'Serie A',
    status: 'UPCOMING',
    venue: 'San Siro'
  },
  // Ligue 1
  {
    id: 'l1-1',
    homeTeam: { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', logo: 'https://picsum.photos/seed/psg/100/100', color: '#004170' },
    awayTeam: { id: 'om', name: 'Marseille', shortName: 'OM', logo: 'https://picsum.photos/seed/om/100/100', color: '#00ABF3' },
    date: '2026-03-22T19:45:00Z',
    competition: 'Ligue 1',
    status: 'UPCOMING',
    venue: 'Parc des Princes'
  },
  // Eredivisie
  {
    id: 'ed-1',
    homeTeam: { id: 'aja', name: 'Ajax', shortName: 'AJA', logo: 'https://picsum.photos/seed/aja/100/100', color: '#D2122E' },
    awayTeam: { id: 'psv', name: 'PSV Eindhoven', shortName: 'PSV', logo: 'https://picsum.photos/seed/psv/100/100', color: '#FF0000' },
    date: '2026-03-22T13:30:00Z',
    competition: 'Eredivisie',
    status: 'UPCOMING',
    venue: 'Johan Cruyff Arena'
  },
  // Primeira Liga
  {
    id: 'plp-1',
    homeTeam: { id: 'ben', name: 'Benfica', shortName: 'SLB', logo: 'https://picsum.photos/seed/ben/100/100', color: '#FF0000' },
    awayTeam: { id: 'por', name: 'FC Porto', shortName: 'FCP', logo: 'https://picsum.photos/seed/por/100/100', color: '#005CA9' },
    date: '2026-03-21T20:30:00Z',
    competition: 'Primeira Liga',
    status: 'UPCOMING',
    venue: 'Estádio da Luz'
  },
  // UEFA Champions League
  {
    id: 'ucl-1',
    homeTeam: { id: 'mci', name: 'Manchester City', shortName: 'MCI', logo: 'https://picsum.photos/seed/mci/100/100', color: '#6CABDD' },
    awayTeam: { id: 'rma', name: 'Real Madrid', shortName: 'RMA', logo: 'https://picsum.photos/seed/rma/100/100', color: '#FEBE10' },
    date: '2026-04-07T19:00:00Z',
    competition: 'Champions League',
    status: 'UPCOMING',
    venue: 'Etihad Stadium'
  },
  {
    id: 'ucl-2',
    homeTeam: { id: 'bay', name: 'Bayern Munich', shortName: 'FCB', logo: 'https://picsum.photos/seed/bay/100/100', color: '#DC052D' },
    awayTeam: { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG', logo: 'https://picsum.photos/seed/psg/100/100', color: '#004170' },
    date: '2026-04-08T19:00:00Z',
    competition: 'Champions League',
    status: 'UPCOMING',
    venue: 'Allianz Arena'
  },
  // UEFA Europa League
  {
    id: 'uel-1',
    homeTeam: { id: 'mun', name: 'Manchester United', shortName: 'MUN', logo: 'https://picsum.photos/seed/mun/100/100', color: '#DA291C' },
    awayTeam: { id: 'rom', name: 'AS Roma', shortName: 'ROM', logo: 'https://picsum.photos/seed/rom/100/100', color: '#8E1F2F' },
    date: '2026-04-09T19:00:00Z',
    competition: 'Europa League',
    status: 'UPCOMING',
    venue: 'Old Trafford'
  },
  // UEFA Conference League
  {
    id: 'uecl-1',
    homeTeam: { id: 'ast', name: 'Aston Villa', shortName: 'AVL', logo: 'https://picsum.photos/seed/avl/100/100', color: '#670E36' },
    awayTeam: { id: 'fio', name: 'Fiorentina', shortName: 'FIO', logo: 'https://picsum.photos/seed/fio/100/100', color: '#4B2E83' },
    date: '2026-04-09T19:00:00Z',
    competition: 'Conference League',
    status: 'UPCOMING',
    venue: 'Villa Park'
  }
];
