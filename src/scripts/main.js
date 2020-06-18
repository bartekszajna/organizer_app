import { Pic } from './importPic.js';
import '../styles/style.scss';

const myPic = document.createElement('img');
myPic.src = Pic;
myPic.style.width = '480px';
myPic.style.height = 'auto';
myPic.className = 'pic';

document.body.append(myPic);
