"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var sqlFilePath, sqlContent, sqlStatements, i, sql, result, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, 9, 11]);
                    console.log('开始执行 SQL 种子脚本 (v3 - 逐条执行)...');
                    console.log('数据库 URL:', process.env.DATABASE_URL);
                    // 检查数据库连接
                    return [4 /*yield*/, prisma.$connect()];
                case 1:
                    // 检查数据库连接
                    _a.sent();
                    console.log('数据库连接成功');
                    sqlFilePath = path_1.default.join(process.cwd(), 'prisma', 'seed', 'therapists.sql');
                    console.log('尝试读取 SQL 文件路径 (基于 process.cwd()):', sqlFilePath);
                    if (!fs_1.default.existsSync(sqlFilePath)) {
                        console.error("\u9519\u8BEF: SQL \u6587\u4EF6\u672A\u627E\u5230: ".concat(sqlFilePath));
                        throw new Error("SQL \u6587\u4EF6\u672A\u627E\u5230: ".concat(sqlFilePath));
                    }
                    console.log('SQL 文件存在，开始读取...');
                    sqlContent = fs_1.default.readFileSync(sqlFilePath, 'utf-8');
                    console.log('SQL 文件读取成功.');
                    if (!sqlContent || sqlContent.trim().length === 0) {
                        console.error('错误: SQL 文件为空或只包含空白字符.');
                        throw new Error('SQL 文件内容为空.');
                    }
                    sqlStatements = sqlContent
                        .split('\n') // 1. 按行分割
                        .map(function (line) { return line.trim(); }) // 2. 去除每行首尾空格
                        .filter(function (line) { return line.length > 0 && !line.startsWith('--'); }) // 3. 过滤空行和注释行
                        .join('\n') // 4. 将有效行重新连接成一个字符串
                        .split(';') // 5. 按分号分割语句
                        .map(function (sql) { return sql.trim(); }) // 6. 去除每个语句的首尾空格
                        .filter(function (sql) { return sql.length > 0; });
                    console.log("\u5171\u627E\u5230 ".concat(sqlStatements.length, " \u6761\u6709\u6548 SQL \u8BED\u53E5\u8FDB\u884C\u6267\u884C"));
                    // 逐条执行 SQL 语句
                    console.log('开始逐条执行 SQL 语句...');
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < sqlStatements.length)) return [3 /*break*/, 7];
                    sql = sqlStatements[i];
                    // 注意：这里不再添加 trim()，因为上面 map 时已经处理过
                    console.log("\n\u6B63\u5728\u6267\u884C\u8BED\u53E5 ".concat(i + 1, "/").concat(sqlStatements.length, ":\n").concat(sql));
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, prisma.$executeRawUnsafe(sql)];
                case 4:
                    result = _a.sent();
                    console.log("\u8BED\u53E5 ".concat(i + 1, " \u6267\u884C\u6210\u529F\uFF0C\u5F71\u54CD\u884C\u6570:"), result);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("\u6267\u884C\u8BED\u53E5 ".concat(i + 1, " \u65F6\u51FA\u9519: ").concat(sql), error_1);
                    // 遇到错误时抛出并停止
                    throw error_1;
                case 6:
                    i++;
                    return [3 /*break*/, 2];
                case 7:
                    console.log('\nSQL 种子脚本 (v3 - 逐条执行) 完成！');
                    return [3 /*break*/, 11];
                case 8:
                    error_2 = _a.sent();
                    console.error('执行 SQL 种子脚本 (v3) 时出错:', error_2);
                    if (error_2 instanceof Error) {
                        console.error('错误详情:', error_2.message);
                        console.error('错误堆栈:', error_2.stack);
                    }
                    if (error_2 instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                        console.error('数据库错误代码:', error_2.code);
                        console.error('错误元数据:', error_2.meta);
                    }
                    throw error_2;
                case 9: return [4 /*yield*/, prisma.$disconnect()];
                case 10:
                    _a.sent();
                    console.log('数据库连接已关闭');
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    process.exit(1);
});
