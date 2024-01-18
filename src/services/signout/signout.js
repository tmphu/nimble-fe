import { userService } from '../common/userService';

export async function signOut() {
  userService.signOut();
  window.location.href = '/';
}