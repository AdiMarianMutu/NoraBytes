import path from 'path';
import shelljs from 'shelljs';

const rooDirPath = path.resolve(__dirname, '../');
const srcDirPath = path.resolve(rooDirPath, './src');
const distDirPath = path.resolve(rooDirPath, './dist');

shelljs.rm('-fr', distDirPath);
shelljs.mkdir(distDirPath);
shelljs.cp('-r', srcDirPath, distDirPath);

shelljs.cp(path.join(rooDirPath, 'README.md'), distDirPath);
shelljs.cp(path.join(rooDirPath, 'package.json'), distDirPath);
