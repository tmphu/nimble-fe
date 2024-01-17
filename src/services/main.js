// Import our custom CSS
import "../assets/scss/styles.scss";
import * as bootstrap from "bootstrap";
import {
  buildEmptyUploadEl,
  buildPaginationNav,
  buildTextLink,
  buildToastEl,
  buildUploadTBody,
} from "../helper/html.helper";
import uploadService from "./uploadService";
import {
  UPLOAD_PAGE_SIZE,
  UPLOAD_PAGE_SIZE_IN_DASHBOARD,
} from "../helper/constants";

export async function handleUploadFile() {
  const fileInput = document.getElementById("formFile");
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("file", file);

  const toastDiv = document.createElement("div");
  toastDiv.classList.add(
    "toast",
    "align-items-center",
    "border-0",
    "toast-top-right",
    "position-fixed"
  );
  toastDiv.id = "toast";
  let message;

  try {
    if (!file) {
      message = "There is no file selected!";
      toastDiv.classList.add("bg-warning", "text-dark");
      return;
    }

    await uploadService.uploadCsv(formData);
    fileInput.value = null;

    toastDiv.classList.add("bg-success", "text-white");
    message = "Upload successfully!";

    buildUploadRecordsTable();
  } catch (err) {
    toastDiv.classList.add("bg-danger", "text-white");
    message = `Upload failed! Error: ${err.message}`;
  } finally {
    toastDiv.innerHTML = buildToastEl(message);
    const mainTitleDiv = document.getElementById("main-title");
    mainTitleDiv.appendChild(toastDiv);
    const toastEl = new bootstrap.Toast(toastDiv);
    toastEl.show();
  }
}

export async function buildUploadRecordsTable(pageSize) {
  const uploadListDiv = document.getElementById("upload-list");
  uploadListDiv && uploadListDiv.remove();

  const res = await uploadService.getUploadRecords(1, pageSize);
  if (!res) return buildEmptyUploadEl();

  document.getElementById("upload-section").insertAdjacentHTML(
    "beforeend",
    `
    <div id="upload-list" class="table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Uploaded At</th>
            <th scope="col">File Name</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody id="upload-tbody">
        </tbody>
      </table>
    </div>
    `
  );

  buildUploadTBody("upload-tbody", res.uploads);

  if (pageSize === UPLOAD_PAGE_SIZE_IN_DASHBOARD) {
    document
      .getElementById("upload-list")
      .append(
        buildTextLink(
          "View more uploads",
          () => (window.location.href = "/uploads.html")
        )
      );
  } else {
    const page = Math.ceil(res.total / pageSize);
    document.getElementById("upload-section").append(buildPaginationNav(page, pageSize));
  }
}

export async function buildSearchResultsTable(pageSize) {
  const resultsList = document.getElementById("results-list");
  resultsList && resultsList.remove();

  const res = await uploadService.getUploadRecords(1, pageSize);
  if (!res) return buildEmptyUploadEl();

  document.getElementById("upload-section").insertAdjacentHTML(
    "beforeend",
    `
    <div id="upload-list" class="table-responsive small">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Uploaded At</th>
            <th scope="col">File Name</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody id="upload-tbody">
        </tbody>
      </table>
    </div>
    `
  );

  buildUploadTBody("upload-tbody", res.uploads);

  if (pageSize === UPLOAD_PAGE_SIZE_IN_DASHBOARD) {
    document
      .getElementById("upload-list")
      .append(
        buildTextLink(
          "View more uploads",
          () => (window.location.href = "/uploads.html")
        )
      );
  } else {
    const page = Math.ceil(res.total / pageSize);
    document.getElementById("upload-section").append(buildPaginationNav(page, pageSize));
  }
}

if (["/", "/index.html"].includes(window.location.pathname)) {
  buildUploadRecordsTable(UPLOAD_PAGE_SIZE_IN_DASHBOARD);
  document.getElementById("upload-button").onclick = handleUploadFile;
}

if (window.location.pathname === "/uploads.html") {
  buildUploadRecordsTable(UPLOAD_PAGE_SIZE);
  document.getElementById("upload-button").onclick = handleUploadFile;
}
