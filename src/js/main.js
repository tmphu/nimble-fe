// Import our custom CSS
import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';
import { showChart } from './dashboard';
import { userService } from './userService';

showChart();
userService.hello();