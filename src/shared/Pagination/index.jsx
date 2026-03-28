import styles from "./pagination.module.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const getPagination = (currentPage, totalPages) => {
  const pages = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const range = [];

  if (currentPage <= 4) {
    range.push(1, 2, 3, 4, 5);
  } else if (currentPage >= totalPages - 3) {
    range.push(
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    );
  } else {
    range.push(currentPage - 1, currentPage, currentPage + 1);
  }

  // Always include first & last
  const fullSet = new Set([1, ...range, totalPages]);

  const sortedPages = Array.from(fullSet).sort((a, b) => a - b);

  // Insert dots
  for (let i = 0; i < sortedPages.length; i++) {
    if (i > 0 && sortedPages[i] - sortedPages[i - 1] > 1) {
      pages.push("...");
    }
    pages.push(sortedPages[i]);
  }

  return pages;
};

const Pagination = ({ page, setPage, totalPages }) => {
  const pages = getPagination(page, totalPages);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" }); // smoother scroll
  };

  return (
    <div className={styles.paginationContainer}>
      <button
        onClick={() => handlePageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={styles.navArrow}
      >
        <IoIosArrowBack />
      </button>

      <div className={styles.questionNumbers}>
        {pages.map((item, i) =>
          item === "..." ? (
            <span key={`dots-${i}`} className={styles.pageIndicator}>
              ...
            </span>
          ) : (
            <button
              key={`page-${item}-${i}`}
              onClick={() => handlePageChange(item)}
              className={`${styles.questionNumber} ${
                item === page ? styles.active : ""
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={styles.navArrow}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default Pagination;
