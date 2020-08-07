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
    Message,
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

/** 
 * @service "/{proto name}.{ServiceName}/{rpc method name}"
*/
type RpcCallArgs = {
    service?: string;
    metadata?: Record<any, any>;
    request?: Array<GrpcType>;
    reply?: Array<GrpcType>;
}

type GrpcServiceCtorArgs = {
    host?: string;
    format?: string;
    suppressCorsPreflight?: boolean;
}

const indexOrDefault: (array: Array<GrpcType>, index: number, _default: GrpcType) => GrpcType = (array, index, _default) => {
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

    public unaryCall(args: RpcCallArgs, ...params: any[]) : Promise<Record<number, any>> {
        args = this.parseRpcCallArgs(args);
        return new Promise<Record<number, any>>((resolve, reject) => {
            this.client.rpcCall(
                `${this.host}${args.service}`,
                {array: params},
                args.metadata,
                this.createMethodDescriptor(args, false),
                (error, response: Record<number, any>) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(response);
                }
            );
        });
    }

    public serverStreaming(args: RpcCallArgs, ...params: any[]) : grpcWeb.ClientReadableStream<Record<number, any>> {
        args = this.parseRpcCallArgs(args);
        return this.client.serverStreaming(`${this.host}${args.service}`, {array: params}, args.metadata, this.createMethodDescriptor(args, true));
    }

    private parseRpcCallArgs(args: RpcCallArgs) {
        args = Object.assign({
            metadata: {},
            request: new Array<GrpcType>(),
            reply: new Array<GrpcType>()
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
            bytes => this.deserializeBinary(bytes, args.reply)
        )
    }

    private serializeBinary(request, requestTypes: Array<GrpcType>) {
        const writer = new jspb.BinaryWriter();
        this.serializeBinaryToWriter(request, writer, requestTypes);
        return writer.getResultBuffer();
    }

    private serializeBinaryToWriter(message, writer, requestTypes: Array<GrpcType>) {
        for(let i = 0, l = message.array.length; i < l; i++) {
            let type = GrpcType[indexOrDefault(requestTypes, i, GrpcType.String) as GrpcType];
            writer["write" + type](i + 1, message.array[i]);
        }
    };

    private deserializeBinary(bytes, replyTypes: Array<GrpcType>): Record<number, any> {
        const result: Record<number, any> = {};
        const reader = new jspb.BinaryReader(bytes);
        while (reader.nextField()) {
            if (reader.isEndGroup()) {
                break;
            }
            let field = reader.getFieldNumber();
            let type = GrpcType[indexOrDefault(replyTypes, field - 1, GrpcType.String) as GrpcType];
            result[field] = reader["read" + type]();
        }
        return result;
    }
}