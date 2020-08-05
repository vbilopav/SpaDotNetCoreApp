/**
 * @fileoverview gRPC-Web generated client stub for templates
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.templates = require('./templates_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.templates.GrpcTemplatesClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.templates.GrpcTemplatesPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.templates.GetTemplate2Request,
 *   !proto.templates.GetTemplate2Reply>}
 */
const methodDescriptor_GrpcTemplates_GetTemplate2 = new grpc.web.MethodDescriptor(
  '/templates.GrpcTemplates/GetTemplate2',
  grpc.web.MethodType.UNARY,
  proto.templates.GetTemplate2Request,
  proto.templates.GetTemplate2Reply,
  /**
   * @param {!proto.templates.GetTemplate2Request} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.templates.GetTemplate2Reply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.templates.GetTemplate2Request,
 *   !proto.templates.GetTemplate2Reply>}
 */
const methodInfo_GrpcTemplates_GetTemplate2 = new grpc.web.AbstractClientBase.MethodInfo(
  proto.templates.GetTemplate2Reply,
  /**
   * @param {!proto.templates.GetTemplate2Request} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.templates.GetTemplate2Reply.deserializeBinary
);


/**
 * @param {!proto.templates.GetTemplate2Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.templates.GetTemplate2Reply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.templates.GetTemplate2Reply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.templates.GrpcTemplatesClient.prototype.getTemplate2 =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/templates.GrpcTemplates/GetTemplate2',
      request,
      metadata || {},
      methodDescriptor_GrpcTemplates_GetTemplate2,
      callback);
};


/**
 * @param {!proto.templates.GetTemplate2Request} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.templates.GetTemplate2Reply>}
 *     A native promise that resolves to the response
 */
proto.templates.GrpcTemplatesPromiseClient.prototype.getTemplate2 =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/templates.GrpcTemplates/GetTemplate2',
      request,
      metadata || {},
      methodDescriptor_GrpcTemplates_GetTemplate2);
};


module.exports = proto.templates;

