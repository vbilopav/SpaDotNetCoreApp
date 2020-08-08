import * as grpcWeb from "grpc-web";
import * as jspb from "google-protobuf";

export enum GrpcType {
    Any,
    Int32,
    Int32String,
    Int64,
    Int64String,
    Uint32,
    Uint32String,
    Uint64,
    Uint64String,
    Sint32,
    Sint64,
    SintHash64,
    Sint64String,
    Fixed32,
    Fixed64,
    Fixed64String,
    Sfixed32,
    Sfixed64,
    Sfixed64String,
    Float,
    Double,
    Bool,
    Enum,
    String,
    MessageSet,
    Group,
    Bytes,
    FixedHash64,
    VarintHash64,
    SplitFixed64,
    SplitVarint64,
    SplitZigzagVarint64,
    RepeatedInt32,
    RepeatedInt32String,
    RepeatedInt64,
    RepeatedSplitVarint64,
    RepeatedSplitZigzagVarint64,
    RepeatedInt64String,
    RepeatedUint32,
    RepeatedUint32String,
    RepeatedUint64,
    RepeatedUint64String,
    RepeatedSint32,
    RepeatedSint64,
    RepeatedSint64String,
    RepeatedSintHash64,
    RepeatedFixed32,
    RepeatedFixed64,
    RepeatedFixed64String,
    RepeatedSfixed32,
    RepeatedSfixed64,
    RepeatedSfixed64String,
    RepeatedFloat,
    RepeatedDouble,
    RepeatedBool,
    RepeatedEnum,
    RepeatedString,
    RepeatedBytes,
    RepeatedFixedHash64,
    RepeatedVarintHash64,
    PackedInt32,
    PackedInt32String,
    PackedInt64,
    PackedSplitFixed64,
    PackedSplitVarint64,
    PackedSplitZigzagVarint64,
    PackedInt64String,
    PackedUint32,
    PackedUint32String,
    PackedUint64,
    PackedUint64String,
    PackedSint32,
    PackedSint64,
    PackedSint64String,
    PackedSintHash64,
    PackedFixed32,
    PackedFixed64,
    PackedFixed64String,
    PackedSfixed32,
    PackedSfixed64,
    PackedSfixed64String,
    PackedFloat,
    PackedDouble,
    PackedBool,
    PackedEnum,
    PackedFixedHash64,
    PackedVarintHash64
}

export type GrpcError = {
    code: number;
    message: string;
    metadata: Record<string, string>;
};

type RequestType = Array<GrpcType>;
type ReplyType = Array<GrpcType | Array<GrpcType>> | Array<Record<string, GrpcType | Array< Record<string, GrpcType>>>>

type ResultType = Record<number | string, any> | GrpcError;

type RpcCallArgs = {
    service?: string;
    metadata?: Record<any, any>;
    request?: RequestType;
    reply?: ReplyType;
}

type GrpcServiceCtorArgs = {
    host?: string;
    format?: string;
    suppressCorsPreflight?: boolean;
}

const indexOrDefault: <T>(array: Array<any>, index: number, _default: T) => T = (array, index, _default) => {
    if (!array || index >= array.length) {
        return _default;
    }
    return array[index];
}

export class GrpcService {
    private client: grpcWeb.GrpcWebClientBase;
    private host: string;

    constructor(args: GrpcServiceCtorArgs = {}) {
        args = Object.assign({host: "", format: "text"}, args);
        this.client = new grpcWeb.GrpcWebClientBase({format: args.format, suppressCorsPreflight: args.suppressCorsPreflight});
        this.host = args.host;
    }

    public unaryCall(args: RpcCallArgs, ...params: any[]) : Promise<ResultType> {
        args = this.parseRpcCallArgs(args);
        return new Promise<ResultType>((resolve, reject) => {
            this.client.rpcCall(
                `${this.host}${args.service}`,
                {array: params},
                args.metadata,
                this.createMethodDescriptor(args, false),
                (error, response: ResultType) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(response);
                }
            );
        });
    }

    public serverStreaming(args: RpcCallArgs, ...params: any[]) : grpcWeb.ClientReadableStream<ResultType> {
        args = this.parseRpcCallArgs(args);
        return this.client.serverStreaming(`${this.host}${args.service}`, {array: params}, args.metadata, this.createMethodDescriptor(args, true));
    }

    private parseRpcCallArgs(args: RpcCallArgs) {
        args = Object.assign({
            metadata: {},
            request: new Array<GrpcType>(),
            reply: new Array<GrpcType | Array<GrpcType>>(),
            resultNames: new Array<string | Array<string>>()
        }, args);
        if (!args.service) {
            throw args.service;
        }
        return args;
    }

    private createMethodDescriptor(args: RpcCallArgs, isStreaming: boolean) {
        return new (grpcWeb as any).MethodDescriptor(
            args.service, 
            (isStreaming ? (grpcWeb as any).MethodType.SERVER_STREAMING : (grpcWeb as any).MethodType.UNARY),
            function(opt) {
                jspb.Message.initialize(this, opt, 0, -1, null, null);
            },
            function(opt) {
                jspb.Message.initialize(this, opt, 0, -1, null, null);
            },
            request => this.serializeBinary(request, args.request),
            bytes => this.deserializeBinary(bytes, args)
        )
    }

    private serializeBinary(request, requestTypes: RequestType) {
        const writer = new jspb.BinaryWriter();
        this.serializeBinaryToWriter(request, writer, requestTypes);
        return writer.getResultBuffer();
    }

    private serializeBinaryToWriter(message, writer, requestTypes: RequestType) {
        for(let i = 0, l = message.array.length; i < l; i++) {
            let type = GrpcType[indexOrDefault(requestTypes, i, GrpcType.String) as GrpcType];
            writer["write" + type](i + 1, message.array[i]);
        }
    };

    private deserializeBinary(bytes, args: RpcCallArgs): ResultType {
        const result: ResultType = {};
        const reader = new jspb.BinaryReader(bytes);
        while (reader.nextField()) {
            if (reader.isEndGroup()) {
                break;
            }
            let field = reader.getFieldNumber() as number;
            let name;
            let replyValue = indexOrDefault(args.reply, field - 1, GrpcType.String) as any;
            let replyType;
            if (replyValue instanceof Object && !(replyValue instanceof Array)) {
                let entries = Object.entries(replyValue);
                name = entries[0][0];
                replyType = entries[0][1];
            } else {
                name = field;
                replyType = replyValue;
            }
            if (!(replyType instanceof Array)) {
                let type = GrpcType[replyType];
                result[name] = reader["read" + type]();
            } else {
                const message: ResultType = {};
                reader.readMessage(message, (msg, reader) => this.deserializeMessage(msg, reader, replyType));
                let value = result[name];
                if (value) {
                    value.push(message);
                } else {
                    result[name] = [message];
                }
            }
        }
        return result;
    }

    private deserializeMessage(message: Record<number, any>, reader: any, replyTypes: any): Record<number, any> {
        while (reader.nextField()) {
            if (reader.isEndGroup()) {
                break;
            }
            let field = reader.getFieldNumber();
            let name;
            let replyValue = indexOrDefault(replyTypes, field - 1, GrpcType.String) as any;
            let replyType;
            if (replyValue instanceof Object) {
                let entries = Object.entries(replyValue);
                name = entries[0][0];
                replyType = entries[0][1];
            } else {
                name = field;
                replyType = replyValue;
            }

            let type = GrpcType[replyType];
            message[name] = reader["read" + type]();
        }
        return message;
    }
}
