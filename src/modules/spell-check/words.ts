export interface WordPair {
  correct: string;
  misspelled: string;
}

// Common misspellings - each pair has the correct spelling and a common error
export const wordPairs: WordPair[] = [
  { correct: 'accommodate', misspelled: 'accomodate' },
  { correct: 'acquire', misspelled: 'aquire' },
  { correct: 'across', misspelled: 'accross' },
  { correct: 'address', misspelled: 'adress' },
  { correct: 'amateur', misspelled: 'amatuer' },
  { correct: 'apparent', misspelled: 'apparant' },
  { correct: 'argument', misspelled: 'arguement' },
  { correct: 'beginning', misspelled: 'begining' },
  { correct: 'believe', misspelled: 'beleive' },
  { correct: 'business', misspelled: 'buisness' },
  { correct: 'calendar', misspelled: 'calender' },
  { correct: 'category', misspelled: 'catagory' },
  { correct: 'cemetery', misspelled: 'cemetary' },
  { correct: 'colleague', misspelled: 'collegue' },
  { correct: 'coming', misspelled: 'comming' },
  { correct: 'committee', misspelled: 'commitee' },
  { correct: 'completely', misspelled: 'completly' },
  { correct: 'conscious', misspelled: 'concious' },
  { correct: 'consensus', misspelled: 'concensus' },
  { correct: 'definitely', misspelled: 'definately' },
  { correct: 'disappear', misspelled: 'dissapear' },
  { correct: 'disappoint', misspelled: 'dissapoint' },
  { correct: 'embarrass', misspelled: 'embarass' },
  { correct: 'environment', misspelled: 'enviroment' },
  { correct: 'exaggerate', misspelled: 'exagerate' },
  { correct: 'excellent', misspelled: 'excellant' },
  { correct: 'existence', misspelled: 'existance' },
  { correct: 'experience', misspelled: 'experiance' },
  { correct: 'familiar', misspelled: 'familar' },
  { correct: 'finally', misspelled: 'finaly' },
  { correct: 'foreign', misspelled: 'foriegn' },
  { correct: 'friend', misspelled: 'freind' },
  { correct: 'government', misspelled: 'goverment' },
  { correct: 'grammar', misspelled: 'grammer' },
  { correct: 'grateful', misspelled: 'greatful' },
  { correct: 'guarantee', misspelled: 'guarentee' },
  { correct: 'harass', misspelled: 'harrass' },
  { correct: 'height', misspelled: 'heighth' },
  { correct: 'hierarchy', misspelled: 'heirarchy' },
  { correct: 'humorous', misspelled: 'humourous' },
  { correct: 'ignorance', misspelled: 'ignorence' },
  { correct: 'immediate', misspelled: 'immediete' },
  { correct: 'independent', misspelled: 'independant' },
  { correct: 'intelligence', misspelled: 'intelligance' },
  { correct: 'jewelry', misspelled: 'jewlery' },
  { correct: 'judgment', misspelled: 'judgement' },
  { correct: 'knowledge', misspelled: 'knowlege' },
  { correct: 'leisure', misspelled: 'liesure' },
  { correct: 'library', misspelled: 'libary' },
  { correct: 'license', misspelled: 'lisence' },
  { correct: 'maintenance', misspelled: 'maintainance' },
  { correct: 'medieval', misspelled: 'medeval' },
  { correct: 'millennium', misspelled: 'millenium' },
  { correct: 'miniature', misspelled: 'minature' },
  { correct: 'mischievous', misspelled: 'mischevious' },
  { correct: 'necessary', misspelled: 'neccessary' },
  { correct: 'neighbor', misspelled: 'nieghbor' },
  { correct: 'noticeable', misspelled: 'noticable' },
  { correct: 'occasion', misspelled: 'occassion' },
  { correct: 'occurrence', misspelled: 'occurence' },
  { correct: 'parallel', misspelled: 'paralell' },
  { correct: 'particular', misspelled: 'particuler' },
  { correct: 'pastime', misspelled: 'passtime' },
  { correct: 'perceive', misspelled: 'percieve' },
  { correct: 'permanent', misspelled: 'permanant' },
  { correct: 'perseverance', misspelled: 'perseverence' },
  { correct: 'personnel', misspelled: 'personel' },
  { correct: 'possession', misspelled: 'posession' },
  { correct: 'preferred', misspelled: 'prefered' },
  { correct: 'privilege', misspelled: 'priviledge' },
  { correct: 'probably', misspelled: 'probaly' },
  { correct: 'profession', misspelled: 'proffession' },
  { correct: 'pronunciation', misspelled: 'pronounciation' },
  { correct: 'publicly', misspelled: 'publically' },
  { correct: 'questionnaire', misspelled: 'questionaire' },
  { correct: 'receive', misspelled: 'recieve' },
  { correct: 'recommend', misspelled: 'reccomend' },
  { correct: 'reference', misspelled: 'refrence' },
  { correct: 'relevant', misspelled: 'relevent' },
  { correct: 'religious', misspelled: 'religous' },
  { correct: 'remember', misspelled: 'rember' },
  { correct: 'repetition', misspelled: 'repitition' },
  { correct: 'restaurant', misspelled: 'restaraunt' },
  { correct: 'rhythm', misspelled: 'rythm' },
  { correct: 'schedule', misspelled: 'schedual' },
  { correct: 'separate', misspelled: 'seperate' },
  { correct: 'sergeant', misspelled: 'sargeant' },
  { correct: 'similar', misspelled: 'similiar' },
  { correct: 'sincerely', misspelled: 'sincerly' },
  { correct: 'special', misspelled: 'speciel' },
  { correct: 'succeed', misspelled: 'succede' },
  { correct: 'surprise', misspelled: 'suprise' },
  { correct: 'temperature', misspelled: 'temprature' },
  { correct: 'thorough', misspelled: 'thourgh' },
  { correct: 'tomorrow', misspelled: 'tommorrow' },
  { correct: 'truly', misspelled: 'truely' },
  { correct: 'until', misspelled: 'untill' },
  { correct: 'usually', misspelled: 'usally' },
  { correct: 'vacuum', misspelled: 'vaccum' },
  { correct: 'various', misspelled: 'varous' },
  { correct: 'vegetable', misspelled: 'vegatable' },
  { correct: 'Wednesday', misspelled: 'Wendsday' },
  { correct: 'weird', misspelled: 'wierd' },
  { correct: 'whether', misspelled: 'wether' },
  { correct: 'writing', misspelled: 'writting' },
];

export interface Trial {
  word: string;
  isCorrect: boolean;
  sourceWord: string; // The correct spelling for reference
}

// Shuffle array using Fisher-Yates
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateTrials(count: number): Trial[] {
  const shuffledPairs = shuffle(wordPairs);
  const trials: Trial[] = [];

  for (let i = 0; i < count && i < shuffledPairs.length; i++) {
    const pair = shuffledPairs[i];
    // 50% chance of showing correct or misspelled version
    const showCorrect = Math.random() < 0.5;

    trials.push({
      word: showCorrect ? pair.correct : pair.misspelled,
      isCorrect: showCorrect,
      sourceWord: pair.correct
    });
  }

  return trials;
}
