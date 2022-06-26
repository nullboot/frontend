export class Pagination {
  currentPage = 1;
  pageSize = 10;
  total = 0;

  get() {
    return {
      skip: (this.currentPage - 1) * this.pageSize,
      take: this.pageSize,
    };
  }

  set(size: number, cur: number) {
    this.currentPage = cur;
    this.pageSize = size;
  }
}
