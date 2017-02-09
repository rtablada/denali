import Bluebird from 'bluebird';
import { exec, ExecOptions } from 'child_process';
import {
  startCase
} from 'lodash';
import cmdExists from 'command-exists';
import ui from '../../lib/cli/ui';
import Blueprint from '../../lib/cli/blueprint';
import spinner from '../../lib/utils/spinner';
import pkg from '../../package.json';
import { CommandOptions } from '../../lib/cli/command';

const run = Bluebird.promisify<[ string, string ], string, ExecOptions>(exec);
const commandExists = Bluebird.promisify<boolean, string>(cmdExists);

export default class AddonBlueprint extends Blueprint {

  static blueprintName = 'addon';
  static description = 'Creates a new addon project, initializes git and installs dependencies';

  params = [ 'name' ];

  flags = {
    'skip-deps': {
      description: 'Do not install dependencies on new addon',
      defaultValue: false,
      type: Boolean
    },
    'use-npm': {
      description: 'Use npm to install dependencies, even if yarn is available',
      defaultValue: false,
      type: Boolean
    }
  }

  locals(options: CommandOptions) {
    let name = options.params.name;
    if (Array.isArray(name)) {
      name = name[0];
    }
    return {
      name,
      className: startCase(name).replace(/\s/g, ''),
      humanizedName: startCase(name),
      denaliVersion: pkg.version
    };
  }

  async postInstall(options: CommandOptions) {
    let name = options.params.name;
    if (Array.isArray(name)) {
      name = name[0];
    }
    ui.info('');
    spinner.start('Installing dependencies');
    if (!options.flags['skip-deps']) {
      let yarnExists: boolean = await commandExists('yarn');
      if (yarnExists && !options.flags['use-npm']) {
        await run('yarn install', { cwd: name });
      } else {
        await run('npm install --loglevel=error', { cwd: name });
      }
    }
    spinner.succeed();
    spinner.start('Setting up git repo');
    await run('git init', { cwd: name });
    await run('git add .', { cwd: name });
    await run('git commit -am "Initial denali project scaffold"', { cwd: name });
    spinner.succeed();
    spinner.finish('✨', `${ name } created`);
  }

}
