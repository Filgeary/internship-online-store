import { IGithubUser } from '../../types';

const GithubUserProfile = ({ user }: { user: IGithubUser }) => {
  if (!user) return null;

  const { login, avatar_url, location, name, bio, company, html_url, followers } = user;

  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={avatar_url}
        alt={login}
        style={{
          width: '250px',
          height: '250px',
          borderRadius: '50%',
        }}
      />
      <h2>{login}</h2>

      {/* nullish fields */}
      {name && <p>{name}</p>}
      {bio && <p>{bio}</p>}
      {company && (
        <p>
          <small>
            <i>Company:</i>
          </small>{' '}
          {company}
        </p>
      )}
      {location && (
        <p>
          <small>
            <i>Location:</i>
          </small>{' '}
          {location}
        </p>
      )}

      {/* non-nullish fields */}
      <p>
        <small>
          <i>Followers:</i>
        </small>{' '}
        {followers}
      </p>
      <a
        href={html_url}
        target='_blank'
        rel='noreferrer'
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '5px',
          textDecoration: 'none',
        }}
      >
        Open Profile on GitHub 👉
      </a>
    </div>
  );
};

export default GithubUserProfile;
