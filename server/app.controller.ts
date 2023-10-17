import {
  Get,
  Res,
  Put,
  Post,
  Body,
  Query,
  Delete,
  Request,
  Controller,
  UploadedFile,
  UseInterceptors,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';

import { AppService } from './app.service';
import { AccessTokenGuard } from './common/guards/accessToken.guard';

import { SigninDto } from './common/dto/signin.dto';
import { TokenDto } from './common/dto/token.dto';

@Controller('ftp')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('connect')
  async connect(@Body() signinAuthDto: SigninDto): Promise<TokenDto> {
    return await this.appService.connect(signinAuthDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async files(@Request() req: Record<string, any>, @Query('path') path: string) {
    return await this.appService.files(req.user, path);
  }

  @Get('download')
  @UseGuards(AccessTokenGuard)
  async download(
    @Request() req: Record<string, any>,
    @Query('path') path: string,
    @Query('filename') filename: string,
    @Res() res: Response
  ) {
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader('Content-Disposition', `attachment; filename=${encodedFilename}`);
    res.setHeader('Content-Type', 'application/octet-stream');
    this.appService.download(req.user, `${path}/${filename}`, res);
  }

  @Post('upload/file')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Request() req: Record<string, any>,
    @Body('path') path: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.appService.upload(req.user, path, file);
  }

  @Post('upload/folder')
  @UseGuards(AccessTokenGuard)
  async uploadFolder(@Request() req: Record<string, any>, @Body('path') path: string) {
    return await this.appService.folder(req.user, path);
  }

  @Put()
  @UseGuards(AccessTokenGuard)
  async rename(
    @Request() req: Record<string, any>,
    @Body('path') path: string,
    @Body('newPath') newPath: string
  ) {
    return await this.appService.rename(req.user, path, newPath);
  }

  @Delete()
  @UseGuards(AccessTokenGuard)
  async remove(
    @Request() req: Record<string, any>,
    @Query('path') path: string,
    @Query('type') type: number
  ) {
    return await this.appService.remove(req.user, path, type);
  }
}
