import * as ftp from 'basic-ftp';
import { FTPResponse, FileInfo } from 'basic-ftp';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Readable } from 'stream';

import { SigninDto } from './common/dto/signin.dto';
import { TokenDto } from './common/dto/token.dto';
import { JwtPayload } from './common/strategies/accessToken.strategy';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async generateToken(host: string, port: number, user: string, password: string) {
    const accessToken = await this.jwtService.signAsync(
      { host, port, user, password },
      {
        secret: this.configService.get('jwtAccessSecret'),
        expiresIn: this.configService.get('jwtAccessExpiresIn')
      }
    );
    return { accessToken };
  }

  async connect({ host, port, user, password }: SigninDto): Promise<TokenDto> {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
      await client.access({ host, port, user, password });
      const response = await client.list();
      if (!response) {
        throw new BadRequestException('The FTP Connection is incorrect');
      }
      return await this.generateToken(host, port, user, password);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async files(config: JwtPayload, path: string): Promise<FileInfo[]> {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
      await client.access(config);
      if (path) {
        await client.cd(path);
      }
      return await client.list();
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.close();
    }
  }

  async download(config: JwtPayload, path: string, res: any) {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
      await client.access(config);
      const writableStream = res;
      await client.downloadTo(writableStream, path, 0);
      return;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to download the file from FTP');
    } finally {
      client.close();
    }
  }

  async upload(config: JwtPayload, path: string, file: any) {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
      await client.access(config);
      const fileStream = new Readable();
      fileStream._read = () => {};
      fileStream.push(file.buffer);
      fileStream.push(null);
      return await client.uploadFrom(fileStream, `${path}/${file.originalname}`);
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.close();
    }
  }

  async folder(config: JwtPayload, path: string) {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
      await client.access(config);
      return await client.ensureDir(path);
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.close();
    }
  }

  async rename(config: JwtPayload, path: string, newPath: string): Promise<FTPResponse> {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
      await client.access(config);
      return await client.rename(path, newPath);
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.close();
    }
  }

  async remove(config: JwtPayload, path: string, type: number) {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    try {
      await client.access(config);
      if (type === 1) {
        return await client.remove(path);
      } else if (type === 2) {
        return await client.removeDir(path);
      } else {
        throw new Error("Couldn't open the file or directory");
      }
    } catch (err) {
      throw new Error(err.message);
    } finally {
      client.close();
    }
  }
}
