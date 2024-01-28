const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    // Get The Id From Params
    const { id } = req.params;

    // Get Document From DB And Delete
    const document = await Model.findByIdAndDelete(id);

    // Validation
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    document.remove(); // Trigger "remove" event in update document

    // Send Response To Client
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    document.save(); // Trigger "save" event in update document
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({ data: newDocument });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    // Get The Id From Params
    const { id } = req.params;

    // Get Document From DB
    let query = Model.findById(id);
    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    const document = await query;

    // Validation
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    // Send Response To Client
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Documents Count
    const documentsCount = await Model.countDocuments();

    // Build query
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCount)
      .filrer()
      .sort()
      .search(modelName)
      .selectFeildes();

    // Execute query
    const { mongooseQuery, paginationResults } = apiFeatures;
    const documents = await mongooseQuery;

    // Send Response To Client
    res
      .status(200)
      .json({ results: documents.length, paginationResults, data: documents });
  });
