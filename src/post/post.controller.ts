import {
  Res,
  Render,
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Param,
  Body,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { digitsArToEn, digitsEnToFa, digitsFaToAr, digitsFaToEn } from "@persian-tools/persian-tools";
import { isNumber } from 'class-validator';
import got from 'got';
import { number } from 'joi';
import { AppKeyGuard } from 'src/common/guards/app-key.guard';
import { isPublic } from 'src/common/guards/is-public.decorator';
import { EventTypes } from 'src/event/entities/event.entity';
import { PaginationDto } from './dto/pagination.dto';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostService } from './post.service';
import { Response } from 'express';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) { }

  @Get()
  @isPublic()

  async root(@Res() res: Response) {
    var categorylist = ['انتخاب دسته بندی', "buy-old-house", "buy-villa", "buy-apartment", "buy-residential", "auto", "classic-car", "rental-car", "heavy-car", "electronic-devices", "home-kitchen", "services", "personal-goods", "entertainment", "social-services", "tools-materials-equipment", "jobs"]
    var response2 = await got(`https://api.divar.ir/v8/web-search/mashhad/${categorylist[1]}`);
    var json = JSON.parse(response2.body);
    var carlist: { title: string, price: string, kilometer: string, image: ImageData }[] = []
    json.widget_list.forEach((item: { data: { description: string; title: string; image: ImageData; }; }) => {

      var descript = item.data.description
      var splitpriceANDkilometer: string[] = descript.split(`\n`)
      var kilometer: string = splitpriceANDkilometer[1];
      if (categorylist[1] == 'auto') {
        var price: string = splitpriceANDkilometer[1]
      } else {
        var price: string = splitpriceANDkilometer[0]
      } var carobject = {
        title: item.data.title,
        price: (price == undefined) ? "" : price,
        kilometer: (kilometer == undefined) ? "" : kilometer,
        image: item.data.image
      }

      carlist.push(carobject)
    });
    var sum = 0
    var count = 0
    var priclist = []
    var advertic = ``
    carlist.forEach(item => {
      if (item.price != "") {
        var splitpriceANDtoman: string = item.price.replace('تومان', '')
        var splitpriceANDtoman2: string = splitpriceANDtoman.replace(',', '')
        var splitpriceANDtoman3: string = splitpriceANDtoman2.replace(',', '')
        // console.log(digitsFaToEn(splitpriceANDtoman3), splitpriceANDtoman3)
        if (Number.isInteger(parseInt(digitsFaToEn(splitpriceANDtoman3)))) {
          sum = sum + parseInt(digitsFaToEn(splitpriceANDtoman3))
          priclist.push(parseInt(digitsFaToEn(splitpriceANDtoman3)))
          count++// just count define price

        }
      }
    })
    var average = Math.floor(sum / count)
    let domain = Math.max(...priclist) - Math.min(...priclist)
    let charak1 = Math.min(...priclist) + Math.floor(domain / 4)
    let charak2 = Math.min(...priclist) + Math.floor(domain / 2)
    let charak3 = Math.min(...priclist) + Math.floor((domain / 4) * 3)
    let countFistScope = 0
    let countSecondeScope = 0
    let countThiredeScope = 0
    let countFourthScope = 0
    priclist.forEach(item => {
      if (item >= Math.min(...priclist) && item < charak1) {
        countFistScope++
      } else if (item >= charak1 && item < charak2) {
        countSecondeScope++
      } else if (item >= charak2 && item < charak3) {
        countThiredeScope++
      } else if (item >= charak3 && Math.max(...priclist) >= item) {
        countFourthScope++
      }
    })

    let percentFistScope = ((countFistScope / count) * 100).toFixed(2)
    let percentSecondeScope = ((countSecondeScope / count) * 100).toFixed(2)
    let percentThiredScope = ((countThiredeScope / count) * 100).toFixed(2)
    let percentFourthScope = ((countFourthScope / count) * 100).toFixed(2)

    return res.render('index',
      {
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
        EnToFaAve: digitsEnToFa(average),
        EnToFaMax: digitsEnToFa(Math.max(...priclist)),
        EnToFaMin: digitsEnToFa(Math.min(...priclist)),
        carlist: carlist




      })
  }


  findAll() {
    return this.postService.findAll();
  }
  @Get('/:category')
  @isPublic()
  async root2(@Res() res: Response, @Param('category') category) {
    var categorylist = ['انتخاب دسته بندی', "buy-old-house", "buy-villa", "buy-apartment", "buy-residential", "auto", "classic-car", "rental-car", "heavy-car", "electronic-devices", "home-kitchen", "services", "personal-goods", "entertainment", "social-services", "tools-materials-equipment", "jobs"]


    var response2 = await got(`https://api.divar.ir/v8/web-search/mashhad/${category}`);
    var json = JSON.parse(response2.body);
    var carlist: { title: string, price: string, kilometer: string, image: ImageData }[] = []
    json.widget_list.forEach((item: { data: { description: string; title: string; image: ImageData; }; }) => {

      var descript = item.data.description
      var splitpriceANDkilometer: string[] = descript.split(`\n`)
      var kilometer: string = splitpriceANDkilometer[1];
      if (category == 'auto') {
        var price: string = splitpriceANDkilometer[1]
      } else {
        var price: string = splitpriceANDkilometer[0]
      }
      var carobject = {
        title: item.data.title,
        price: (price == undefined) ? "" : price,
        kilometer: (kilometer == undefined) ? "" : kilometer,
        image: item.data.image
      }

      carlist.push(carobject)
    });
    var sum = 0
    var count = 0
    var priclist = []
    carlist.forEach(item => {
      if (item.price != "") {
        var splitpriceANDtoman: string = item.price.replace('تومان', '')
        var splitpriceANDtoman2: string = splitpriceANDtoman.replace(',', '')
        var splitpriceANDtoman3: string = splitpriceANDtoman2.replace(',', '')
        // console.log(digitsFaToEn(splitpriceANDtoman3), splitpriceANDtoman3)
        if (Number.isInteger(parseInt(digitsFaToEn(splitpriceANDtoman3)))) {
          sum = sum + parseInt(digitsFaToEn(splitpriceANDtoman3))
          priclist.push(parseInt(digitsFaToEn(splitpriceANDtoman3)))

        }
      }

      count++
    })
    var average = Math.floor(sum / count)
    let domain = Math.max(...priclist) - Math.min(...priclist)
    let charak1 = Math.min(...priclist) + Math.floor(domain / 4)
    let charak2 = Math.min(...priclist) + Math.floor(domain / 2)
    let charak3 = Math.min(...priclist) + Math.floor((domain / 4) * 3)

    let countFistScope = 0
    let countSecondeScope = 0
    let countThiredeScope = 0
    let countFourthScope = 0
    priclist.forEach(item => {
      if (item >= Math.min(...priclist) && item < charak1) {
        countFistScope++
      } else if (item >= charak1 && item < charak2) {
        countSecondeScope++
      } else if (item >= charak2 && item < charak3) {
        countThiredeScope++
      } else if (item >= charak3 && Math.max(...priclist) >= item) {
        countFourthScope++
      }
    })

    let percentFistScope = ((countFistScope / count) * 100).toFixed(2)
    let percentSecondeScope = ((countSecondeScope / count) * 100).toFixed(2)
    let percentThiredScope = ((countThiredeScope / count) * 100).toFixed(2)
    let percentFourthScope = ((countFourthScope / count) * 100).toFixed(2)
    return res.render('index',
      {
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
        EnToFaAve: digitsEnToFa(average),
        EnToFaMax: digitsEnToFa(Math.max(...priclist)),
        EnToFaMin: digitsEnToFa(Math.min(...priclist)),
        carlist: carlist

      })
  }


  @Get('/paginate')
  findAllPaginated(@Query() query: PaginationDto) {
    return this.postService.findAll(query);
  }

  @Get('/:id')
  @isPublic()
  findOne(@Param('id') id) {
    return this.postService.findOne(parseInt(id));
  }

  @Post('/')
  insert(@Body() body: CreatePostDto) {
    return this.postService.create(body);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePostDto) {
    return this.postService.update(id, body);
  }

  @Patch(':id')
  patch(@Param('id') id, @Body() body: UpdatePostDto) {
    console.log(body instanceof UpdatePostDto);
    return this.postService.update(+id, body);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.postService.delete(+id);
  }

  @Patch(':id/event/:type/:userId')
  like(
    @Param('id') id,
    @Param('userId') userId,
    @Param('type') type: EventTypes,
  ) {
    console.log('event');
    console.log(id);
    return this.postService.event(+id, type, userId);
  }
}
