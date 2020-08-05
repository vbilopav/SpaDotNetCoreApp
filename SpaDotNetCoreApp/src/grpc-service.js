"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpcWeb = require("grpc-web");
const jspb = require("google-protobuf");
var RequestType;
(function (RequestType) {
    RequestType[RequestType["Any"] = 0] = "Any";
    RequestType[RequestType["Int32"] = 1] = "Int32";
    RequestType[RequestType["Int32String"] = 2] = "Int32String";
    RequestType[RequestType["Int64"] = 3] = "Int64";
    RequestType[RequestType["Int64String"] = 4] = "Int64String";
    RequestType[RequestType["Uint32"] = 5] = "Uint32";
    RequestType[RequestType["Uint32String"] = 6] = "Uint32String";
    RequestType[RequestType["Uint64"] = 7] = "Uint64";
    RequestType[RequestType["Uint64String"] = 8] = "Uint64String";
    RequestType[RequestType["Sint32"] = 9] = "Sint32";
    RequestType[RequestType["Sint64"] = 10] = "Sint64";
    RequestType[RequestType["SintHash64"] = 11] = "SintHash64";
    RequestType[RequestType["Sint64String"] = 12] = "Sint64String";
    RequestType[RequestType["Fixed32"] = 13] = "Fixed32";
    RequestType[RequestType["Fixed64"] = 14] = "Fixed64";
    RequestType[RequestType["Fixed64String"] = 15] = "Fixed64String";
    RequestType[RequestType["Sfixed32"] = 16] = "Sfixed32";
    RequestType[RequestType["Sfixed64"] = 17] = "Sfixed64";
    RequestType[RequestType["Sfixed64String"] = 18] = "Sfixed64String";
    RequestType[RequestType["Float"] = 19] = "Float";
    RequestType[RequestType["Double"] = 20] = "Double";
    RequestType[RequestType["Bool"] = 21] = "Bool";
    RequestType[RequestType["Enum"] = 22] = "Enum";
    RequestType[RequestType["String"] = 23] = "String";
    RequestType[RequestType["MessageSet"] = 24] = "MessageSet";
    RequestType[RequestType["Group"] = 25] = "Group";
    RequestType[RequestType["Bytes"] = 26] = "Bytes";
    RequestType[RequestType["FixedHash64"] = 27] = "FixedHash64";
    RequestType[RequestType["VarintHash64"] = 28] = "VarintHash64";
    RequestType[RequestType["SplitFixed64"] = 29] = "SplitFixed64";
    RequestType[RequestType["SplitVarint64"] = 30] = "SplitVarint64";
    RequestType[RequestType["SplitZigzagVarint64"] = 31] = "SplitZigzagVarint64";
    RequestType[RequestType["RepeatedInt32"] = 32] = "RepeatedInt32";
    RequestType[RequestType["RepeatedInt32String"] = 33] = "RepeatedInt32String";
    RequestType[RequestType["RepeatedInt64"] = 34] = "RepeatedInt64";
    RequestType[RequestType["RepeatedSplitVarint64"] = 35] = "RepeatedSplitVarint64";
    RequestType[RequestType["RepeatedSplitZigzagVarint64"] = 36] = "RepeatedSplitZigzagVarint64";
    RequestType[RequestType["RepeatedInt64String"] = 37] = "RepeatedInt64String";
    RequestType[RequestType["RepeatedUint32"] = 38] = "RepeatedUint32";
    RequestType[RequestType["RepeatedUint32String"] = 39] = "RepeatedUint32String";
    RequestType[RequestType["RepeatedUint64"] = 40] = "RepeatedUint64";
    RequestType[RequestType["RepeatedUint64String"] = 41] = "RepeatedUint64String";
    RequestType[RequestType["RepeatedSint32"] = 42] = "RepeatedSint32";
    RequestType[RequestType["RepeatedSint64"] = 43] = "RepeatedSint64";
    RequestType[RequestType["RepeatedSint64String"] = 44] = "RepeatedSint64String";
    RequestType[RequestType["RepeatedSintHash64"] = 45] = "RepeatedSintHash64";
    RequestType[RequestType["RepeatedFixed32"] = 46] = "RepeatedFixed32";
    RequestType[RequestType["RepeatedFixed64"] = 47] = "RepeatedFixed64";
    RequestType[RequestType["RepeatedFixed64String"] = 48] = "RepeatedFixed64String";
    RequestType[RequestType["RepeatedSfixed32"] = 49] = "RepeatedSfixed32";
    RequestType[RequestType["RepeatedSfixed64"] = 50] = "RepeatedSfixed64";
    RequestType[RequestType["RepeatedSfixed64String"] = 51] = "RepeatedSfixed64String";
    RequestType[RequestType["RepeatedFloat"] = 52] = "RepeatedFloat";
    RequestType[RequestType["RepeatedDouble"] = 53] = "RepeatedDouble";
    RequestType[RequestType["RepeatedBool"] = 54] = "RepeatedBool";
    RequestType[RequestType["RepeatedEnum"] = 55] = "RepeatedEnum";
    RequestType[RequestType["RepeatedString"] = 56] = "RepeatedString";
    RequestType[RequestType["RepeatedBytes"] = 57] = "RepeatedBytes";
    RequestType[RequestType["RepeatedFixedHash64"] = 58] = "RepeatedFixedHash64";
    RequestType[RequestType["RepeatedVarintHash64"] = 59] = "RepeatedVarintHash64";
    RequestType[RequestType["PackedInt32"] = 60] = "PackedInt32";
    RequestType[RequestType["PackedInt32String"] = 61] = "PackedInt32String";
    RequestType[RequestType["PackedInt64"] = 62] = "PackedInt64";
    RequestType[RequestType["PackedSplitFixed64"] = 63] = "PackedSplitFixed64";
    RequestType[RequestType["PackedSplitVarint64"] = 64] = "PackedSplitVarint64";
    RequestType[RequestType["PackedSplitZigzagVarint64"] = 65] = "PackedSplitZigzagVarint64";
    RequestType[RequestType["PackedInt64String"] = 66] = "PackedInt64String";
    RequestType[RequestType["PackedUint32"] = 67] = "PackedUint32";
    RequestType[RequestType["PackedUint32String"] = 68] = "PackedUint32String";
    RequestType[RequestType["PackedUint64"] = 69] = "PackedUint64";
    RequestType[RequestType["PackedUint64String"] = 70] = "PackedUint64String";
    RequestType[RequestType["PackedSint32"] = 71] = "PackedSint32";
    RequestType[RequestType["PackedSint64"] = 72] = "PackedSint64";
    RequestType[RequestType["PackedSint64String"] = 73] = "PackedSint64String";
    RequestType[RequestType["PackedSintHash64"] = 74] = "PackedSintHash64";
    RequestType[RequestType["PackedFixed32"] = 75] = "PackedFixed32";
    RequestType[RequestType["PackedFixed64"] = 76] = "PackedFixed64";
    RequestType[RequestType["PackedFixed64String"] = 77] = "PackedFixed64String";
    RequestType[RequestType["PackedSfixed32"] = 78] = "PackedSfixed32";
    RequestType[RequestType["PackedSfixed64"] = 79] = "PackedSfixed64";
    RequestType[RequestType["PackedSfixed64String"] = 80] = "PackedSfixed64String";
    RequestType[RequestType["PackedFloat"] = 81] = "PackedFloat";
    RequestType[RequestType["PackedDouble"] = 82] = "PackedDouble";
    RequestType[RequestType["PackedBool"] = 83] = "PackedBool";
    RequestType[RequestType["PackedEnum"] = 84] = "PackedEnum";
    RequestType[RequestType["PackedFixedHash64"] = 85] = "PackedFixedHash64";
    RequestType[RequestType["PackedVarintHash64"] = 86] = "PackedVarintHash64";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
var ReplayType;
(function (ReplayType) {
    ReplayType[ReplayType["Any"] = 0] = "Any";
    ReplayType[ReplayType["Message"] = 1] = "Message";
    ReplayType[ReplayType["Group"] = 2] = "Group";
    ReplayType[ReplayType["Int32"] = 3] = "Int32";
    ReplayType[ReplayType["Int32String"] = 4] = "Int32String";
    ReplayType[ReplayType["Int64"] = 5] = "Int64";
    ReplayType[ReplayType["Int64String"] = 6] = "Int64String";
    ReplayType[ReplayType["Uint32"] = 7] = "Uint32";
    ReplayType[ReplayType["Uint32String"] = 8] = "Uint32String";
    ReplayType[ReplayType["Uint64"] = 9] = "Uint64";
    ReplayType[ReplayType["Uint64String"] = 10] = "Uint64String";
    ReplayType[ReplayType["Sint32"] = 11] = "Sint32";
    ReplayType[ReplayType["Sint64"] = 12] = "Sint64";
    ReplayType[ReplayType["Sint64String"] = 13] = "Sint64String";
    ReplayType[ReplayType["Fixed32"] = 14] = "Fixed32";
    ReplayType[ReplayType["Fixed64"] = 15] = "Fixed64";
    ReplayType[ReplayType["Fixed64String"] = 16] = "Fixed64String";
    ReplayType[ReplayType["Sfixed32"] = 17] = "Sfixed32";
    ReplayType[ReplayType["Sfixed32String"] = 18] = "Sfixed32String";
    ReplayType[ReplayType["Sfixed64"] = 19] = "Sfixed64";
    ReplayType[ReplayType["Sfixed64String"] = 20] = "Sfixed64String";
    ReplayType[ReplayType["Float"] = 21] = "Float";
    ReplayType[ReplayType["Double"] = 22] = "Double";
    ReplayType[ReplayType["Bool"] = 23] = "Bool";
    ReplayType[ReplayType["Enum"] = 24] = "Enum";
    ReplayType[ReplayType["String"] = 25] = "String";
    ReplayType[ReplayType["Bytes"] = 26] = "Bytes";
    ReplayType[ReplayType["VarintHash64"] = 27] = "VarintHash64";
    ReplayType[ReplayType["SintHash64"] = 28] = "SintHash64";
    ReplayType[ReplayType["SplitVarint64"] = 29] = "SplitVarint64";
    ReplayType[ReplayType["SplitZigzagVarint64"] = 30] = "SplitZigzagVarint64";
    ReplayType[ReplayType["FixedHash64"] = 31] = "FixedHash64";
    ReplayType[ReplayType["SplitFixed64"] = 32] = "SplitFixed64";
    ReplayType[ReplayType["PackedInt32"] = 33] = "PackedInt32";
    ReplayType[ReplayType["PackedInt32String"] = 34] = "PackedInt32String";
    ReplayType[ReplayType["PackedInt64"] = 35] = "PackedInt64";
    ReplayType[ReplayType["PackedInt64String"] = 36] = "PackedInt64String";
    ReplayType[ReplayType["PackedUint32"] = 37] = "PackedUint32";
    ReplayType[ReplayType["PackedUint32String"] = 38] = "PackedUint32String";
    ReplayType[ReplayType["PackedUint64"] = 39] = "PackedUint64";
    ReplayType[ReplayType["PackedUint64String"] = 40] = "PackedUint64String";
    ReplayType[ReplayType["PackedSint32"] = 41] = "PackedSint32";
    ReplayType[ReplayType["PackedSint64"] = 42] = "PackedSint64";
    ReplayType[ReplayType["PackedSint64String"] = 43] = "PackedSint64String";
    ReplayType[ReplayType["PackedFixed32"] = 44] = "PackedFixed32";
    ReplayType[ReplayType["PackedFixed64"] = 45] = "PackedFixed64";
    ReplayType[ReplayType["PackedSfixed32"] = 46] = "PackedSfixed32";
    ReplayType[ReplayType["PackedSfixed64"] = 47] = "PackedSfixed64";
    ReplayType[ReplayType["PackedSfixed64String"] = 48] = "PackedSfixed64String";
    ReplayType[ReplayType["PackedFloat"] = 49] = "PackedFloat";
    ReplayType[ReplayType["PackedDouble"] = 50] = "PackedDouble";
    ReplayType[ReplayType["PackedBool"] = 51] = "PackedBool";
    ReplayType[ReplayType["PackedEnum"] = 52] = "PackedEnum";
    ReplayType[ReplayType["PackedVarintHash64"] = 53] = "PackedVarintHash64";
    ReplayType[ReplayType["PackedFixedHash64"] = 54] = "PackedFixedHash64";
})(ReplayType = exports.ReplayType || (exports.ReplayType = {}));
const indexOrDefault = (array, index, _default) => {
    if (!array || index >= array.length) {
        return _default;
    }
    return array[index];
};
class GrpcService {
    constructor(args = {}) {
        args = Object.assign({ host: "", format: "text" }, args);
        this.client = new grpcWeb.GrpcWebClientBase({ format: args.format, suppressCorsPreflight: args.suppressCorsPreflight });
        this.host = args.host;
    }
    unaryCall(args, ...params) {
        args = this.parseRpcCallArgs(args);
        return new Promise((resolve, reject) => {
            this.client.rpcCall(`${this.host}${args.service}`, { array: params }, args.metadata, this.createMethodDescriptor(args, false), (error, response) => {
                if (error) {
                    return reject(error);
                }
                return resolve(response);
            });
        });
    }
    serverStreaming(args, ...params) {
        args = this.parseRpcCallArgs(args);
        return this.client.serverStreaming(`${this.host}${args.service}`, { array: params }, args.metadata, this.createMethodDescriptor(args, true));
    }
    parseRpcCallArgs(args) {
        args = Object.assign({
            metadata: {},
            request: new Array(),
            replay: new Array()
        }, args);
        if (!args.service) {
            throw args.service;
        }
        return args;
    }
    createMethodDescriptor(args, isStreaming) {
        return new grpcWeb.MethodDescriptor(args.service, (isStreaming ? grpcWeb.MethodType.SERVER_STREAMING : grpcWeb.MethodType.UNARY), function (opt) {
            jspb.Message.initialize(this, opt, 0, -1, null, null);
        }, function (opt) {
            jspb.Message.initialize(this, opt, 0, -1, null, null);
        }, request => this.serializeBinary(request, args.request), bytes => this.deserializeBinary(bytes, args.replay));
    }
    serializeBinary(request, requestTypes) {
        const writer = new jspb.BinaryWriter();
        this.serializeBinaryToWriter(request, writer, requestTypes);
        return writer.getResultBuffer();
    }
    serializeBinaryToWriter(message, writer, requestTypes) {
        for (let i = 0, l = message.array.length; i < l; i++) {
            let type = RequestType[indexOrDefault(requestTypes, i, RequestType.String)];
            writer["write" + type](i + 1, message.array[i]);
        }
    }
    ;
    deserializeBinary(bytes, replayTypes) {
        const result = {};
        const reader = new jspb.BinaryReader(bytes);
        while (reader.nextField()) {
            if (reader.isEndGroup()) {
                break;
            }
            let field = reader.getFieldNumber();
            let type = ReplayType[indexOrDefault(replayTypes, field - 1, ReplayType.String)];
            result[field] = reader["read" + type]();
        }
        return result;
    }
}
exports.GrpcService = GrpcService;
