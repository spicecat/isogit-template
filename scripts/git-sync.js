import fs from 'node:fs';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

const dir = process.cwd();
const url = process.env.GIT_ORIGIN;
const author = { name: process.env.GIT_AUTHOR_NAME, email: process.env.GIT_AUTHOR_EMAIL };

const onAuth = () => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN environment variable is not set.');
  return { username: token, password: '' };
};

const baseOpts = { fs, dir };
const authOpts = { ...baseOpts, http, onAuth, ref: 'main' };

const commands = {
  init: async () => {
    if (!url) throw new Error('GIT_ORIGIN environment variable is not set.');

    console.log('Initializing local git repository...');
    await git.init(baseOpts);
    await git.addRemote({ ...baseOpts, remote: 'origin', url });

    console.log('Fetching main branch...');
    await git.fetch({ ...authOpts, remote: 'origin', singleBranch: true });

    console.log('Checking out main branch...');
    await git.checkout({ ...baseOpts, ref: 'main', force: true });
    console.log('Repository initialized successfully.');
  },

  pull: async () => {
    console.log('Pulling latest changes...');
    await git.pull({ ...authOpts, singleBranch: true, author });
    console.log('Pull successful.');
  },

  push: async (message = 'Update') => {
    console.log('Checking file statuses...');
    const status = await git.statusMatrix(baseOpts);
    let hasChanges = false;

    for (const [filepath, head, workdir, stage] of status) {
      if (filepath.startsWith('.git/') || filepath.startsWith('node_modules/')) continue;

      if (workdir !== head || workdir !== stage) {
        hasChanges = true;
        if (workdir === 0) {
          await git.remove({ ...baseOpts, filepath });
        } else {
          await git.add({ ...baseOpts, filepath });
        }
      }
    }

    if (!hasChanges) {
      console.log('No changes to commit.');
      return;
    }

    console.log(`Committing: "${message}"`);
    await git.commit({ ...baseOpts, message, author });

    console.log('Pushing to remote...');
    const result = await git.push({ ...authOpts, remote: 'origin' });

    if (!result.ok) {
      throw new Error(`Push failed: ${JSON.stringify(result)}`);
    }
    console.log('Push completed successfully.');
  },

  help: () => {
    console.log([
      'Usage:',
      '  node git-sync.js init          # Init .git, add remote, and fetch main branch',
      '  node git-sync.js pull          # Pull remote changes from main',
      '  node git-sync.js push "MSG"    # Stage, commit all changes, and push to main'
    ].join('\n'));
  }
};

async function main() {
  const [command, arg1] = process.argv.slice(2);
  const action = commands[command] ?? commands.help;

  try {
    await action(arg1);
  } catch (err) {
    console.error('Operation failed:', err.message ?? err);
    process.exit(1);
  }
}

main();