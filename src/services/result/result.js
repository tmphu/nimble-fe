import { RESULT_PAGE_SIZE_IN_DASHBOARD, RESULT_TABLE_HEADERS } from '../../helper/constants';
import DateTimeConverter from '../../helper/datetime.helper';
import uploadService from '../common/uploadService';
import { buildEmptyEl, buildSearchBar, buildTable, handleSearch } from '../common/common';

export async function buildSearchResultsTable(pageSize, isShowDashboard) {
  ["result-list", "navsearch-result-section"].forEach((el) => {
    const div = document.getElementById(el);
    div && div.remove();
  });

  const reqPage = 1;
  const res = await uploadService.getResultRecords(reqPage, pageSize);
  if (!res) return buildEmptyEl();

  const mainId = "search-result-section";
  const tableId = "result-list";
  const tBodyId = "result-tbody";
  const navId = "nav"+mainId;
  const searchPlaceholder = "Search keyword";
  const totalPage = Math.ceil(res.total / pageSize);
  const getDataFn = uploadService.getResultRecords;
  const viewMore = '/results.html';

  !document.getElementById("search-bar") && !isShowDashboard &&
    buildSearchBar(
      mainId,
      searchPlaceholder,
      handleSearch,
      reqPage,
      pageSize,
      getDataFn,
      buildResultTBody,
      tBodyId,
      navId,
      isShowDashboard
    );
  
  buildTable(
    mainId,
    tableId,
    tBodyId,
    RESULT_TABLE_HEADERS,
    res.data,
    totalPage,
    pageSize,
    uploadService.getResultRecords,
    buildResultTBody,
    isShowDashboard,
    viewMore,
  );
}

export const buildResultTBody = (elementId, data = []) => {
  const fragment = document.createDocumentFragment();
  data.forEach((e) => {
    const tr = document.createElement("tr");
    const rowMap = new Map([
      ["id", e.id],
      ["searchedAt", e.searchedAt ? DateTimeConverter.convert(e.searchedAt) : null],
      ["keyword", e.keyword],
      ["result", e.result],
      ["snapshot", e.pageSnapshotPath],
      ["searchEngine", e.searchEngine],
      ["status", e.status],
    ]);

    rowMap.forEach((val, key) => {
      const el = document.createElement("td");
      if (key === "result") {
        for (const i in val) {
          const divEl = document.createElement("div");
          divEl.textContent = `${i}: ${val[i]}`;
          el.appendChild(divEl);
        }
        el.classList.add("text-wrap", "width-400");
      } else if (["result", "snapshot", "keyword"].includes(key)) {
        el.classList.add("text-wrap", "width-400");
        el.textContent = val;
      } else {
        el.textContent = val;
      }
      tr.appendChild(el);
    });

    fragment.appendChild(tr);
  });

  return fragment;
};