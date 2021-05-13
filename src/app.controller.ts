import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import axios from 'axios';
import { stringify } from 'qs';
import * as Client from 'ssh2-sftp-client';

interface ConnectConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  privateKey?: Buffer | string;
  passphrase?: string;
}
@Controller()
export class AppController {
  @Post()
  async checkSSH(@Body() connectConfig: ConnectConfig): Promise<string> {
    console.log('Testing SSH connectivity...');
    try {
      const client = new Client();
      await client.connect(connectConfig);
    } catch (error) {
      console.dir(error);
      return error;
    }
  }

  @Get('ip')
  async checkIP(): Promise<string> {
    console.log('Testing IP...');
    try {
      const resp = await axios.get('https://api.uat.equifax.ca/logs/v1');
      return resp.data;
    } catch (error) {
      console.dir(error);
      return error.response.data;
    }
  }

  @Get('auth/:autorization')
  async getToken(@Param('autorization') autorization: string): Promise<string> {
    console.log('Testing Equifax Authentication');
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: autorization,
      },
    };

    console.log('Options:');
    console.log(options);

    const data = stringify({
      grant_type: 'client_credentials',
      scope: 'https://api.equifax.ca/inquiry/1.0/sts',
    });

    console.log('Data:');
    console.log(data);

    try {
      const authResponse = await axios.post(
        'https://api.uat.equifax.ca/v2/oauth/token',
        data,
        options,
      );
      console.dir(authResponse);
      return authResponse.data;
    } catch (error) {
      console.dir(error);
    }

    return null;
  }
}
