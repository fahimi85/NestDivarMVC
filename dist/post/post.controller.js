"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const persian_tools_1 = require("@persian-tools/persian-tools");
const got_1 = require("got");
const app_key_guard_1 = require("../common/guards/app-key.guard");
const is_public_decorator_1 = require("../common/guards/is-public.decorator");
const event_entity_1 = require("../event/entities/event.entity");
const pagination_dto_1 = require("./dto/pagination.dto");
const create_post_dto_1 = require("./dtos/create-post.dto");
const update_post_dto_1 = require("./dtos/update-post.dto");
const post_service_1 = require("./post.service");
let PostController = class PostController {
    constructor(postService) {
        this.postService = postService;
    }
    async root(res) {
        var categorylist = ['انتخاب دسته بندی', "buy-old-house", "buy-villa", "buy-apartment", "buy-residential", "auto", "classic-car", "rental-car", "heavy-car", "electronic-devices", "home-kitchen", "services", "personal-goods", "entertainment", "social-services", "tools-materials-equipment", "jobs"];
        var response2 = await (0, got_1.default)(`https://api.divar.ir/v8/web-search/mashhad/${categorylist[1]}`);
        var json = JSON.parse(response2.body);
        var carlist = [];
        json.widget_list.forEach((item) => {
            var descript = item.data.description;
            var splitpriceANDkilometer = descript.split(`\n`);
            var kilometer = splitpriceANDkilometer[1];
            if (categorylist[1] == 'auto') {
                var price = splitpriceANDkilometer[1];
            }
            else {
                var price = splitpriceANDkilometer[0];
            }
            var carobject = {
                title: item.data.title,
                price: (price == undefined) ? "" : price,
                kilometer: (kilometer == undefined) ? "" : kilometer,
                image: item.data.image
            };
            carlist.push(carobject);
        });
        var sum = 0;
        var count = 0;
        var priclist = [];
        var advertic = ``;
        carlist.forEach(item => {
            if (item.price != "") {
                var splitpriceANDtoman = item.price.replace('تومان', '');
                var splitpriceANDtoman2 = splitpriceANDtoman.replace(',', '');
                var splitpriceANDtoman3 = splitpriceANDtoman2.replace(',', '');
                if (Number.isInteger(parseInt((0, persian_tools_1.digitsFaToEn)(splitpriceANDtoman3)))) {
                    sum = sum + parseInt((0, persian_tools_1.digitsFaToEn)(splitpriceANDtoman3));
                    priclist.push(parseInt((0, persian_tools_1.digitsFaToEn)(splitpriceANDtoman3)));
                    count++;
                }
            }
        });
        var average = Math.floor(sum / count);
        let domain = Math.max(...priclist) - Math.min(...priclist);
        let charak1 = Math.min(...priclist) + Math.floor(domain / 4);
        let charak2 = Math.min(...priclist) + Math.floor(domain / 2);
        let charak3 = Math.min(...priclist) + Math.floor((domain / 4) * 3);
        let countFistScope = 0;
        let countSecondeScope = 0;
        let countThiredeScope = 0;
        let countFourthScope = 0;
        priclist.forEach(item => {
            if (item >= Math.min(...priclist) && item < charak1) {
                countFistScope++;
            }
            else if (item >= charak1 && item < charak2) {
                countSecondeScope++;
            }
            else if (item >= charak2 && item < charak3) {
                countThiredeScope++;
            }
            else if (item >= charak3 && Math.max(...priclist) >= item) {
                countFourthScope++;
            }
        });
        let percentFistScope = ((countFistScope / count) * 100).toFixed(2);
        let percentSecondeScope = ((countSecondeScope / count) * 100).toFixed(2);
        let percentThiredScope = ((countThiredeScope / count) * 100).toFixed(2);
        let percentFourthScope = ((countFourthScope / count) * 100).toFixed(2);
        return res.render('index', {
            category: categorylist[1],
            title: 'دیوار من',
            message: 'Hello world!',
            listselect: categorylist,
            minprice: Math.min(...priclist),
            maxprice: Math.max(...priclist),
            charak1: charak1,
            charak2: charak2,
            charak3: charak3,
            percentFistScope: percentFistScope,
            percentSecondeScope: percentSecondeScope,
            percentThiredScope: percentThiredScope,
            percentFourthScope: percentFourthScope,
            EnToFaAve: (0, persian_tools_1.digitsEnToFa)(average),
            EnToFaMax: (0, persian_tools_1.digitsEnToFa)(Math.max(...priclist)),
            EnToFaMin: (0, persian_tools_1.digitsEnToFa)(Math.min(...priclist)),
            carlist: carlist
        });
    }
    findAll() {
        return this.postService.findAll();
    }
    async root2(res, category) {
        var categorylist = ['انتخاب دسته بندی', "buy-old-house", "buy-villa", "buy-apartment", "buy-residential", "auto", "classic-car", "rental-car", "heavy-car", "electronic-devices", "home-kitchen", "services", "personal-goods", "entertainment", "social-services", "tools-materials-equipment", "jobs"];
        var response2 = await (0, got_1.default)(`https://api.divar.ir/v8/web-search/mashhad/${category}`);
        var json = JSON.parse(response2.body);
        var carlist = [];
        json.widget_list.forEach((item) => {
            var descript = item.data.description;
            var splitpriceANDkilometer = descript.split(`\n`);
            var kilometer = splitpriceANDkilometer[1];
            if (category == 'auto') {
                var price = splitpriceANDkilometer[1];
            }
            else {
                var price = splitpriceANDkilometer[0];
            }
            var carobject = {
                title: item.data.title,
                price: (price == undefined) ? "" : price,
                kilometer: (kilometer == undefined) ? "" : kilometer,
                image: item.data.image
            };
            carlist.push(carobject);
        });
        var sum = 0;
        var count = 0;
        var priclist = [];
        carlist.forEach(item => {
            if (item.price != "") {
                var splitpriceANDtoman = item.price.replace('تومان', '');
                var splitpriceANDtoman2 = splitpriceANDtoman.replace(',', '');
                var splitpriceANDtoman3 = splitpriceANDtoman2.replace(',', '');
                if (Number.isInteger(parseInt((0, persian_tools_1.digitsFaToEn)(splitpriceANDtoman3)))) {
                    sum = sum + parseInt((0, persian_tools_1.digitsFaToEn)(splitpriceANDtoman3));
                    priclist.push(parseInt((0, persian_tools_1.digitsFaToEn)(splitpriceANDtoman3)));
                }
            }
            count++;
        });
        var average = Math.floor(sum / count);
        let domain = Math.max(...priclist) - Math.min(...priclist);
        let charak1 = Math.min(...priclist) + Math.floor(domain / 4);
        let charak2 = Math.min(...priclist) + Math.floor(domain / 2);
        let charak3 = Math.min(...priclist) + Math.floor((domain / 4) * 3);
        let countFistScope = 0;
        let countSecondeScope = 0;
        let countThiredeScope = 0;
        let countFourthScope = 0;
        priclist.forEach(item => {
            if (item >= Math.min(...priclist) && item < charak1) {
                countFistScope++;
            }
            else if (item >= charak1 && item < charak2) {
                countSecondeScope++;
            }
            else if (item >= charak2 && item < charak3) {
                countThiredeScope++;
            }
            else if (item >= charak3 && Math.max(...priclist) >= item) {
                countFourthScope++;
            }
        });
        let percentFistScope = ((countFistScope / count) * 100).toFixed(2);
        let percentSecondeScope = ((countSecondeScope / count) * 100).toFixed(2);
        let percentThiredScope = ((countThiredeScope / count) * 100).toFixed(2);
        let percentFourthScope = ((countFourthScope / count) * 100).toFixed(2);
        return res.render('index', {
            category: category,
            title: 'دیوار من',
            message: 'Hello world!',
            listselect: categorylist,
            minprice: Math.min(...priclist),
            maxprice: Math.max(...priclist),
            charak1: charak1,
            charak2: charak2,
            charak3: charak3,
            percentFistScope: percentFistScope,
            percentSecondeScope: percentSecondeScope,
            percentThiredScope: percentThiredScope,
            percentFourthScope: percentFourthScope,
            EnToFaAve: (0, persian_tools_1.digitsEnToFa)(average),
            EnToFaMax: (0, persian_tools_1.digitsEnToFa)(Math.max(...priclist)),
            EnToFaMin: (0, persian_tools_1.digitsEnToFa)(Math.min(...priclist)),
            carlist: carlist
        });
    }
    findAllPaginated(query) {
        return this.postService.findAll(query);
    }
    findOne(id) {
        return this.postService.findOne(parseInt(id));
    }
    insert(body) {
        return this.postService.create(body);
    }
    update(id, body) {
        return this.postService.update(id, body);
    }
    patch(id, body) {
        console.log(body instanceof update_post_dto_1.UpdatePostDto);
        return this.postService.update(+id, body);
    }
    delete(id) {
        return this.postService.delete(+id);
    }
    like(id, userId, type) {
        console.log('event');
        console.log(id);
        return this.postService.event(+id, type, userId);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, is_public_decorator_1.isPublic)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "root", null);
__decorate([
    (0, common_1.Get)('/:category'),
    (0, is_public_decorator_1.isPublic)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "root2", null);
__decorate([
    (0, common_1.Get)('/paginate'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "findAllPaginated", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, is_public_decorator_1.isPublic)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "insert", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_post_dto_1.UpdatePostDto]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id/event/:type/:userId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", void 0)
], PostController.prototype, "like", null);
PostController = __decorate([
    (0, common_1.Controller)('post'),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
exports.PostController = PostController;
//# sourceMappingURL=post.controller.js.map