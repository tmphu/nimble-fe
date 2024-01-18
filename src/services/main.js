import "../assets/scss/styles.scss";
import {
  RESULT_PAGE_SIZE_IN_DASHBOARD,
  UPLOAD_PAGE_SIZE,
  UPLOAD_PAGE_SIZE_IN_DASHBOARD,
} from "../helper/constants";
import { userService } from './common/userService';
import { login } from './login/login';
import { signUp } from './signup/signup';
import { buildUploadRecordsTable, handleUploadFile } from './upload/upload';
import { buildSearchResultsTable } from './result/result';
import { signOut } from './signout/signout';

document.addEventListener('DOMContentLoaded', async function () {
  const jwtToken = userService.getJwt();
  const isValid = await userService.validateToken(jwtToken);

  if (!jwtToken && !isValid && ['/', '/index.html', '/results.html', '/uploads.html'].includes(window.location.pathname)) {
    window.location.href = '/login.html';
  }
})

if (window.location.pathname === "/login.html") {
  document.getElementById("login-btn").onclick = login;
  ['input-email', 'input-password'].forEach((el) => {
    document.getElementById(el).addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        login();
      }
    });
  })
}

if (window.location.pathname === "/signup.html") {
  document.getElementById("signup-btn").onclick = signUp;
  ['input-name', 'input-email', 'input-password'].forEach((el) => {
    document.getElementById(el).addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        signUp();
      }
    });
  })
}

if (["/", "/index.html"].includes(window.location.pathname)) {
  const isShowDashboard = true;
  await buildUploadRecordsTable(UPLOAD_PAGE_SIZE_IN_DASHBOARD, isShowDashboard);
  await buildSearchResultsTable(RESULT_PAGE_SIZE_IN_DASHBOARD, isShowDashboard);
  document.getElementById("upload-button").onclick = handleUploadFile;
}

if (window.location.pathname === "/uploads.html") {
  const isShowDashboard = false;
  await buildUploadRecordsTable(UPLOAD_PAGE_SIZE, isShowDashboard);
  document.getElementById("upload-button").onclick = handleUploadFile;
}

if (window.location.pathname === "/results.html") {
  await buildSearchResultsTable(UPLOAD_PAGE_SIZE);
}

if (!['/signup.html', 'login.html'].includes(window.location.pathname)) {
  document.getElementById('sign-out-btn').addEventListener('click', signOut);
}