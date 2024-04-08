// @ts-check
import { detectCommandInText } from '../utils/detectCommandInText';
import { githubUsers } from '../utils/github-users';

self.addEventListener('message', ({ data }) => {
  const command = detectCommandInText(data);
  let count = 0;

  /**
   * @param {string} userName
   */
  const fetchGithubUser = async userName => {
    const response = await fetch(`https://api.github.com/users/${userName}`);
    const data = await response.json();
    return data;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  count = command.count || 1; // TODO: use it later

  setTimeout(() => {
    postMessage(command.action);
  }, 400);

  /**
   * @param {unknown} data
   * @param {{isGithubUser?: boolean}} options
   */
  function postMessage(data, options = {}) {
    const message = {
      _id: self.crypto.randomUUID(),
      text: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
      dateCreate: new Date().toISOString(),
      author: {
        _id: self.crypto.randomUUID(),
        username: 'worker-chat-bot',
        profile: {
          name: 'worker-chat-bot',
          avatar: {
            url: undefined,
          },
        },
      },
      __isGithubUser: options.isGithubUser,
    };

    self.postMessage(message);
  }

  if (command.match === 'github') {
    const randomGithubUser = githubUsers[Math.floor(Math.random() * githubUsers.length)];

    setTimeout(() => {
      fetchGithubUser(randomGithubUser)
        .then(data => {
          postMessage(data, { isGithubUser: true });
        })
        .catch(err => {
          console.log(err);
        });
    }, 900);
  }
});
