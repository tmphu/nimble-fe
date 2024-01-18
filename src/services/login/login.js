import { userService } from '../common/userService';
import { toastMsg } from '../common/common';

export async function login() {
  const email = document.getElementById('input-email').value;
  const password = document.getElementById('input-password').value;

  try {
    const res = await userService.login({ email, password });
    if (!res) throw new Error('unknown error');

    userService.setJwt(res.token);
    userService.setUserInfo(res.user);
    window.location.href = '/index.html';
  } catch (err) {
    toastMsg('failed', err.message, 'login-page');
  }
}