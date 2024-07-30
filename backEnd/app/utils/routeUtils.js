'use strict';

const Joi = require('joi');

const utils = require('./utils');
const HELPERS = require('../helpers');
const { MESSAGES, ERROR_TYPES } = require('./constants');

const routeUtils = {};

/**
 * function to create routes in the express.
 */
routeUtils.apiRoute = async (app, routes = []) => {
	routes.forEach((route) => {
		const middlewares = [getValidatorMiddleware(route)];
		app.route(route.path)[route.method.toLowerCase()](...middlewares, getHandlerMethod(route));
	});
};

/**
 * function to check the error of all joi validations
 * @param {*} joiValidatedObject
 */
const checkJoiValidationError = (joiValidatedObject) => {
	if (joiValidatedObject.error) throw joiValidatedObject.error;
};

/**
 * function to validate request body/params/query/headers with joi schema to validate a request is valid or not.
 * @param {*} route
 */
const joiValidatorMethod = async (request, route) => {
	if (route.joiSchemaForSwagger.params && Object.keys(route.joiSchemaForSwagger.params).length) {
		request.params = Joi.object(route.joiSchemaForSwagger.params).validate(request.params);
		checkJoiValidationError(request.params);
	}
	if (route.joiSchemaForSwagger.body && Object.keys(route.joiSchemaForSwagger.body).length) {
		request.body = Joi.object(route.joiSchemaForSwagger.body).unknown(false).validate(request.body);
		checkJoiValidationError(request.body);
	}
	if (route.joiSchemaForSwagger.query && Object.keys(route.joiSchemaForSwagger.query).length) {
		request.query = Joi.object(route.joiSchemaForSwagger.query).unknown(false).validate(request.query);
		checkJoiValidationError(request.query);
	}
	if (route.joiSchemaForSwagger.headers && Object.keys(route.joiSchemaForSwagger.headers).length) {
		const headersObject = Joi.object(route.joiSchemaForSwagger.headers).unknown(true).validate(request.headers);
		checkJoiValidationError(headersObject);
		request.headers.authorization = ((headersObject || {}).value || {}).authorization;
	}
};

/**
 * middleware to validate request body/params/query/headers with JOI.
 * @param {*} route
 */
const getValidatorMiddleware = (route) => {
	return (request, response, next) => {
		joiValidatorMethod(request, route)
			.then(() => {
				return next();
			})
			.catch((err) => {
				const error = utils.convertErrorIntoReadableForm(err);
				const responseObject = HELPERS.createErrorResponse(error.message.toString(), ERROR_TYPES.BAD_REQUEST);
				return response.status(responseObject.statusCode).json(responseObject);
			});
	};
};

/**
 * middleware
 * @param {*} handler
 */
const getHandlerMethod = (route) => {
	const handler = route.handler;
	return (request, response) => {
		let payload = {
			...(request?.body?.value || {}),
			...(request?.params?.value || {}),
			...(request?.query?.value || {}),
			file: request.file || {},
			user: request?.user || {}
		};
		// request handler/controller
		if (route.getExactRequest) {
			request.payload = payload;
			payload = request;
		}
		handler(payload)
			.then((result) => {
				if (result.filePath) {
					return response.status(result.statusCode).sendFile(result.filePath);
				} else if (result.fileData) {
					response.attachment(result.fileName);
					response.send(result.fileData.Body);
					return response;
				} else if (result.redirectUrl) {
					return response.redirect(result.redirectUrl);
				}
				response.status(result.statusCode).json(result);
			})
			.catch((err) => {
				console.log('Error is ', err);
				request.body.error = {};
				request.body.error.message = err.message;
				if (!err.statusCode && !err.status) {
					err = HELPERS.createErrorResponse(MESSAGES.SOMETHING_WENT_WRONG, ERROR_TYPES.INTERNAL_SERVER_ERROR);
				}
				response.status(err.statusCode).json(err);
			});
	};
};

module.exports = routeUtils;
