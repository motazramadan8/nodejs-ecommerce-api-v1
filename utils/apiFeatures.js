class ApiFeatures {
  constructor(mongooseQuery, queruStr) {
    this.mongooseQuery = mongooseQuery;
    this.queruStr = queruStr;
  }

  filrer() {
    const queryStrObg = { ...this.queruStr }; // Get copy of query string and save it in the variable
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryStrObg[field]);

    // Apply Filterition using [gte | gt | lte | lt]
    let queryStr = JSON.stringify(queryStrObg);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queruStr.sort) {
      const sortBy = this.queruStr.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  selectFeildes() {
    if (this.queruStr.fields) {
      const selectedFields = this.queruStr.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(selectedFields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.queruStr.keyword) {
      let query = {};
      if (modelName === "Products") {
        query.$or = [
          { title: { $regex: this.queruStr.keyword, $options: "i" } },
          { description: { $regex: this.queruStr.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queruStr.keyword, $options: "i" } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(docmentsCount) {
    const page = this.queruStr.page * 1 || 1;
    const limit = this.queruStr.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    //  Pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.pagesCount = Math.ceil(docmentsCount / limit);

    // Next Page
    if (endIndex < docmentsCount) {
      pagination.next = page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResults = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
