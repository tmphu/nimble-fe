import {
  RESULT_PAGE_SIZE,
  RESULT_PAGE_SIZE_IN_DASHBOARD,
  UPLOAD_PAGE_SIZE,
  UPLOAD_PAGE_SIZE_IN_DASHBOARD,
  UPLOAD_TABLE_HEADERS,
} from "../../helper/constants";
import DateTimeConverter from "../../helper/datetime.helper";
import uploadService from "../common/uploadService";
import {
  buildEmptyEl,
  buildSearchBar,
  buildTable,
  buildTextLink,
  handleSearch,
  toastMsg,
} from "../common/common";
import { buildSearchResultsTable } from "../result/result";
import { Ping } from "../../helper/ping";

export async function handleUploadFile() {
  const fileInput = document.getElementById("formFile");
  const file = fileInput.files[0];
  const elementId = "main-title";

  const formData = new FormData();
  formData.append("file", file);

  try {
    if (!file) {
      toastMsg("warning", "There is no file selected!", elementId);
      return;
    }

    const reader = new FileReader();
    let fileContent = '';
    reader.addEventListener('load', event => {
      fileContent = event.target.result;
    })
    reader.readAsText(file);

    await uploadService.uploadCsv(formData);
    fileInput.value = null;

    toastMsg("success", "Upload successfully!", elementId);

    const ping = Math.ceil(fileContent.split('\n')?.length / 5)*5;
    if (window.location.pathname === "/uploads.html") {
      const isShowDashboard = false;
      await buildUploadRecordsTable(UPLOAD_PAGE_SIZE, isShowDashboard);

      await new Ping(ping, 3000).execute(async () => {
        await buildSearchResultsTable(RESULT_PAGE_SIZE, isShowDashboard);
      });
    } else {
      const isShowDashboard = true;
      await buildUploadRecordsTable(UPLOAD_PAGE_SIZE_IN_DASHBOARD, isShowDashboard);

      await new Ping(ping, 3000).execute(async () => {
        await buildSearchResultsTable(RESULT_PAGE_SIZE_IN_DASHBOARD, isShowDashboard);
      });
    }
  } catch (err) {
    toastMsg("failed", `Upload failed! Error: ${err.message}`, elementId);
  }
}

export async function buildUploadRecordsTable(pageSize, isShowDashboard) {
  ["upload-list", "navupload-section"].forEach((el) => {
    const div = document.getElementById(el);
    div && div.remove();
  });

  const reqPage = 1;
  const res = await uploadService.getUploadRecords(reqPage, pageSize);
  if (!res) return buildEmptyEl();

  const mainId = "upload-section";
  const tableId = "upload-list";
  const tBodyId = "upload-tbody";
  const navId = "nav"+mainId;
  const searchPlaceholder = "Search file";
  const totalPage = Math.ceil(res.total / pageSize);
  const getDataFn = uploadService.getUploadRecords;
  const viewMore = "/uploads.html";

  !document.getElementById("search-bar") &&
    !isShowDashboard &&
    buildSearchBar(
      mainId,
      searchPlaceholder,
      handleSearch,
      reqPage,
      pageSize,
      getDataFn,
      buildUploadTBody,
      tBodyId,
      navId,
      isShowDashboard
    );

  buildTable(
    mainId,
    tableId,
    tBodyId,
    UPLOAD_TABLE_HEADERS,
    res.data,
    totalPage,
    pageSize,
    uploadService.getUploadRecords,
    buildUploadTBody,
    isShowDashboard,
    viewMore
  );
}

export const buildUploadTBody = (elementId, data = []) => {
  const fragment = document.createDocumentFragment();
  data.forEach((e) => {
    const tr = document.createElement("tr");
    const arr = [
      e.id,
      DateTimeConverter.convert(e.createdAt),
      e.fileName,
      e.status,
    ];
    for (let i = 0; i < arr.length; i++) {
      const el = document.createElement("td");
      el.textContent = arr[i];
      tr.appendChild(el);
    }

    fragment.appendChild(tr);
  });

  return fragment;
};
