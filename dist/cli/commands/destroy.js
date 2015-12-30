import path from 'path';
import chalk from 'chalk';
import program from 'commander';
import isDenaliApp from '../../utils/is-denali-app';
import destroy from '../../utils/destroy-blueprint';

program
  .usage('<blueprint> <name>')
  .description('Remove scaffolded code for your app. Only deletes files if they\nare identical to the scaffolded output - changed files are ignored.')
  .parse(process.argv);

let [ blueprintName, instanceName ] = program.args;

if (blueprintName === 'app') {
  console.error(chalk.red('To destroy an app, just delete the root folder.'));
} else if (blueprintName === 'addon') {
  console.error(chalk.red('To remvoe an addon from an app, just remove it from your package.json.'));
} else {
  if (isDenaliApp(process.cwd())) {
    destroy({
      src: path.join(__dirname, '..', 'blueprints', blueprintName),
      dest: process.cwd(),
      args: program.args
    });
    console.log(chalk.green(`\n${ instanceName } ${ blueprintName } removed!`));
  } else {
    console.error(chalk.red('You must be inside a Denali application to run the generate command.'));
  }
}


let [ blueprintName, instanceName ] = program.args.shift();

if (blueprintName === 'app') {
  console.error(chalk.red(`Try denali new ${ instanceName } instead.`));
} else if (blueprintName === 'addon') {
  console.error(chalk.red(`Try denali addon ${ instanceName } instead.`));
} else {
  if (isDenaliApp(process.cwd())) {
    generate({
      src: path.join(__dirname, '..', 'blueprints', blueprintName),
      dest: process.cwd(),
      args: program.args
    });
    console.log(chalk.green(`\n${ instanceName } ${ blueprintName } created!`));
  } else {
    console.error(chalk.red('You must be inside a Denali application to run the generate command.'));
  }
}
