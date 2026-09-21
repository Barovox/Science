import { Pagination } from "@mantine/core";
import { useEffect } from "react";

const PaginationComponent = ({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  totalItems,
}: any) => {
  const totalPage = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.delete("page");
    if (currentPage) {
      params.append("page", currentPage.toString());
    }
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  }, [currentPage]);

  return (
    <>
      <Pagination
        total={totalPage}
        siblings={1}
        value={currentPage}
        onChange={setCurrentPage}
        // defaultValue={1}
        withEdges
      />
    </>
  );
};

export default PaginationComponent;
