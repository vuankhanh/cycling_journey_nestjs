import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TPrepareFileForFormdata } from 'src/shared/interfaces/files.interface';
import * as FormData from 'form-data';
import { HttpService } from '@nestjs/axios';
import { AxiosInstance } from 'axios';

@Injectable()
export class StorageService {
  private storageServer: string;
  private http: AxiosInstance = this.httpService.axiosRef;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const protocol = this.configService.get('storage.protocol');
    const host = this.configService.get('storage.host');
    const port = this.configService.get('storage.port');

    this.storageServer = `${protocol}://${host}:${port}`;
  }

  async ensurePath(path: string) {
    const url = `${this.storageServer}/api/directory/ensure_dir`;

    const data = await this.httpService.axiosRef.post(url, null, {
      params: {
        path
      }
    }).then(res => res.data);

    return data;
  }

  async forwardFile(path: string, files: Array<TPrepareFileForFormdata>) {
    if (!files.length) return;
    const url = `${this.storageServer}/api/file/upload`;

    const formData = new FormData();
    for (const file of files) {
      formData.append('file', file.file.buffer, { filename: file.file.originalname });
      formData.append('file', file.thumbnail.buffer, { filename: file.thumbnail.originalname });
    }


    async function sendData(http: AxiosInstance, url: string, formData: FormData, path: string) {
      return http.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          path
        }
      }).then(res => {
        return res.data;
      });
    }

    try {
      // Gửi yêu cầu HTTP POST đến server đích với dữ liệu là formData
      return await await sendData(this.http, url, formData, path);
    } catch (error) {
      console.log('catch error');
      console.log(error);

      if (error === 'request_has_been_released') {
        console.log('run this...');

        return await sendData(this.http, url, formData, path);
      }

      Promise.reject(error);
    }
  }
}
