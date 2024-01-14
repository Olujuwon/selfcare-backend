export interface ITask {
  id?: number;
  name: string;
  description: string;
  schedule: Date;
  created_at?: Date;
  updated_at?: Date;
  status: 'new' | 'completed' | 'archived' | 'deleted';
  user_id?: number;
}

export interface IUser {
  id?: string;
  display_name: string;
  photo_url: string;
  phone_number: string;
  email: string;
  token?: string;
  password?: string;
}

export interface IServiceBearerToken {
  token: string;
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
