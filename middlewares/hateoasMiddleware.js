module.exports = function hateoasMiddleware(req, res, next) {
  console.log("HATEOAS middleware");
  
  res.setHateoas = function(paginationData = {}) {
    const hateoas = {};
    const searchParams = req.query;
    let { itemsPerPage, page, ...filters } = searchParams;
    
    if (itemsPerPage || page) {
      page = page ? parseInt(page, 10) : 1;
      itemsPerPage = itemsPerPage ? parseInt(itemsPerPage, 10) : 4;

      if (paginationData.count !== undefined) {
        const count = paginationData.count;
        const lastPage = Math.ceil(count / itemsPerPage);
        const hasNextPage = page < lastPage;
        const hasPrevPage = page > 1;

        const baseUrl = `${req.protocol}://${req.host}` + req.originalUrl.split("?")[0];
        
        const firstPageParams = new URLSearchParams({
          ...filters,
          page: 1,
          itemsPerPage: itemsPerPage,
        });
        const lastPageParams = new URLSearchParams({
          ...filters,
          page: lastPage,
          itemsPerPage: itemsPerPage,
        });

        hateoas.first = `${baseUrl}?${firstPageParams.toString()}`;
        hateoas.last = `${baseUrl}?${lastPageParams.toString()}`;

        if (hasPrevPage) {
          const prevPageParams = new URLSearchParams({
            ...filters,
            page: page - 1,
            itemsPerPage: itemsPerPage,
          });
          hateoas.prev = `${baseUrl}?${prevPageParams.toString()}`;
        }
        
        if (hasNextPage) {
          const nextPageParams = new URLSearchParams({
            ...filters,
            page: page + 1,
            itemsPerPage: itemsPerPage,
          });
          hateoas.next = `${baseUrl}?${nextPageParams.toString()}`;
        }
      }
    }

    if (Object.keys(hateoas).length > 0) {
      const hateoasString = Object
        .entries(hateoas)
        .map((entry) => {
          entry[0] = `rel="${entry[0]}"`;
          entry[1] = `<${entry[1]}>`;
          return `${entry[1]}; ${entry[0]}`;
        })
        .join(", ");
      res.setHeader("Link", hateoasString);
    }

    console.log(hateoas);
    return hateoas;
  };
  res.getPagination = function() {
    const searchParams = req.query;
    let { itemsPerPage, page, ...filters } = searchParams;
    const pagination = {};
    
    if (itemsPerPage || page) {
      page = page ? parseInt(page, 10) : 1;
      itemsPerPage = itemsPerPage ? parseInt(itemsPerPage, 10) : 4;

      pagination.offset = (page - 1) * itemsPerPage;
      pagination.limit = itemsPerPage;
    }
    
    return { pagination, filters };
  };

  next();
};
