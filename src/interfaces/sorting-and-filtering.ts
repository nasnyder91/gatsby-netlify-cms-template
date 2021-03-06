export interface Sort {
    orderBy: "desc" | "asc";
    sortBy: string;
    displayName: string;
}

interface SortingAndFiltering {
    searchText: string;
    sort: Sort;
    skip: number;
    take: number;
}

export default SortingAndFiltering;
