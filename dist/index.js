"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcrypt = __importStar(require("bcrypt"));
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var adminPassword, admin, services, _i, services_1, serviceData, translations, serviceInfo, therapists, _a, therapists_1, therapistData, translations, therapistInfo, shopSettings, _b, shopSettings_1, settingData, translations, settingInfo, services1, therapists1, bookings, _c, bookings_1, bookingData, messages, _d, messages_1, messageData, error_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log('开始添加示例数据...');
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 36, 37, 39]);
                    // 清理现有数据
                    console.log('正在清理现有数据...');
                    return [4 /*yield*/, prisma.booking.deleteMany({})];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, prisma.serviceTranslation.deleteMany({})];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, prisma.service.deleteMany({})];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, prisma.therapistTranslation.deleteMany({})];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, prisma.therapist.deleteMany({})];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, prisma.user.deleteMany({})];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, prisma.shopSettingTranslation.deleteMany({})];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, prisma.shopSetting.deleteMany({})];
                case 9:
                    _e.sent();
                    return [4 /*yield*/, prisma.message.deleteMany({})];
                case 10:
                    _e.sent();
                    console.log('已清理现有数据');
                    // 创建管理员用户
                    console.log('正在创建管理员用户...');
                    return [4 /*yield*/, bcrypt.hash('admin123', 10)];
                case 11:
                    adminPassword = _e.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'admin@example.com',
                                passwordHash: adminPassword,
                                name: 'Admin User',
                                role: client_1.UserRole.ADMIN,
                            },
                        })];
                case 12:
                    admin = _e.sent();
                    console.log('已创建管理员用户:', admin.email);
                    // 创建服务
                    console.log('正在创建服务示例数据...');
                    services = [
                        {
                            price: 800,
                            duration: 60,
                            imageUrl: '/images/traditional-thai-new.jpg',
                            translations: [
                                {
                                    locale: 'en',
                                    name: 'Traditional Thai Massage',
                                    description: 'Ancient techniques to relieve tension with authentic techniques.',
                                    slug: 'traditional-thai-massage',
                                },
                                {
                                    locale: 'zh',
                                    name: '传统泰式按摩',
                                    description: '使用正宗技术的古老按摩方法，缓解身体紧张。',
                                    slug: 'traditional-thai-massage',
                                },
                                {
                                    locale: 'th',
                                    name: 'นวดแผนไทยโบราณ',
                                    description: 'เทคนิคโบราณเพื่อบรรเทาความตึงเครียดด้วยเทคนิคดั้งเดิม',
                                    slug: 'traditional-thai-massage',
                                },
                                {
                                    locale: 'ko',
                                    name: '전통 태국 마사지',
                                    description: '정통 기법으로 긴장을 완화하는 고대 기술.',
                                    slug: 'traditional-thai-massage',
                                },
                            ],
                        },
                        {
                            price: 800,
                            duration: 60,
                            imageUrl: '/images/neck-shoulder-new.jpg',
                            translations: [
                                {
                                    locale: 'en',
                                    name: 'Neck & Shoulder Massage',
                                    description: 'Focused massage to relieve tension in your neck and shoulders.',
                                    slug: 'neck-shoulder-massage',
                                },
                                {
                                    locale: 'zh',
                                    name: '颈肩按摩',
                                    description: '专注于缓解颈部和肩部紧张的按摩。',
                                    slug: 'neck-shoulder-massage',
                                },
                                {
                                    locale: 'th',
                                    name: 'นวดคอและไหล่',
                                    description: 'การนวดที่มุ่งเน้นเพื่อบรรเทาความตึงเครียดในคอและไหล่ของคุณ',
                                    slug: 'neck-shoulder-massage',
                                },
                                {
                                    locale: 'ko',
                                    name: '목과 어깨 마사지',
                                    description: '목과 어깨의 긴장을 완화하는 집중 마사지.',
                                    slug: 'neck-shoulder-massage',
                                },
                            ],
                        },
                        {
                            price: 800,
                            duration: 60,
                            imageUrl: '/images/oil-massage-new.jpg',
                            translations: [
                                {
                                    locale: 'en',
                                    name: 'Oil Massage',
                                    description: 'Relaxing massage with aromatic oils to soothe your body and mind.',
                                    slug: 'oil-massage',
                                },
                                {
                                    locale: 'zh',
                                    name: '精油按摩',
                                    description: '使用芳香精油的放松按摩，舒缓您的身心。',
                                    slug: 'oil-massage',
                                },
                                {
                                    locale: 'th',
                                    name: 'นวดน้ำมัน',
                                    description: 'การนวดผ่อนคลายด้วยน้ำมันหอมระเหยเพื่อบรรเทาร่างกายและจิตใจของคุณ',
                                    slug: 'oil-massage',
                                },
                                {
                                    locale: 'ko',
                                    name: '오일 마사지',
                                    description: '아로마 오일로 몸과 마음을 진정시키는 편안한 마사지.',
                                    slug: 'oil-massage',
                                },
                            ],
                        },
                        {
                            price: 800,
                            duration: 60,
                            imageUrl: '/images/aromatherapy-massage.jpg',
                            translations: [
                                {
                                    locale: 'en',
                                    name: 'Aromatherapy Massage',
                                    description: 'Therapeutic massage with essential oils for deep relaxation.',
                                    slug: 'aromatherapy-massage',
                                },
                                {
                                    locale: 'zh',
                                    name: '芳香疗法按摩',
                                    description: '使用精油的治疗按摩，带来深度放松。',
                                    slug: 'aromatherapy-massage',
                                },
                                {
                                    locale: 'th',
                                    name: 'นวดอโรมาเธอราพี',
                                    description: 'การนวดบำบัดด้วยน้ำมันหอมระเหยเพื่อการผ่อนคลายอย่างลึกซึ้ง',
                                    slug: 'aromatherapy-massage',
                                },
                                {
                                    locale: 'ko',
                                    name: '아로마테라피 마사지',
                                    description: '에센셜 오일을 사용한 치료 마사지로 깊은 휴식을 제공합니다.',
                                    slug: 'aromatherapy-massage',
                                },
                            ],
                        },
                        {
                            price: 800,
                            duration: 60,
                            imageUrl: '/images/deep-tissue-new.jpg',
                            translations: [
                                {
                                    locale: 'en',
                                    name: 'Deep Tissue Massage',
                                    description: 'Intense massage targeting deep muscle layers for pain relief.',
                                    slug: 'deep-tissue-massage',
                                },
                                {
                                    locale: 'zh',
                                    name: '深层组织按摩',
                                    description: '针对深层肌肉的强力按摩，缓解疼痛。',
                                    slug: 'deep-tissue-massage',
                                },
                                {
                                    locale: 'th',
                                    name: 'นวดเนื้อเยื่อลึก',
                                    description: 'การนวดอย่างเข้มข้นที่มุ่งเป้าไปที่ชั้นกล้ามเนื้อลึกเพื่อบรรเทาอาการปวด',
                                    slug: 'deep-tissue-massage',
                                },
                                {
                                    locale: 'ko',
                                    name: '딥 티슈 마사지',
                                    description: '통증 완화를 위해 깊은 근육층을 대상으로 하는 강렬한 마사지.',
                                    slug: 'deep-tissue-massage',
                                },
                            ],
                        },
                        {
                            price: 800,
                            duration: 60,
                            imageUrl: '/images/foot-massage.jpg',
                            translations: [
                                {
                                    locale: 'en',
                                    name: 'Foot Massage',
                                    description: 'Reflexology techniques to revitalize your feet and body.',
                                    slug: 'foot-massage',
                                },
                                {
                                    locale: 'zh',
                                    name: '足部按摩',
                                    description: '反射区按摩技术，为您的双脚和身体注入活力。',
                                    slug: 'foot-massage',
                                },
                                {
                                    locale: 'th',
                                    name: 'นวดเท้า',
                                    description: 'เทคนิคการนวดกดจุดเพื่อฟื้นฟูเท้าและร่างกายของคุณ',
                                    slug: 'foot-massage',
                                },
                                {
                                    locale: 'ko',
                                    name: '발 마사지',
                                    description: '발과 신체에 활력을 불어넣는 반사 요법 기술.',
                                    slug: 'foot-massage',
                                },
                            ],
                        },
                    ];
                    _i = 0, services_1 = services;
                    _e.label = 13;
                case 13:
                    if (!(_i < services_1.length)) return [3 /*break*/, 16];
                    serviceData = services_1[_i];
                    translations = serviceData.translations, serviceInfo = __rest(serviceData, ["translations"]);
                    return [4 /*yield*/, prisma.service.create({
                            data: __assign(__assign({}, serviceInfo), { translations: {
                                    create: translations,
                                } }),
                        })];
                case 14:
                    _e.sent();
                    _e.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 13];
                case 16:
                    console.log('已创建服务示例数据');
                    // 创建按摩师
                    console.log('正在创建按摩师示例数据...');
                    therapists = [
                        {
                            imageUrl: '/images/therapist-1.jpg',
                            specialties: ['Traditional Thai Massage', 'Oil Massage'],
                            experienceYears: 8,
                            translations: [
                                {
                                    locale: 'en',
                                    name: 'Somying',
                                    bio: 'Somying is a certified massage therapist with 8 years of experience. She specializes in traditional Thai massage and oil massage.',
                                    specialtiesTranslation: ['Traditional Thai Massage', 'Oil Massage'],
                                },
                                {
                                    locale: 'zh',
                                    name: '索明',
                                    bio: '索明是一位拥有8年经验的认证按摩师。她专长于传统泰式按摩和精油按摩。',
                                    specialtiesTranslation: ['传统泰式按摩', '精油按摩'],
                                },
                                {
                                    locale: 'th',
                                    name: 'สมหญิง',
                                    bio: 'สมหญิงเป็นนักนวดที่ได้รับการรับรองด้วยประสบการณ์ 8 ปี เธอเชี่ยวชาญในการนวดแผนไทยโบราณและนวดน้ำมัน',
                                    specialtiesTranslation: ['นวดแผนไทยโบราณ', 'นวดน้ำมัน'],
                                },
                                {
                                    locale: 'ko',
                                    name: '솜잉',
                                    bio: '솜잉은 8년의 경험을 가진 인증된 마사지 치료사입니다. 그녀는 전통 태국 마사지와 오일 마사지를 전문으로 합니다.',
                                    specialtiesTranslation: ['전통 태국 마사지', '오일 마사지'],
                                },
                            ],
                        },
                        {
                            imageUrl: '/images/therapist-2.jpg',
                            specialties: ['Aromatherapy Massage', 'Deep Tissue Massage'],
                            experienceYears: 10,
                            translations: [
                                {
                                    locale: 'en',
                                    name: 'Nattaya',
                                    bio: 'Nattaya has 10 years of experience in aromatherapy and deep tissue massage. She is known for her strong hands and attention to detail.',
                                    specialtiesTranslation: ['Aromatherapy Massage', 'Deep Tissue Massage'],
                                },
                                {
                                    locale: 'zh',
                                    name: '娜塔雅',
                                    bio: '娜塔雅在芳香疗法和深层组织按摩方面拥有10年经验。她以手法强劲和注重细节而闻名。',
                                    specialtiesTranslation: ['芳香疗法按摩', '深层组织按摩'],
                                },
                                {
                                    locale: 'th',
                                    name: 'ณัฐญา',
                                    bio: 'ณัฐญามีประสบการณ์ 10 ปีในการนวดอโรมาเธอราพีและนวดเนื้อเยื่อลึก เธอเป็นที่รู้จักในด้านมือที่แข็งแรงและความใส่ใจในรายละเอียด',
                                    specialtiesTranslation: ['นวดอโรมาเธอราพี', 'นวดเนื้อเยื่อลึก'],
                                },
                                {
                                    locale: 'ko',
                                    name: '나타야',
                                    bio: '나타야는 아로마테라피와 딥 티슈 마사지 분야에서 10년의 경험을 가지고 있습니다. 그녀는 강한 손과 세심한 주의력으로 유명합니다.',
                                    specialtiesTranslation: ['아로마테라피 마사지', '딥 티슈 마사지'],
                                },
                            ],
                        },
                        {
                            imageUrl: '/images/therapist-3.jpg',
                            specialties: ['Foot Massage', 'Neck & Shoulder Massage'],
                            experienceYears: 7,
                            translations: [
                                {
                                    locale: 'en',
                                    name: 'Pranee',
                                    bio: 'Pranee specializes in foot massage and neck & shoulder massage. With 7 years of experience, she knows how to relieve tension in the most stressed areas.',
                                    specialtiesTranslation: ['Foot Massage', 'Neck & Shoulder Massage'],
                                },
                                {
                                    locale: 'zh',
                                    name: '帕尼',
                                    bio: '帕尼专长于足部按摩和颈肩按摩。凭借7年的经验，她知道如何缓解最紧张区域的压力。',
                                    specialtiesTranslation: ['足部按摩', '颈肩按摩'],
                                },
                                {
                                    locale: 'th',
                                    name: 'ปราณี',
                                    bio: 'ปราณีเชี่ยวชาญในการนวดเท้าและนวดคอและไหล่ ด้วยประสบการณ์ 7 ปี เธอรู้วิธีบรรเทาความตึงเครียดในพื้นที่ที่เครียดมากที่สุด',
                                    specialtiesTranslation: ['นวดเท้า', 'นวดคอและไหล่'],
                                },
                                {
                                    locale: 'ko',
                                    name: '프라니',
                                    bio: '프라니는 발 마사지와 목과 어깨 마사지를 전문으로 합니다. 7년의 경험으로 가장 스트레스가 많은 부위의 긴장을 완화하는 방법을 알고 있습니다.',
                                    specialtiesTranslation: ['발 마사지', '목과 어깨 마사지'],
                                },
                            ],
                        },
                        {
                            imageUrl: '/images/therapist-4.jpg',
                            specialties: ['Traditional Thai Massage', 'Deep Tissue Massage'],
                            experienceYears: 9,
                            translations: [
                                {
                                    locale: 'en',
                                    name: 'Malai',
                                    bio: 'Malai has 9 years of experience in traditional Thai massage and deep tissue massage. Her strong technique helps relieve chronic pain and tension.',
                                    specialtiesTranslation: ['Traditional Thai Massage', 'Deep Tissue Massage'],
                                },
                                {
                                    locale: 'zh',
                                    name: '玛莱',
                                    bio: '玛莱在传统泰式按摩和深层组织按摩方面拥有9年经验。她的强劲技术有助于缓解慢性疼痛和紧张。',
                                    specialtiesTranslation: ['传统泰式按摩', '深层组织按摩'],
                                },
                                {
                                    locale: 'th',
                                    name: 'มาลัย',
                                    bio: 'มาลัยมีประสบการณ์ 9 ปีในการนวดแผนไทยโบราณและนวดเนื้อเยื่อลึก เทคนิคที่แข็งแกร่งของเธอช่วยบรรเทาอาการปวดเรื้อรังและความตึงเครียด',
                                    specialtiesTranslation: ['นวดแผนไทยโบราณ', 'นวดเนื้อเยื่อลึก'],
                                },
                                {
                                    locale: 'ko',
                                    name: '말라이',
                                    bio: '말라이는 전통 태국 마사지와 딥 티슈 마사지 분야에서 9년의 경험을 가지고 있습니다. 그녀의 강한 기술은 만성 통증과 긴장을 완화하는 데 도움이 됩니다.',
                                    specialtiesTranslation: ['전통 태국 마사지', '딥 티슈 마사지'],
                                },
                            ],
                        },
                    ];
                    _a = 0, therapists_1 = therapists;
                    _e.label = 17;
                case 17:
                    if (!(_a < therapists_1.length)) return [3 /*break*/, 20];
                    therapistData = therapists_1[_a];
                    translations = therapistData.translations, therapistInfo = __rest(therapistData, ["translations"]);
                    return [4 /*yield*/, prisma.therapist.create({
                            data: __assign(__assign({}, therapistInfo), { translations: {
                                    create: translations,
                                } }),
                        })];
                case 18:
                    _e.sent();
                    _e.label = 19;
                case 19:
                    _a++;
                    return [3 /*break*/, 17];
                case 20:
                    console.log('已创建按摩师示例数据');
                    // 创建店铺设置
                    console.log('正在创建店铺设置示例数据...');
                    shopSettings = [
                        {
                            key: 'shop_name',
                            type: 'text',
                            translations: [
                                {
                                    locale: 'en',
                                    value: "Top Secret Outcall Massage",
                                },
                                {
                                    locale: 'zh',
                                    value: '维多利亚上门按摩',
                                },
                                {
                                    locale: 'th',
                                    value: 'นวดนอกสถานที่วิคตอเรีย',
                                },
                                {
                                    locale: 'ko',
                                    value: '빅토리아 출장 마사지',
                                },
                            ],
                        },
                        {
                            key: 'shop_address',
                            type: 'text',
                            translations: [
                                {
                                    locale: 'en',
                                    value: 'Sukhumvit Soi 13, Klongtoey Nua, Watthana, Bangkok, 10110',
                                },
                                {
                                    locale: 'zh',
                                    value: '曼谷市瓦塔纳区克隆托伊努阿素坤逸13巷，邮编10110',
                                },
                                {
                                    locale: 'th',
                                    value: 'สุขุมวิท ซอย 13, คลองเตยเหนือ, วัฒนา, กรุงเทพฯ, 10110',
                                },
                                {
                                    locale: 'ko',
                                    value: '수쿰빗 소이 13, 클롱토이 누아, 왓타나, 방콕, 10110',
                                },
                            ],
                        },
                        {
                            key: 'shop_phone',
                            type: 'text',
                            translations: [
                                {
                                    locale: 'en',
                                    value: '+66 XX XXX XXXX',
                                },
                                {
                                    locale: 'zh',
                                    value: '+66 XX XXX XXXX',
                                },
                                {
                                    locale: 'th',
                                    value: '+66 XX XXX XXXX',
                                },
                                {
                                    locale: 'ko',
                                    value: '+66 XX XXX XXXX',
                                },
                            ],
                        },
                        {
                            key: 'shop_email',
                            type: 'text',
                            translations: [
                                {
                                    locale: 'en',
                                    value: 'info@victorias-bangkok.com',
                                },
                                {
                                    locale: 'zh',
                                    value: 'info@victorias-bangkok.com',
                                },
                                {
                                    locale: 'th',
                                    value: 'info@victorias-bangkok.com',
                                },
                                {
                                    locale: 'ko',
                                    value: 'info@victorias-bangkok.com',
                                },
                            ],
                        },
                        {
                            key: 'shop_working_hours',
                            type: 'text',
                            translations: [
                                {
                                    locale: 'en',
                                    value: 'Available 24/7',
                                },
                                {
                                    locale: 'zh',
                                    value: '24/7全天候服务',
                                },
                                {
                                    locale: 'th',
                                    value: 'ให้บริการตลอด 24 ชั่วโมงทุกวัน',
                                },
                                {
                                    locale: 'ko',
                                    value: '24시간 연중무휴 이용 가능',
                                },
                            ],
                        },
                    ];
                    _b = 0, shopSettings_1 = shopSettings;
                    _e.label = 21;
                case 21:
                    if (!(_b < shopSettings_1.length)) return [3 /*break*/, 24];
                    settingData = shopSettings_1[_b];
                    translations = settingData.translations, settingInfo = __rest(settingData, ["translations"]);
                    return [4 /*yield*/, prisma.shopSetting.create({
                            data: __assign(__assign({}, settingInfo), { translations: {
                                    create: translations,
                                } }),
                        })];
                case 22:
                    _e.sent();
                    _e.label = 23;
                case 23:
                    _b++;
                    return [3 /*break*/, 21];
                case 24:
                    console.log('已创建店铺设置示例数据');
                    // 创建示例预约
                    console.log('正在创建预约示例数据...');
                    return [4 /*yield*/, prisma.service.findMany({
                            take: 2,
                        })];
                case 25:
                    services1 = _e.sent();
                    return [4 /*yield*/, prisma.therapist.findMany({
                            take: 2,
                        })];
                case 26:
                    therapists1 = _e.sent();
                    if (!(services1.length > 0 && therapists1.length > 0)) return [3 /*break*/, 31];
                    bookings = [
                        {
                            serviceId: services1[0].id,
                            therapistId: therapists1[0].id,
                            date: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明天
                            time: '14:00',
                            customerName: 'John Doe',
                            customerEmail: 'john@example.com',
                            customerPhone: '+1 234 567 8901',
                            status: client_1.BookingStatus.CONFIRMED,
                        },
                        {
                            serviceId: services1[1].id,
                            therapistId: therapists1[1].id,
                            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 后天
                            time: '16:30',
                            customerName: 'Jane Smith',
                            customerEmail: 'jane@example.com',
                            customerPhone: '+1 987 654 3210',
                            status: client_1.BookingStatus.PENDING,
                        },
                    ];
                    _c = 0, bookings_1 = bookings;
                    _e.label = 27;
                case 27:
                    if (!(_c < bookings_1.length)) return [3 /*break*/, 30];
                    bookingData = bookings_1[_c];
                    return [4 /*yield*/, prisma.booking.create({
                            data: bookingData,
                        })];
                case 28:
                    _e.sent();
                    _e.label = 29;
                case 29:
                    _c++;
                    return [3 /*break*/, 27];
                case 30:
                    console.log('已创建预约示例数据');
                    _e.label = 31;
                case 31:
                    // 创建示例留言
                    console.log('正在创建留言示例数据...');
                    messages = [
                        {
                            name: 'Robert Johnson',
                            email: 'robert@example.com',
                            phone: '+1 123 456 7890',
                            subject: 'Question about services',
                            message: 'I would like to know more about your aromatherapy massage. What essential oils do you use?',
                            status: client_1.MessageStatus.UNREAD,
                        },
                        {
                            name: 'Lisa Wong',
                            email: 'lisa@example.com',
                            phone: '+1 234 567 8901',
                            subject: 'Feedback',
                            message: 'I had a wonderful experience with Nattaya. Her deep tissue massage was exactly what I needed for my back pain.',
                            status: client_1.MessageStatus.READ,
                            reply: 'Thank you for your feedback, Lisa! We are glad to hear that you enjoyed your massage with Nattaya. We look forward to serving you again soon.',
                        },
                    ];
                    _d = 0, messages_1 = messages;
                    _e.label = 32;
                case 32:
                    if (!(_d < messages_1.length)) return [3 /*break*/, 35];
                    messageData = messages_1[_d];
                    return [4 /*yield*/, prisma.message.create({
                            data: messageData,
                        })];
                case 33:
                    _e.sent();
                    _e.label = 34;
                case 34:
                    _d++;
                    return [3 /*break*/, 32];
                case 35:
                    console.log('已创建留言示例数据');
                    console.log('示例数据添加完成！');
                    return [3 /*break*/, 39];
                case 36:
                    error_1 = _e.sent();
                    console.error('添加示例数据时出错:', error_1);
                    throw error_1;
                case 37: return [4 /*yield*/, prisma.$disconnect()];
                case 38:
                    _e.sent();
                    return [7 /*endfinally*/];
                case 39: return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('添加示例数据时出错:', e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
