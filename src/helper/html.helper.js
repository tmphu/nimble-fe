import DateTimeConverter from "../helper/datetime.helper";
import uploadService from "../services/uploadService";

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

export const buildEmptyUploadEl = () => {
  return `
    <div class="text-danger">
      You don't have any upload!
    </div>
  `;
};

export const buildUploadTBody = (elementId, data = []) => {
  data.forEach((e) => {
    const tr = document.createElement("tr");
    const arr = [
      e.id,
      DateTimeConverter.convert(e.createdAt),
      e.fileName,
      e.status,
      buildTextLink("View", () => console.log(e.id)),
    ];
    for (let i = 0; i <= 4; i++) {
      const el = document.createElement("td");
      el.textContent = arr[i];
      i === 4 && el.appendChild(arr[i]);
      tr.appendChild(el);
    }

    document.getElementById(elementId).appendChild(tr);
  });
};

export const buildTextLink = (textName, callback) => {
  const link = document.createElement("a");
  link.classList.add("link-primary");
  link.role = "button";
  link.textContent = textName;
  link.addEventListener("click", callback);

  return link;
};

export const buildPaginationNav = (page, pageSize) => {
  const navEl = document.createElement("nav");
  const ulEl = document.createElement("ul");
  ulEl.id = "pagination-nav";
  ulEl.classList.add("pagination", "pagination-sm", "justify-content-end");

  const createLiEl = (content, dataValue, callback) => {
    const liEl = document.createElement("li");
    liEl.classList.add("page-item");
    liEl.setAttribute("type", "button");
    liEl.setAttribute("data-value", dataValue);
    liEl.addEventListener('click', () => { callback(dataValue, pageSize) });

    const aEl = document.createElement("a");
    aEl.classList.add("page-link");
    aEl.textContent = content;
    liEl.appendChild(aEl);

    return liEl;
  };

  for (let i = 1; i <= page; i++) {
    const liEl = createLiEl(i.toString(), i.toString(), handleNavigation);
    (i === 1) && liEl.classList.add("active");
    ulEl.appendChild(liEl);
  }

  return navEl.appendChild(ulEl);
};

export const handleNavigation = async (clicked, pageSize) => {
  document.getElementById("upload-tbody").innerHTML = '';
  const navEl = document.getElementById("pagination-nav");
  for (const el of navEl.getElementsByTagName("li")) {
    el.classList.remove("active");
  }
  const selected = navEl.querySelector(`li[data-value="${clicked}"]`);
  selected && selected.classList.add("active");

  const data = await uploadService.getUploadRecords(clicked, pageSize);
  buildUploadTBody("upload-tbody", data.uploads);
}