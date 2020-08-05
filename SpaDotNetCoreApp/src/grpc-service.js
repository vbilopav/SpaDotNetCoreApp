"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpcWeb = require("grpc-web");
const jspb = require("google-protobuf");
var GrpcType;
(function (GrpcType) {
    GrpcType[GrpcType["Any"] = 0] = "Any";
    GrpcType[GrpcType["Int32"] = 1] = "Int32";
    GrpcType[GrpcType["Int32String"] = 2] = "Int32String";
    GrpcType[GrpcType["Int64"] = 3] = "Int64";
    GrpcType[GrpcType["Int64String"] = 4] = "Int64String";
    GrpcType[GrpcType["Uint32"] = 5] = "Uint32";
    GrpcType[GrpcType["Uint32String"] = 6] = "Uint32String";
    GrpcType[GrpcType["Uint64"] = 7] = "Uint64";
    GrpcType[GrpcType["Uint64String"] = 8] = "Uint64String";
    GrpcType[GrpcType["Sint32"] = 9] = "Sint32";
    GrpcType[GrpcType["Sint64"] = 10] = "Sint64";
    GrpcType[GrpcType["SintHash64"] = 11] = "SintHash64";
    GrpcType[GrpcType["Sint64String"] = 12] = "Sint64String";
    GrpcType[GrpcType["Fixed32"] = 13] = "Fixed32";
    GrpcType[GrpcType["Fixed64"] = 14] = "Fixed64";
    GrpcType[GrpcType["Fixed64String"] = 15] = "Fixed64String";
    GrpcType[GrpcType["Sfixed32"] = 16] = "Sfixed32";
    GrpcType[GrpcType["Sfixed64"] = 17] = "Sfixed64";
    GrpcType[GrpcType["Sfixed64String"] = 18] = "Sfixed64String";
    GrpcType[GrpcType["Float"] = 19] = "Float";
    GrpcType[GrpcType["Double"] = 20] = "Double";
    GrpcType[GrpcType["Bool"] = 21] = "Bool";
    GrpcType[GrpcType["Enum"] = 22] = "Enum";
    GrpcType[GrpcType["String"] = 23] = "String";
    GrpcType[GrpcType["MessageSet"] = 24] = "MessageSet";
    GrpcType[GrpcType["Message"] = 25] = "Message";
    GrpcType[GrpcType["Group"] = 26] = "Group";
    GrpcType[GrpcType["Bytes"] = 27] = "Bytes";
    GrpcType[GrpcType["FixedHash64"] = 28] = "FixedHash64";
    GrpcType[GrpcType["VarintHash64"] = 29] = "VarintHash64";
    GrpcType[GrpcType["SplitFixed64"] = 30] = "SplitFixed64";
    GrpcType[GrpcType["SplitVarint64"] = 31] = "SplitVarint64";
    GrpcType[GrpcType["SplitZigzagVarint64"] = 32] = "SplitZigzagVarint64";
    GrpcType[GrpcType["RepeatedInt32"] = 33] = "RepeatedInt32";
    GrpcType[GrpcType["RepeatedInt32String"] = 34] = "RepeatedInt32String";
    GrpcType[GrpcType["RepeatedInt64"] = 35] = "RepeatedInt64";
    GrpcType[GrpcType["RepeatedSplitVarint64"] = 36] = "RepeatedSplitVarint64";
    GrpcType[GrpcType["RepeatedSplitZigzagVarint64"] = 37] = "RepeatedSplitZigzagVarint64";
    GrpcType[GrpcType["RepeatedInt64String"] = 38] = "RepeatedInt64String";
    GrpcType[GrpcType["RepeatedUint32"] = 39] = "RepeatedUint32";
    GrpcType[GrpcType["RepeatedUint32String"] = 40] = "RepeatedUint32String";
    GrpcType[GrpcType["RepeatedUint64"] = 41] = "RepeatedUint64";
    GrpcType[GrpcType["RepeatedUint64String"] = 42] = "RepeatedUint64String";
    GrpcType[GrpcType["RepeatedSint32"] = 43] = "RepeatedSint32";
    GrpcType[GrpcType["RepeatedSint64"] = 44] = "RepeatedSint64";
    GrpcType[GrpcType["RepeatedSint64String"] = 45] = "RepeatedSint64String";
    GrpcType[GrpcType["RepeatedSintHash64"] = 46] = "RepeatedSintHash64";
    GrpcType[GrpcType["RepeatedFixed32"] = 47] = "RepeatedFixed32";
    GrpcType[GrpcType["RepeatedFixed64"] = 48] = "RepeatedFixed64";
    GrpcType[GrpcType["RepeatedFixed64String"] = 49] = "RepeatedFixed64String";
    GrpcType[GrpcType["RepeatedSfixed32"] = 50] = "RepeatedSfixed32";
    GrpcType[GrpcType["RepeatedSfixed64"] = 51] = "RepeatedSfixed64";
    GrpcType[GrpcType["RepeatedSfixed64String"] = 52] = "RepeatedSfixed64String";
    GrpcType[GrpcType["RepeatedFloat"] = 53] = "RepeatedFloat";
    GrpcType[GrpcType["RepeatedDouble"] = 54] = "RepeatedDouble";
    GrpcType[GrpcType["RepeatedBool"] = 55] = "RepeatedBool";
    GrpcType[GrpcType["RepeatedEnum"] = 56] = "RepeatedEnum";
    GrpcType[GrpcType["RepeatedString"] = 57] = "RepeatedString";
    GrpcType[GrpcType["RepeatedBytes"] = 58] = "RepeatedBytes";
    GrpcType[GrpcType["RepeatedFixedHash64"] = 59] = "RepeatedFixedHash64";
    GrpcType[GrpcType["RepeatedVarintHash64"] = 60] = "RepeatedVarintHash64";
    GrpcType[GrpcType["PackedInt32"] = 61] = "PackedInt32";
    GrpcType[GrpcType["PackedInt32String"] = 62] = "PackedInt32String";
    GrpcType[GrpcType["PackedInt64"] = 63] = "PackedInt64";
    GrpcType[GrpcType["PackedSplitFixed64"] = 64] = "PackedSplitFixed64";
    GrpcType[GrpcType["PackedSplitVarint64"] = 65] = "PackedSplitVarint64";
    GrpcType[GrpcType["PackedSplitZigzagVarint64"] = 66] = "PackedSplitZigzagVarint64";
    GrpcType[GrpcType["PackedInt64String"] = 67] = "PackedInt64String";
    GrpcType[GrpcType["PackedUint32"] = 68] = "PackedUint32";
    GrpcType[GrpcType["PackedUint32String"] = 69] = "PackedUint32String";
    GrpcType[GrpcType["PackedUint64"] = 70] = "PackedUint64";
    GrpcType[GrpcType["PackedUint64String"] = 71] = "PackedUint64String";
    GrpcType[GrpcType["PackedSint32"] = 72] = "PackedSint32";
    GrpcType[GrpcType["PackedSint64"] = 73] = "PackedSint64";
    GrpcType[GrpcType["PackedSint64String"] = 74] = "PackedSint64String";
    GrpcType[GrpcType["PackedSintHash64"] = 75] = "PackedSintHash64";
    GrpcType[GrpcType["PackedFixed32"] = 76] = "PackedFixed32";
    GrpcType[GrpcType["PackedFixed64"] = 77] = "PackedFixed64";
    GrpcType[GrpcType["PackedFixed64String"] = 78] = "PackedFixed64String";
    GrpcType[GrpcType["PackedSfixed32"] = 79] = "PackedSfixed32";
    GrpcType[GrpcType["PackedSfixed64"] = 80] = "PackedSfixed64";
    GrpcType[GrpcType["PackedSfixed64String"] = 81] = "PackedSfixed64String";
    GrpcType[GrpcType["PackedFloat"] = 82] = "PackedFloat";
    GrpcType[GrpcType["PackedDouble"] = 83] = "PackedDouble";
    GrpcType[GrpcType["PackedBool"] = 84] = "PackedBool";
    GrpcType[GrpcType["PackedEnum"] = 85] = "PackedEnum";
    GrpcType[GrpcType["PackedFixedHash64"] = 86] = "PackedFixedHash64";
    GrpcType[GrpcType["PackedVarintHash64"] = 87] = "PackedVarintHash64";
})(GrpcType = exports.GrpcType || (exports.GrpcType = {}));
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
            reply: new Array()
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
        }, request => this.serializeBinary(request, args.request), bytes => this.deserializeBinary(bytes, args.reply));
    }
    serializeBinary(request, requestTypes) {
        const writer = new jspb.BinaryWriter();
        this.serializeBinaryToWriter(request, writer, requestTypes);
        return writer.getResultBuffer();
    }
    serializeBinaryToWriter(message, writer, requestTypes) {
        for (let i = 0, l = message.array.length; i < l; i++) {
            let type = GrpcType[indexOrDefault(requestTypes, i, GrpcType.String)];
            writer["write" + type](i + 1, message.array[i]);
        }
    }
    ;
    deserializeBinary(bytes, replyTypes) {
        const result = {};
        const reader = new jspb.BinaryReader(bytes);
        while (reader.nextField()) {
            if (reader.isEndGroup()) {
                break;
            }
            let field = reader.getFieldNumber();
            let type = GrpcType[indexOrDefault(replyTypes, field - 1, GrpcType.String)];
            result[field] = reader["read" + type]();
        }
        return result;
    }
}
exports.GrpcService = GrpcService;
