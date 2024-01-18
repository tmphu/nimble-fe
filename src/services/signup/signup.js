import { userService } from '../common/userService';
import { toastMsg } from '../common/common';

export async function signUp() {
  const name = document.getElementById('input-name').value;
  const email = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;

  try {
    const res = await userService.signUp({ name, email, password });
    window.location.href = '/login.html';
  } catch (err) {
    toastMsg('failed', err.message, 'signup-page');
  }
}