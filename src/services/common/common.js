import * as bootstrap from "bootstrap";

export function toastMsg(type, msg, elementId) {
  const toastDiv = document.createElement("div");
  toastDiv.classList.add(
    "toast",
    "align-items-center",
    "border-0",
    "toast-top-right",
    "position-fixed"
  );
  toastDiv.id = "toast";

  switch (type) {
    case "success":
      toastDiv.classList.add("bg-success", "text-white");
      toastDiv.innerHTML = buildToastEl(msg);
      break;
    case "warning":
      toastDiv.classList.add("bg-warning", "text-dark");
      toastDiv.innerHTML = buildToastEl(msg);
      break;
    case "failed":
      toastDiv.classList.add("bg-danger", "text-white");
      toastDiv.innerHTML = buildToastEl(msg);
      break;
    default:
      break;
  }

  const mainTitleDiv = document.getElementById(elementId);
  mainTitleDiv.appendChild(toastDiv);
  const toastEl = new bootstrap.Toast(toastDiv);
  toastEl.show();
}

export const buildToastEl = (message) => {
  return `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
};

export const buildEmptyEl = () => {
  return `
    <div class="text-danger">
      You don't have any record!
    </div>
  `;
};

export const buildTextLink = (textName, callback) => {
  const link = document.createElement("a");
  link.classList.add("link-primary");
  link.role = "button";
  link.textContent = textName;
  link.addEventListener("click", callback);

  return link;
};

export const buildTable = (
  mainId,
  tableId,
  tBodyId,
  headers,
  data,
  totalPage,
  pageSize,
  getDataFn,
  buildTBodyFn,
  isShowDashboard,
  viewMore,
) => {
  const fragment = document.createDocumentFragment();

  // table div
  const tableDiv = document.createElement("div");
  tableDiv.id = tableId;
  tableDiv.classList.add("table-responsive", "small");

  // table
  const table = document.createElement("table");
  table.classList.add("table", "table-striped", "table-sm");

  // table headers
  const tableHead = document.createElement("thead");
  const tr = document.createElement("tr");
  headers.forEach((el) => {
    const th = document.createElement("th");
    th.setAttribute("scope", "col");
    th.textContent = el;
    tr.appendChild(th);
  });
  tableHead.appendChild(tr);
  table.appendChild(tableHead);

  // table body
  const tbody = document.createElement("tbody");
  tbody.id = tBodyId;
  tbody.appendChild(buildTBodyFn(tBodyId, data));

  table.appendChild(tbody);

  tableDiv.appendChild(table);

  // add search bar & table
  fragment.appendChild(tableDiv);

  // add navigation
  const navDiv = document.createElement("div");
  navDiv.id = "nav"+mainId;
  if (isShowDashboard) {
    navDiv.appendChild(
      buildTextLink(
        "View more",
        () => (window.location.href = viewMore)
      )
    );
    fragment.appendChild(navDiv);
  } else {
    navDiv.appendChild(
      buildPaginationNav(totalPage, pageSize, getDataFn, buildTBodyFn, tBodyId)
    );
    fragment.appendChild(navDiv);
  }

  document.getElementById(mainId).append(fragment);
};

export const buildSearchBar = (
  mainId,
  searchPlaceholder,
  handleSearchFn,
  reqPage,
  pageSize,
  getDataFn,
  buildUploadTBody,
  tBodyId,
  navId,
  isShowDashboard,
) => {
  // search div
  const searchDiv = document.createElement("div");
  searchDiv.id = "search-bar";
  searchDiv.classList.add("mb-3");

  // search form
  const form = document.createElement("form");
  form.classList.add("d-flex");

  // input
  const input = document.createElement("input");
  input.classList.add("form-control", "me-2");
  input.setAttribute("type", "search");
  input.setAttribute("placeholder", searchPlaceholder);
  input.addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      await handleSearchFn(
        input.value,
        reqPage,
        pageSize,
        getDataFn,
        buildUploadTBody,
        tBodyId,
        navId,
        isShowDashboard,
      );
    }
  });

  // search btn
  const button = document.createElement("button");
  button.classList.add("btn", "btn-outline-success");
  button.setAttribute("type", "submit");
  button.textContent = "Search";
  button.addEventListener("click", async function (event) {
    event.preventDefault();
    await handleSearchFn(
      input.value,
      reqPage,
      pageSize,
      getDataFn,
      buildUploadTBody,
      tBodyId,
      navId,
      isShowDashboard,
    );
  });

  // add search form
  form.appendChild(input);
  form.appendChild(button);

  // add search
  searchDiv.appendChild(form);
  document.getElementById(mainId).append(searchDiv);
};

export const buildPaginationNav = (
  totalPage,
  pageSize,
  getDataFn,
  buildTBodyFn,
  elementId,
  searchStr,
) => {
  const navEl = document.createElement("nav");
  const ulEl = document.createElement("ul");
  ulEl.id = "pagination-nav";
  ulEl.classList.add("pagination", "pagination-sm", "justify-content-end");

  const createLiEl = (content, dataValue, handleNavFn) => {
    const liEl = document.createElement("li");
    liEl.classList.add("page-item");
    liEl.setAttribute("type", "button");
    liEl.setAttribute("data-value", dataValue);
    liEl.addEventListener("click", async () => {
      await handleNavFn(dataValue, pageSize, getDataFn, buildTBodyFn, elementId, searchStr);
    });

    const aEl = document.createElement("a");
    aEl.classList.add("page-link");
    aEl.textContent = content;
    liEl.appendChild(aEl);

    return liEl;
  };

  for (let i = 1; i <= totalPage; i++) {
    const liEl = createLiEl(i.toString(), i.toString(), handleNavigation);
    i === 1 && liEl.classList.add("active");
    ulEl.appendChild(liEl);
  }

  navEl.appendChild(ulEl);
  return navEl;
};

export const handleNavigation = async (
  pageClicked,
  pageSize,
  getDataFn,
  buildTBodyFn,
  elementId,
  searchStr,
) => {
  document.getElementById(elementId).innerHTML = "";
  const navEl = document.getElementById("pagination-nav");
  for (const el of navEl.getElementsByTagName("li")) {
    el.classList.remove("active");
  }
  const selected = navEl.querySelector(`li[data-value="${pageClicked}"]`);
  selected && selected.classList.add("active");

  const data = await getDataFn(pageClicked, pageSize, searchStr);
  document
    .getElementById(elementId)
    .appendChild(buildTBodyFn(elementId, data.data));
};

export const handleSearch = async (
  searchStr,
  reqPage,
  pageSize,
  getDataFn,
  buildTBodyFn,
  tBodyId,
  navId,
  isShowDashboard,
) => {
  [tBodyId, navId].forEach((el) => {
    document.getElementById(el).innerHTML = "";
  });

  const data = await getDataFn(reqPage, pageSize, searchStr);
  const totalPage = Math.ceil(data.total / pageSize);
  // rebuild tbody
  document
    .getElementById(tBodyId)
    .appendChild(buildTBodyFn(tBodyId, data.data));

  // rebuild nav
  const navDiv = document.getElementById(navId);
  if (isShowDashboard) {
    navDiv.appendChild(
      buildTextLink(
        "View more uploads",
        () => (window.location.href = "/uploads.html")
      )
    );
  } else {
    navDiv.appendChild(
      buildPaginationNav(totalPage, pageSize, getDataFn, buildTBodyFn, tBodyId, searchStr)
    );
  }
};
