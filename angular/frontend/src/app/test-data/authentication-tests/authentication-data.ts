import { AuthLoginModel } from '../../models/auth-login.model';
import { AuthDataModel } from '../../models/auth-data.model';


export const authData: AuthDataModel = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5MTgyODQ3NSwiaWF0IjoxNjkxODI4Mjk1LCJqdGkiOiJmZDZiOTFhMzI1OTY0ZWVkYThiMzFkOGUzZDc5NjllZCIsInVzZXJfaWQiOjExfQ.TyLkjur3cgeC85Tyjq0W45E9iawWs-sV1JPRImLfMuQ',
    accessExpDate: new Date(),
    refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkxODI4MzU1LCJpYXQiOjE2OTE4MjgyOTUsImp0aSI6ImQwNjZlYzU3ZDhkMTRlZDM4OTVlMTVkMjhiMGFhNjUxIiwidXNlcl9pZCI6MTF9.w2ZvyAiwUFH9jKJoHZisiQZkUPMRak7hW-h1Wnc7hHo',  
    refreshExp: new Date(),
};

export const httpTokensResponse = {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY5MTgyODQ3NSwiaWF0IjoxNjkxODI4Mjk1LCJqdGkiOiJmZDZiOTFhMzI1OTY0ZWVkYThiMzFkOGUzZDc5NjllZCIsInVzZXJfaWQiOjExfQ.TyLkjur3cgeC85Tyjq0W45E9iawWs-sV1JPRImLfMuQ",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjkxODI4MzU1LCJpYXQiOjE2OTE4MjgyOTUsImp0aSI6ImQwNjZlYzU3ZDhkMTRlZDM4OTVlMTVkMjhiMGFhNjUxIiwidXNlcl9pZCI6MTF9.w2ZvyAiwUFH9jKJoHZisiQZkUPMRak7hW-h1Wnc7hHo"
}

export const loginData: AuthLoginModel = {
    username: 'testusername',
    password: 'testpassword',
  };


  
