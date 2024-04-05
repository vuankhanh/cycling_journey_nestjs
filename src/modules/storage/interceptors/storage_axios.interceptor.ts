import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { StorageHelperService } from '../storage_helper.service';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { RedisService } from 'src/shared/services/redis.service';

@Injectable()
export class StorageAxiosInterceptor {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private storageHelperService: StorageHelperService,
    private redisService: RedisService
  ) {
    this.interceptor();
  }

  interceptor(){
    this.httpService.axiosRef.interceptors.request.use(async(config) => {
      if(!config['_retry']){
        // console.log(config.data);
        const accessToken = await this.redisService.get('storageAccessToken');
        if(accessToken) config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    });

    this.httpService.axiosRef.interceptors.response.use(
      undefined,
      async(error: AxiosError) => {
        const originalRequest = error.config;
        
        if(error.response && error.response.status === 401 && !originalRequest['_retry']){
          originalRequest['_retry'] = true;
          return this.handle401(originalRequest)
        }
        return Promise.reject(error);
      }
    )
  }

  private async handle401(originalRequest: InternalAxiosRequestConfig<any>){
    const refreshToken: string = await this.redisService.get('storageRefreshToken');
    if(refreshToken){
      try {
        const data = await this.storageHelperService.refreshToken(refreshToken);
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return this.httpService.axiosRef(originalRequest);
      } catch (error) {
        if(error.response.status === 403){
          return this.handle403(originalRequest);
        }
        return Promise.reject(error);
      }
    }else{
      return this.handle403(originalRequest);
    }
  }

  private async handle403(originalRequest: InternalAxiosRequestConfig<any>){
    const userName = this.configService.get('storage.userName');
    const password = this.configService.get('storage.password');
    try {
      const data = await this.storageHelperService.login(userName, password);
      originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
      if(originalRequest.data instanceof FormData){
        const data: FormData = originalRequest.data;
        
        if(data['_released']){
          return Promise.reject('request_has_been_released');
        }
      }
      return this.httpService.axiosRef(originalRequest);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
