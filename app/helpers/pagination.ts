export const paginate = (data: any[], page: number, els_on_page : number) : {
    data : any[],
    isFirstPage : boolean,
    isLastPage : boolean,
} => {

    let pages = Math.floor(data.length / els_on_page);
    if (pages * els_on_page < data.length) pages++;

    const isFirstPage = page < 1;
    const isLastPage = page >= pages - 1;

    const from = els_on_page * page;
    const to = Math.min(els_on_page * (page + 1), data.length);

    return {
        data: data.slice(from, to),
        isFirstPage: isFirstPage,
        isLastPage: isLastPage,
    }
}