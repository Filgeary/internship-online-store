// @ts-check
import { detectCommandInText } from '../utils/detectCommandInText';
import { githubUsers } from '../utils/github-users';

self.addEventListener('message', ({ data }) => {
  const command = detectCommandInText(data);
  let textAnswer = '';
  let count = 0;

  /**
   * @param {string} userName
   */
  const fetchGithubUser = async userName => {
    const response = await fetch(`https://api.github.com/users/${userName}`);
    const data = await response.json();
    return data;
  };

  switch (command.match) {
    case 'greeting':
    case 'goodbye':
    case 'action':
    case 'github':
    case 'empty':
    case 'random':
      textAnswer = command.action;
      break;
    default:
      textAnswer = "i don't understand";
      break;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  count = command.count || 1; // TODO: use it later

  postMessage(textAnswer);

  /**
   * @param {unknown} data
   */
  function postMessage(data) {
    self.postMessage({
      owner: 'worker-echo',
      data,
      timestamp: new Date().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }),
    });
  }

  if (command.match === 'github') {
    const randomGithubUser = githubUsers[Math.floor(Math.random() * githubUsers.length)];

    setTimeout(() => {
      fetchGithubUser(randomGithubUser)
        .then(data => {
          postMessage(data);
        })
        .catch(err => {
          console.log(err);
        });
    }, 500);
  }
});
