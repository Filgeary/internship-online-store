export const detectCommandInText = (text: string) => {
  const mapActionsToTextSentences = {
    greeting: ['hello', 'hi', 'hey', "what's up", 'howdy', 'hello there', 'how are you'],
    goodbye: ['goodbye', 'bye', 'see you, later', 'adios', 'see you soon'],
    action: ['i can do a lot of things, fetch github users for example'],
    github: ['loading...'],
    empty: [
      "i don't know what you want me to do",
      'what do you want me to do?',
      "i don't understand",
    ],
    random: [
      "i don't know what you want me to do",
      'maybe you want me to do something else',
      "i don't understand",
      'are you sure you want to do that?',
      'are you kidding me?',
      "i'm not sure, sorry",
    ],
  } as const;
  type TMapActionsToTextSentences = keyof typeof mapActionsToTextSentences;

  let match: TMapActionsToTextSentences;
  let count = 0;

  const greetingRegex = /^(hello|hi|hey|good morning|good afternoon|good evening|good night)/i;
  const goodbyeRegex = /(goodbye|bye|see you)/i;
  const possibleActionsAsRegex = /(action|do|can you do|activity|practice|exercise|work)/i;
  const fetchingFromGitHubAsRegex = /(fetch github|github|github api)/i;
  const countNumberAsRegex = /(\d+)/i;

  const textWithoutSpecialChars = /[^a-z\s]/gi;

  if (greetingRegex.test(text)) {
    match = 'greeting';
  } else if (goodbyeRegex.test(text)) {
    match = 'goodbye';
  } else if (possibleActionsAsRegex.test(text)) {
    match = 'action';
  } else if (fetchingFromGitHubAsRegex.test(text)) {
    match = 'github';
  } else if (textWithoutSpecialChars.test(text)) {
    match = 'empty';
  } else {
    match = 'random';
  }
  count = +(text.match(countNumberAsRegex)?.at(0) || 1);

  const actionList = mapActionsToTextSentences[match];
  const randomAction = actionList?.[Math.floor(Math.random() * actionList.length)];

  return {
    match,
    action: randomAction,
    count,
  };
};
