import debounce from "lodash.debounce";

// Hàm xử lý debounce
const fetchSearchResults = (text: string) => {
  console.log(`Searching for: ${text}`);
};

// Định nghĩa kiểu dữ liệu cho hàm debounce
const debouncedSearch: ((text: string) => void) & { cancel: () => void } =
  debounce(fetchSearchResults, 300);

// Sử dụng debouncedSearch
debouncedSearch("example query");

// Gọi phương thức cancel nếu cần hủy debounce
debouncedSearch.cancel();
